export interface Project {
  id: string;
  title: string;
  slug?: string;
  type: string;
  description?: string;
  workingGroup?: {
    name?: string;
  };
  icon?: string;
  lifecycleStage?: string;
  launchDate?: string;
}