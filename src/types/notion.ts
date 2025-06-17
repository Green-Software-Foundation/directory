/**
 * Type definitions for Notion API responses and related data structures
 */

export interface NotionPage {
  id: string;
  icon?: {
    type?: string;
    [key: string]: any;
  };
  properties: Record<string, any>;
}

export interface NotionSubscription {
  properties: {
    [key: string]: any;
    "API-MN"?: { formula?: { string?: string } };
    "Role for Subscription"?: { select?: { name?: string } };
    Volunteers?: { relation?: Array<{ id: string }> };
    PWCIs?: { relation?: Array<{ id: string }> };
    "First Name"?: { rollup?: { array?: Array<{ rich_text?: Array<{ plain_text?: string }> }> } };
    Surname?: { rollup?: { array?: Array<{ rich_text?: Array<{ plain_text?: string }> }> } };
    City?: { rollup?: { array?: Array<{ rich_text?: Array<{ plain_text?: string }> }> } };
    Title?: { rollup?: { array?: Array<{ rich_text?: Array<{ plain_text?: string }> }> } };
    "Volunteer LinkedIn"?: { rollup?: { array?: Array<{ url?: string }> } };
  };
}

export interface Person {
  id: string;
  name?: string;
  role?: string;
  city?: string;
  title?: string;
  company?: string;
  linkedin?: string;
}

export interface Project {
  id: string;
  title: string;
  type: string;
  description?: string;
  workingGroup?: {
    name?: string;
  };
  icon?: string;
  website?: string;
  repo?: string;
  googleGroup?: string;
  pageContent?: string;
  lifecycleStage?: string;
  launchDate?: string;
  leads?: Person[];
}

export interface Member {
  id: string;
  logo?: string;
  name: string;
  description?: string;
  level?: string;
  website?: string;
  membershipSince?: string;
  leads?: Person[];
}

export interface WorkingGroup {
  id: string;
  title: string;
  type: string;
  description?: string;
  icon?: string;
  website?: string;
  repo?: string;
  googleGroup?: string;
  pageContent?: string;
  leads?: Person[];
  projects?: Project[];
}

export interface Committee {
  id: string;
  title: string;
  type: string;
  description?: string;
  icon?: string;
  website?: string;
  repo?: string;
  googleGroup?: string;
  pageContent?: string;
  leads?: Person[];
  members?: Person[];
  projects?: Project[];
}

export interface NotionData {
  projectsResponse: { results: NotionPage[] };
  subscriptionResponse: { results: NotionSubscription[] };
  membersResponse: { results: NotionPage[] };
  workingGroupsResponse: { results: NotionPage[] };
  committeesResponse: { results: NotionPage[] };
  orgLeadsDict: Record<string, Person[]>;
}