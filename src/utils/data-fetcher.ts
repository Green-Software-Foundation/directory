import { notion, saveIconToFolder, createOrgLeadsDict } from "./notion";
import { type NotionData, type NotionPage, type NotionSubscription } from "../types/notion";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

type DataSourceQueryParams = Omit<Parameters<typeof notion.dataSources.query>[0], "data_source_id">;
type QueryDataSourceResponse = Awaited<ReturnType<typeof notion.dataSources.query>>;

const dataSourceIdCache = new Map<string, string>();

async function resolveDataSourceId(options: {
  databaseId: string;
  dataSourceId?: string;
  label?: string;
}): Promise<string> {
  const { databaseId, dataSourceId, label } = options;
  if (dataSourceId) return dataSourceId;

  const cached = dataSourceIdCache.get(databaseId);
  if (cached) return cached;

  const database = await notion.databases.retrieve({ database_id: databaseId });
  const dataSources = (database as { data_sources?: Array<{ id: string; name?: string }> }).data_sources ?? [];

  if (!dataSources.length) {
    throw new Error(`No data sources found for database ${label ?? databaseId}.`);
  }

  if (dataSources.length > 1) {
    const first = dataSources[0];
    console.warn(
      `[notion] Database ${label ?? databaseId} has multiple data sources; using the first one (${
        first.name ?? first.id
      }). Set a NOTION_*_DATA_SOURCE_ID env var to override.`
    );
  }

  const selectedId = dataSources[0].id;
  dataSourceIdCache.set(databaseId, selectedId);
  return selectedId;
}

/**
 * Helper function to fetch all pages from a Notion data source with pagination support
 */
