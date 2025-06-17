import { useState } from "react";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

import { SearchableList } from "./ui/searchable-list";
import { Member } from "./member-card";

export default function MembersList({ membersByLevel }) {
  // Flatten the members array for searching
  const allMembers = Object.values(membersByLevel).flat();

  // Group members by level after filtering
  const groupMembersByLevel = (members) => {
    const grouped = {};
    Object.keys(membersByLevel).forEach(level => {
      const levelMembers = members.filter(m => 
        membersByLevel[level].some(original => original.id === m.id)
      );
      if (levelMembers.length > 0) {
        grouped[level] = levelMembers;
      }
    });
    return grouped;
  };

  return (
    <div>
      <div className="flex flex-col gap-1">
        <h1 className="text-lg font-semibold text-primary-dark">Members</h1>
      </div>
      <div className="mt-2">
        <SearchableList
          items={allMembers}
          searchKeys={['name', 'role', 'company']}
          placeholder="Search members..."
          renderItems={(filteredMembers) => (
            <div className="flex flex-col gap-6">
              {Object.entries(groupMembersByLevel(filteredMembers))
                .sort(([a], [b]) => {
                  const order = ['Steering', 'General'];
                  const aIndex = order.indexOf(a);
                  const bIndex = order.indexOf(b);
                  
                  if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
                  if (aIndex !== -1) return -1;
                  if (bIndex !== -1) return 1;
                  return a.localeCompare(b);
                })
                .map(([level, members]: any) => (
                  <div key={level} className={level === 'Steering' ? 'bg-accent-lightest-1 rounded-lg p-4' : ''}>
                    <h2 className={` font-bold ${level === 'Steering' ? 'text-primary-dark flex items-center gap-2 text-lg' : 'text-primary text-base'}`}>
                      {level === 'Steering' && (
                        <span className="inline-flex items-center justify-center bg-primary text-white rounded-full w-5 h-5 text-xs">★</span>
                      )}
                      {level}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 mt-4">
                      {members
                        .sort((a, b) => a.name.localeCompare(b.name))
                        .map((member) => (
                          <Member
                            key={member.id}
                            {...member}
                            className="w-full"
                          />
                        ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        />
      </div>
    </div>
  );
}
