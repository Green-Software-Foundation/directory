import { z } from "astro:content";

// Define common schema types to reduce duplication
const personSchema = z.object({
  id: z.string(),
  name: z.string().nullish(),
  role: z.string().nullish(),
  city: z.string().nullish(),
  title: z.string().nullish(),
  company: z.string().nullish(),
  linkedin: z.string().url().nullish(),
});

const baseEntitySchema = {
  id: z.string(),
  title: z.string(),
  type: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  website: z.string().url().nullish(),
  repo: z.string().url().nullish(),
  googleGroup: z.string().email().nullish(),
  pageContent: z.string().optional(),
  leads: z.array(personSchema.nullish()),
};

// Define the schema for your Notion data
export const projectsSchema = z.object({
  ...baseEntitySchema,
  workingGroup: z.object({
    name: z.string().optional(),
  }),
  lifecycleStage: z.string().optional(),
  launchDate: z.string().optional(),
});

export const membersSchema = z.object({
  id: z.string(),
  logo: z.string().nullish(),
  name: z.string(),
  description: z.string().nullish(),
  level: z.string(),
  website: z.string().nullish(),
  membershipSince: z.string().nullish(),
  leads: z.array(personSchema.nullish()).optional(),
});

// Define schema for working groups
export const workingGroupsSchema = z.object({
  ...baseEntitySchema,
  projects: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        type: z.string(),
        icon: z.string().optional(),
        workingGroup: z
          .object({
            name: z.string().optional(),
          })
          .optional(),
      })
    )
    .optional(),
});

// Define schema for committees
export const committeesSchema = z.object({
  ...baseEntitySchema,
  members: z.array(personSchema.nullish()).optional(),
  projects: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        description: z.string().optional(),
        type: z.string(),
        icon: z.string().optional(),
        workingGroup: z
          .object({
            name: z.string().optional(),
          })
          .optional(),
      })
    )
    .optional(),
});