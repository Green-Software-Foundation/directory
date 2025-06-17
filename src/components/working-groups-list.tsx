import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { SearchableList } from "./ui/searchable-list";
import { WorkingGroupCard } from "./working-group-card";

export default function WorkingGroupsList({ workingGroups }) {
  const renderWorkingGroups = (filteredWorkingGroups: typeof workingGroups) => {
    return (
      <div className="grid grid-col-1 lg:grid-cols-2 gap-5">
        {filteredWorkingGroups
          .sort((a, b) => a.data.title.localeCompare(b.data.title))
          .map((workingGroup, index) => (
            <WorkingGroupCard
              key={index}
              {...workingGroup.data}
              className="w-full"
            />
          ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-primary-dark">Working Groups</h1>
      </div>
      <div className="flex flex-col gap-2 mt-2">
        <SearchableList
          items={workingGroups}
          searchKeys={['data.title']}
          placeholder="Search working groups..."
          renderItems={renderWorkingGroups}
        />
      </div>
    </div>
  );
} 