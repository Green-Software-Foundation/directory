import { notion, saveIconToFolder, createOrgLeadsDict } from "./notion";
import { type NotionData, type NotionPage, type NotionSubscription } from "../types/notion";
import type { PageObjectResponse, QueryDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";

/**
 * Helper function to fetch all pages from a Notion database with pagination support
 */
async function fetchAllPagesFromDatabase(params: Parameters<typeof notion.databases.query>[0]): Promise<QueryDatabaseResponse> {
  let allResults: PageObjectResponse[] = [];
  let hasMore = true;
  let startCursor: string | undefined = undefined;
  
  while (hasMore) {
    const response = await notion.databases.query({
      ...params,
      start_cursor: startCursor,
    });
    
    // Add the current page of results
    const pageResults = response.results.filter((page): page is PageObjectResponse => 
      'properties' in page
    );
    allResults = [...allResults, ...pageResults];
    
    // Check if there are more pages to fetch
    hasMore = response.has_more;
    startCursor = response.next_cursor || undefined;
  }
  
  return {
    results: allResults,
    has_more: false,
    next_cursor: null,
    object: 'list',
    type: 'page_or_database',
    page_or_database: {}
  };
}

/**
 * Fetches all required data from Notion
 */
export async function fetchNotionData(): Promise<Omit<NotionData, 'orgLeadsDict'>> {
  try {
    // Fetch projects
    const projectsResponse = await fetchAllPagesFromDatabase({
      database_id: import.meta.env.NOTION_PROJECTS_DATABASE_ID,
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
    const subscriptionResponse = await fetchAllPagesFromDatabase({
      database_id: import.meta.env.NOTION_SUBSCRIPTIONS_DATABASE_ID,
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
    const membersResponse = await fetchAllPagesFromDatabase({
      database_id: import.meta.env.NOTION_MEMBERS_DATABASE_ID,
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
    const workingGroupsResponse = await fetchAllPagesFromDatabase({
      database_id: import.meta.env.NOTION_PROJECTS_DATABASE_ID,
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
    const committeesResponse = await fetchAllPagesFromDatabase({
      database_id: import.meta.env.NOTION_PROJECTS_DATABASE_ID,
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