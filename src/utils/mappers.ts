import { type NotionPage, type NotionSubscription, type Person, type Project, type Member, type WorkingGroup, type Committee } from "../types/notion";
import { extractPersonFromSubscription, fetchPageContent, formatDate } from "./notion";

/**
 * Maps a Notion project page to our Project schema
 */
export async function mapNotionToProject(
  page: NotionPage, 
  subscriptionResponse: { results: NotionSubscription[] }
): Promise<Project> {
  const title = page.properties.Name?.title?.[0]?.plain_text || "";
  const iconUrl = page.icon?.[page.icon?.type]?.url;
  const iconExtension = iconUrl?.split("?")[0].split(".").pop();
  const icon = iconUrl ? `/assets/projects/${page.id}.${iconExtension}` : undefined;
  
  const leads = subscriptionResponse.results.filter((subscription) => {
    return subscription.properties.PWCIs?.relation?.some(
      (relation) => relation.id === page.id
    );
  });

  const pageContent = await fetchPageContent(page.id);
  
  return {
    id: page.id,
    title,
    type: page.properties.Type?.select?.name || "",
    description: page.properties.Description?.rich_text?.[0]?.plain_text || "",
    workingGroup: {
      name: page.properties["Parent"]?.select?.name || "",
    },
    icon,
    website: page.properties["Website URL"]?.url,
    repo: page.properties["Repo URL"]?.url,
    googleGroup: page.properties["Google Group"]?.email?.trim(),
    pageContent,
    lifecycleStage: page.properties["Lifecycle Stage"]?.select?.name,
    launchDate: formatDate(page.properties["Launch date"]?.date?.start),
    leads: leads.map((subscription) => extractPersonFromSubscription(subscription)),
  };
}

/**
 * Maps a Notion member page to our Member schema
 */
export function mapNotionToMember(
  page: NotionPage, 
  orgLeadsDict: Record<string, Person[]>
): Member {
  const name = page.properties["Member Name "]?.title?.[0]?.plain_text || "";
  const description = page.properties.Description?.rich_text?.[0]?.plain_text;
  const logoUrl = page.properties.Logo?.files?.[0]?.file?.url;
  const logoExtension = logoUrl?.split("?")[0].split(".").pop();
  const logo = logoUrl ? `/assets/members/${page.id}.${logoExtension}` : undefined;
  const level = page.properties["Membership Level "]?.select?.name;
  const website = page.properties["Website"]?.url;
  const membershipSince = formatDate(page.properties["Membership Start Date"]?.date?.start);
  
  return {
    id: page.id,
    logo,
    name,
    description,
    level,
    website,
    membershipSince,
    leads: orgLeadsDict[name],
  };
}

/**
 * Maps a Notion project to a simplified Project schema for related projects
 */
export function mapToRelatedProject(project: NotionPage, parentTitle: string): Project {
  const projectTitle = project.properties.Name?.title?.[0]?.plain_text || "";
  const projectIconUrl = project.icon?.[project.icon?.type]?.url;
  const projectIconExtension = projectIconUrl?.split("?")[0].split(".").pop();
  const projectIcon = projectIconUrl
    ? `/assets/projects/${project.id}.${projectIconExtension}`
    : undefined;

  return {
    id: project.id,
    title: projectTitle,
    description: project.properties.Description?.rich_text?.[0]?.plain_text || "",
    type: project.properties.Type?.select?.name || "",
    icon: projectIcon,
    workingGroup: {
      name: parentTitle,
    },
  };
}

/**
 * Maps a Notion working group page to our WorkingGroup schema
 */
export async function mapNotionToWorkingGroup(
  page: NotionPage, 
  subscriptionResponse: { results: NotionSubscription[] },
  projectsResponse: { results: NotionPage[] }
): Promise<WorkingGroup> {
  const title = page.properties.Name?.title?.[0]?.plain_text || "";
  const iconUrl = page.icon?.[page.icon?.type]?.url;
  const iconExtension = iconUrl?.split("?")[0].split(".").pop();
  const icon = iconUrl ? `/assets/working-groups/${page.id}.${iconExtension}` : undefined;

  // Find leads for this working group
  const leads = subscriptionResponse.results.filter((subscription) => {
    return subscription.properties.PWCIs?.relation?.some(
      (relation) => relation.id === page.id
    );
  });

  const pageContent = await fetchPageContent(page.id);

  // Find projects that belong to this working group
  const relatedProjects = (projectsResponse.results as NotionPage[])
    .filter((project) => {
      return project.properties["Parent"]?.select?.name === title;
    })
    .map((project) => mapToRelatedProject(project, title));

  return {
    id: page.id,
    title,
    type: page.properties.Type?.select?.name || "Working Group",
    description: page.properties.Description?.rich_text?.[0]?.plain_text || "",
    icon,
    website: page.properties["Website URL"]?.url,
    repo: page.properties["Repo URL"]?.url,
    googleGroup: page.properties["Google Group"]?.email?.trim(),
    pageContent,
    leads: leads.map((subscription) => extractPersonFromSubscription(subscription)),
    projects: relatedProjects,
  };
}

/**
 * Maps a Notion committee page to our Committee schema
 */
export async function mapNotionToCommittee(
  page: NotionPage, 
  subscriptionResponse: { results: NotionSubscription[] },
  projectsResponse: { results: NotionPage[] }
): Promise<Committee> {
  const title = page.properties.Name?.title?.[0]?.plain_text || "";
  const iconUrl = page.icon?.[page.icon?.type]?.url;
  const iconExtension = iconUrl?.split("?")[0].split(".").pop();
  const icon = iconUrl ? `/assets/committees/${page.id}.${iconExtension}` : undefined;

  // Find people for this committee
  const committeePeople = subscriptionResponse.results.filter((subscription) => {
    return subscription.properties.PWCIs?.relation?.some(
      (relation) => relation.id === page.id
    );
  });
  
  const leads = committeePeople.filter((subscription) => {
    return (
      subscription.properties["Role for Subscription"]?.select?.name === "Committee Chair" ||
      subscription.properties["Role for Subscription"]?.select?.name === "Committee Vice-Chair"
    );
  });
  
  const members = committeePeople.filter((subscription) => {
    return (
      subscription.properties["Role for Subscription"]?.select?.name === "Committee Member"
    );
  });

  const pageContent = await fetchPageContent(page.id);

  // Find projects that belong to this committee
  const relatedProjects = (projectsResponse.results as NotionPage[])
    .filter((project) => {
      return project.properties["Parent"]?.select?.name === title;
    })
    .map((project) => mapToRelatedProject(project, title));

  return {
    id: page.id,
    title,
    type: page.properties.Type?.select?.name || "Committee",
    description: page.properties.Description?.rich_text?.[0]?.plain_text || "",
    icon,
    website: page.properties["Website URL"]?.url,
    repo: page.properties["Repo URL"]?.url,
    googleGroup: page.properties["Google Group"]?.email?.trim(),
    pageContent,
    leads: leads.map((subscription) => extractPersonFromSubscription(subscription)),
    members: members.map((subscription) => extractPersonFromSubscription(subscription)),
    projects: relatedProjects,
  };
}