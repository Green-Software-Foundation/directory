import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ProjectCard } from "./project-card";
import { SearchableList } from "./ui/searchable-list";

export default function ProjectsList({ projects }) {
  // Get unique lifecycle stages and working groups
  const lifecycleStages = [...new Set(projects.map(project => project.data.lifecycleStage))]
    .filter(Boolean)
  const workingGroups = [...new Set(projects.map(project => project.data.workingGroup?.name))].filter(Boolean);

  const filters = [
    {
      name: "Lifecycle Stage",
      options: lifecycleStages,
      key: "data.lifecycleStage",
      customSort: (a, b) => {
        const order = ['Proposal', 'Pre-draft', 'Draft', 'Approved', 'Ratified', 'Published', 'Historic'];
        return order.indexOf((a as string)) - order.indexOf((b as string));
      }
    },
    {
      name: "Working Groups",
      options: workingGroups,
      key: "data.workingGroup.name"
    }
  ];

  const renderProjects = (filteredProjects: typeof projects) => {
    return (
      <div className="grid grid-col-1 lg:grid-cols-2 gap-5">
        {filteredProjects
          .sort((a, b) => a.data.title.localeCompare(b.data.title))
          .map((project) => (
            <ProjectCard
              key={project.id}
              {...project.data}
              className="w-full"
            />
          ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-primary-dark">Projects</h1>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <SearchableList
          items={projects}
          searchKeys={['data.title']}
          placeholder="Search projects..."
          renderItems={renderProjects}
          filters={filters as any}
          
        />
      </div>
    </div>
  );
}
