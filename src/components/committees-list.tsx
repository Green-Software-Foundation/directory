import { CommitteeCard } from "./committee-card";
import { Title } from "./title";
import { useState } from "react";
import { SearchableList } from "./ui/searchable-list";

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
  leads?: {
    id?: string;
    name?: string;
    role?: string;
    city?: string;
    title?: string;
    company?: string;
    linkedin?: string;
  }[];
  members?: {
    id?: string;
    name?: string;
    role?: string;
    city?: string;
    title?: string;
    company?: string;
    linkedin?: string;
  }[];
  projects?: {
    id: string;
    title: string;
    description?: string;
    type: string;
    icon?: string;
    workingGroup?: {
      name?: string;
    };
  }[];
}

interface CommitteesListProps {
  committees: Committee[];
}

export default function CommitteesList({ committees }: CommitteesListProps) {
  if (!committees || committees.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-bold text-gray-darker">
          No committees found
        </h2>
        <p className="text-gray-dark mt-2">
          There are currently no committees available.
        </p>
      </div>
    );
  }

  const renderCommittees = (filteredCommittees: Committee[]) => {
    return (
      <div className="grid grid-col-1 lg:grid-cols-2 gap-5">
        {filteredCommittees
          .sort((a, b) => a.title.localeCompare(b.title))
          .map((committee) => (
            <CommitteeCard
              key={committee.id}
              title={committee.title}
              description={committee.description}
              icon={committee.icon}
              projects={committee.projects}
              className="w-full"
            />
          ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-primary-dark">Committees</h1>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <SearchableList
          items={committees}
          searchKeys={['title']}
          placeholder="Search committees..."
          renderItems={renderCommittees}
        />
      </div>
    </div>
  );
} 