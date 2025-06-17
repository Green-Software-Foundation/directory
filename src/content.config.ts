import { defineCollection } from "astro:content";
import { processData } from "./utils/data-fetcher";
import { mapNotionToProject, mapNotionToMember, mapNotionToWorkingGroup, mapNotionToCommittee } from "./utils/mappers";
import { projectsSchema, membersSchema, workingGroupsSchema, committeesSchema } from "./schemas/notion";
import { type NotionPage } from "./types/notion";

// Define collections
const projects = defineCollection({
  loader: async () => {
    try {
      const { projectsResponse, subscriptionResponse } = await processData();

      // Transform Notion response to match our schema
      const projects = await Promise.all(
        (projectsResponse.results as NotionPage[]).map(async (page) => 
          mapNotionToProject(page, subscriptionResponse)
        )
      );

      return projects;
    } catch (error) {
      console.error("Error fetching Notion data:", error);
      return [];
    }
  },
  schema: projectsSchema,
});

const members = defineCollection({
  loader: async () => {
    try {
      const { membersResponse, orgLeadsDict } = await processData();

      const members = (membersResponse.results as NotionPage[]).map((page) => 
        mapNotionToMember(page, orgLeadsDict)
      );
      
      return members;
    } catch (error) {
      console.error("Error fetching Notion data for members:", error);
      return [];
    }
  },
  schema: membersSchema,
});

const workingGroups = defineCollection({
  loader: async () => {
    try {
      const { workingGroupsResponse, subscriptionResponse, projectsResponse } = await processData();

      // Transform Notion response to match our schema
      const workingGroups = await Promise.all(
        (workingGroupsResponse.results as NotionPage[]).map(async (page) => 
          mapNotionToWorkingGroup(page, subscriptionResponse, projectsResponse)
        )
      );

      return workingGroups;
    } catch (error) {
      console.error("Error fetching working groups data:", error);
      return [];
    }
  },
  schema: workingGroupsSchema,
});

const committees = defineCollection({
  loader: async () => {
    try {
      const { committeesResponse, subscriptionResponse, projectsResponse } = await processData();

      // Transform Notion response to match our schema
      const committees = await Promise.all(
        (committeesResponse.results as NotionPage[]).map(async (page) => 
          mapNotionToCommittee(page, subscriptionResponse, projectsResponse)
        )
      );

      return committees;
    } catch (error) {
      console.error("Error fetching committees data:", error);
      return [];
    }
  },
  schema: committeesSchema,
});

export const collections = {
  projects,
  members,
  workingGroups,
  committees,
};