async function fetchAllPagesFromDataSource(
  dataSourceId: string,
  params: DataSourceQueryParams
): Promise<QueryDataSourceResponse> {
  let allResults: PageObjectResponse[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;
  let lastResponse: QueryDataSourceResponse | undefined = undefined;
  
  while (hasMore) {
    const response = await notion.dataSources.query({
      ...params,
      data_source_id: dataSourceId,
      start_cursor: startCursor,
    });
    lastResponse = response;
    
    // Add the current page of results
    const pageResults = response.results.filter((page): page is PageObjectResponse => 
      'properties' in page
    );
    allResults = [...allResults, ...pageResults];
    
    // Check if there are more pages to fetch
    hasMore = response.has_more;
    startCursor = response.next_cursor || undefined;
  }
  
  if (!lastResponse) {
    throw new Error(`No response returned when querying data source ${dataSourceId}.`);
  }

  return {
    ...lastResponse,
    results: allResults,
    has_more: false,
    next_cursor: null,
  };
}

/**
 * Fetches all required data from Notion
 */
export async function fetchNotionData(): Promise<Omit<NotionData, 'orgLeadsDict'>> {
  try {
    const projectsDataSourceId = await resolveDataSourceId({
      databaseId: import.meta.env.NOTION_PROJECTS_DATABASE_ID,
      dataSourceId: import.meta.env.NOTION_PROJECTS_DATA_SOURCE_ID,
      label: "projects",
    });
    const subscriptionsDataSourceId = await resolveDataSourceId({
      databaseId: import.meta.env.NOTION_SUBSCRIPTIONS_DATABASE_ID,
      dataSourceId: import.meta.env.NOTION_SUBSCRIPTIONS_DATA_SOURCE_ID,
      label: "subscriptions",
    });
    const membersDataSourceId = await resolveDataSourceId({
      databaseId: import.meta.env.NOTION_MEMBERS_DATABASE_ID,
      dataSourceId: import.meta.env.NOTION_MEMBERS_DATA_SOURCE_ID,
      label: "members",
    });

    // Fetch projects
    const projectsResponse = await fetchAllPagesFromDataSource(projectsDataSourceId, {
      filter: {
        and: [
          {
            property: "Internal Status",
            select: {
              equals: "Active",
            },
          },
          {
            property: "Type",
            or: [
              {
                property: "Type",
                select: {
                  equals: "Committee Project",
                },
              },
              {
                property: "Type",
                select: {
                  equals: "WG Project",
                },
              },
            ],
          },
          {
            property: "Offer Subscription",
            select: {
              equals: "Yes",
            },
          },
        ],
      },
    });

    // Fetch subscriptions
    const subscriptionResponse = await fetchAllPagesFromDataSource(subscriptionsDataSourceId, {
      filter: {
        and: [
          {
            property: "Subscription Status",
            select: {
              equals: "Active",
            },
          },
          {
            property: "Role for Subscription",
            or: [
              { property: "Role for Subscription", select: { equals: "Organization Lead" } },
              { property: "Role for Subscription", select: { equals: "Working Group Chair" } },
              { property: "Role for Subscription", select: { equals: "Project Lead" } },
              { property: "Role for Subscription", select: { equals: "Project Co-Lead" } },
              { property: "Role for Subscription", select: { equals: "Committee Chair" } },
              { property: "Role for Subscription", select: { equals: "Committee Vice-Chair" } },
              { property: "Role for Subscription", select: { equals: "Committee Member" } },
            ],
          },
        ],
      },
    });

    // Fetch members
    const membersResponse = await fetchAllPagesFromDataSource(membersDataSourceId, {
      filter: {
        and: [
          {
            property: "Status",
            select: {
              equals: "Active",
            },
          },
        ],
      },
    });

    // Fetch working groups
    const workingGroupsResponse = await fetchAllPagesFromDataSource(projectsDataSourceId, {
      filter: {
        and: [
          {
            property: "Internal Status",
            select: {
              equals: "Active",
            },
          },
          {
            property: "Type",
            select: {
              equals: "Working Group",
            },
          },
        ],
      },
    });

    // Fetch committees
    const committeesResponse = await fetchAllPagesFromDataSource(projectsDataSourceId, {
      filter: {
        and: [
          {
            property: "Internal Status",
            select: {
              equals: "Active",
            },
          },
          {
            property: "Type",
            select: {
              equals: "Committee",
            },
          },
        ],
      },
    });

    return {
      projectsResponse: {
        results: projectsResponse.results.filter((page): page is PageObjectResponse => 
          'properties' in page
        ) as NotionPage[]
      },
      subscriptionResponse: {
        results: subscriptionResponse.results.filter((page): page is PageObjectResponse => 
          'properties' in page
        ) as NotionSubscription[]
      },
      membersResponse: {
        results: membersResponse.results.filter((page): page is PageObjectResponse => 
          'properties' in page
        ) as NotionPage[]
      },
      workingGroupsResponse: {
        results: workingGroupsResponse.results.filter((page): page is PageObjectResponse => 
          'properties' in page
        ) as NotionPage[]
      },
      committeesResponse: {
        results: committeesResponse.results.filter((page): page is PageObjectResponse => 
          'properties' in page
        ) as NotionPage[]
      },
    };
  } catch (error) {
    console.error("Error fetching data from Notion:", error);
    throw error;
  }
}

/**
 * Processes and saves all data from Notion
 */
export async function processData(): Promise<NotionData> {
  const {
    projectsResponse,
    subscriptionResponse,
    membersResponse,
    workingGroupsResponse,
    committeesResponse,
  } = await fetchNotionData();

  // Save icons for all entities in parallel
  await Promise.all([
    ...((projectsResponse.results as NotionPage[]).map(page => 
      saveIconToFolder(page, "projects")
    )),
    ...((workingGroupsResponse.results as NotionPage[]).map(page => 
      saveIconToFolder(page, "working-groups")
    )),
    ...((committeesResponse.results as NotionPage[]).map(page => 
      saveIconToFolder(page, "committees")
    ))
  ]);

  // Save member logos
  await Promise.all(
    (membersResponse.results as NotionPage[]).map(async (page) => {
      if (page.properties.Logo?.files?.[0]?.file?.url) {
        return saveIconToFolder({
          id: page.id,
          properties: page.properties,
          icon: {
            type: 'file',
            file: { url: page.properties.Logo.files[0].file.url }
          }
        }, "members");
      }
      return Promise.resolve();
    })
  );

  const orgLeadsDict = createOrgLeadsDict(subscriptionResponse);

  return {
    projectsResponse,
    subscriptionResponse,
    membersResponse,
    workingGroupsResponse,
    committeesResponse,
    orgLeadsDict,
  };
}
