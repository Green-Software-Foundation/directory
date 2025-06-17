import { Globe, Link, Mail } from "lucide-react";
import { Badge } from "./ui/badge";
import { Title } from "./title";
import { Person } from "./person";
import { AppBreadcrumb } from "./breadcrumb";
import { ProjectCard } from "./project-card";

interface Lead {
  id: string;
  name: string;
  role: string;
  title: string;
  company: string;
  linkedin: string;
  imgSrc?: string;
}

interface GroupedLead extends Omit<Lead, 'role'> {
  roles: string[];
}

interface Member {
  name: string;
  description: string;
  level: string;
  logo?: string;
  website?: string;
  membershipSince: string;
  leads?: Lead[];
}

export default function SingleMember({ member }: { member: Member }) {
  const
    seats = [],
    projects = [];
    
  // Group leads by name and combine roles, but keep them in their respective sections
  const groupedLeads = member.leads?.reduce<Record<string, GroupedLead>>((acc, person) => {
    const key = `${person.name}-${person.role === "Organization Lead" ? "lead" : "rep"}`;
    if (!acc[key]) {
      acc[key] = { ...person, roles: [person.role] };
    } else {
      acc[key].roles.push(person.role);
    }
    return acc;
  }, {}) || {};
  
  const organizationLeads = Object.values(groupedLeads).filter(person => 
    person.roles.includes("Organization Lead")
  );
  
  const representatives = Object.values(groupedLeads).filter(person => 
    !person.roles.includes("Organization Lead")
  );
  
  return (
    <div>
      <AppBreadcrumb currentPath="/members" pageName={member.name} />
      <div className="p-8 border border-gray rounded-lg flex flex-col gap-2">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div>
            <Badge className="w-fit uppercase">{member.level}</Badge>
            <h1 className="text-2xl font-extrabold text-primary mt-2">{member.name}</h1>
            <p className="text-base text-gray-darker">{member.description}</p>

          </div>
          {member.logo && (
            <img
              src={member.logo}
              alt={`${member.name} logo`}
              className="w-32 object-cover shrink-0"
            />
          )}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-4 [&_svg]:text-gray-dark [&_svg]:size-5">
            {member.website && (
              <a href={`//${member.website}`} target="_blank" rel="noopener noreferrer">
                <Globe />
              </a>
            )}
          </div>
          <span className="text-primary font-extrabold text-[10px] tracking-wider uppercase">Since: {member.membershipSince}</span>
        </div>
      </div>

      {organizationLeads.length > 0 && (
        <div className="mt-4">
          <Title titleText="Organisational Leads" description="Individuals responsible for managing the relationship between and the GSF"/>
          <div className="mt-4 flex items-center flex-wrap gap-6">
            {organizationLeads
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((person, index) => (
                <Person key={`${person.id}-${index}`} {...person}  />
              ))}
          </div>
        </div>
      )}

      {representatives.length > 0 && (
        <div className="mt-4">
          <Title titleText="Representatives" description="People either elected to hold leadership positions or selected to represent"/>
          <div className="mt-4 flex items-center flex-wrap gap-6">
            {representatives
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((person, index) => (
                <Person key={`${person.id}-${index}`} {...person} />
              ))}
          </div>
        </div>
      )}

      {seats?.length > 0 && (
        <div className="mt-4">
          <Title titleText="Seats"  />
          <div className="mt-4 flex items-center flex-wrap gap-6">
            {seats.map((seat, index) => (
              <Person key={index} {...seat} />
            ))}
          </div>
        </div>
      )}

      {projects?.length > 0 && (
        <div className="mt-4">
          <Title titleText="Endorsements"  />
          <div className="mt-4 grid lg:flex lg:items-center lg:flex-wrap gap-6">
            {projects.map((project, index) => (
              <ProjectCard
                key={index}
                {...project.data}
                className="w-full lg:w-96"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}