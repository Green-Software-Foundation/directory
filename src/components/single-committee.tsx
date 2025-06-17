import { Title } from "./title";
import { Person } from "./person";
import { AppBreadcrumb } from "./breadcrumb";
import { Button } from "./ui/button";
import { BadgeTooltip } from "./badge-tooltip";
import { GlobeIcon, MailIcon } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { ProjectCard } from "./project-card";
import type { Committee } from "./committees-list";

interface CommitteeProps {
  committee: Committee;
}

export default function SingleCommittee({
  committee: {
    title,
    type,
    description,
    icon,
    website,
    repo,
    googleGroup,
    leads,
    members,
    pageContent,
    projects
  },
}: CommitteeProps) {
  const socials = [
    website && {
      icon: <GlobeIcon />,
      href: website,
      label: "Website",
    },
    repo && {
      icon: <SiGithub />,
      href: repo,
      label: "Github",
    },
    googleGroup && {
      icon: <MailIcon />,
      href: `mailto:${googleGroup}`,
      label: "Contact",
    },
  ].filter(Boolean);
  return (
    <div>
      <AppBreadcrumb currentPath="/committees" pageName={title} />
      <div className="p-8 border border-gray rounded-lg">
        <div className="flex items-center flex-wrap gap-4">
          {icon && (
            <img
              src={icon}
              alt={`${title} icon`}
              className="w-16 object-cover shrink-0"
            />
          )}
          <div>
            <BadgeTooltip badgeText={type} tooltipText="Committee Type" />
            <h1 className="text-2xl font-extrabold text-primary mt-1">
              {title}
            </h1>
          </div>
        </div>

        <p className="text-base text-gray-darker mt-4 whitespace-pre-line">{description}</p>

        <div className="flex items-center justify-between flex-wrap gap-6 mt-6">
          <div className="flex items-center flex-wrap gap-2">
            {socials.map((social) => {
              return (
                <Button
                  key={social.label}
                  size="sm"
                  className="border border-gray-dark bg-transparent text-gray-dark hover:border-accent-light hover:bg-accent-light hover:text-primary-dark"
                  asChild
                >
                  <a
                    href={social.href}
                    className="flex items-center gap-2 uppercase"
                  >
                    <span>{social.icon}</span>
                    <span>{social.label}</span>
                  </a>
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {leads?.length > 0 && (
        <div className="mt-8">
          <Title titleText="Representatives" description="People either elected to hold leadership positions or selected to represent"/>
          <div className="mt-4 flex flex-wrap gap-6">
            {leads.sort((a, b) => a.name.localeCompare(b.name)).map((person, index) => (
              <Person
                key={index}
                name={person.name || ''}
                roles={person.role ? [person.role] : []}
                title={person.title || ''}
                company={person.company || ''}
                linkedin={person.linkedin || ''}
              />
            ))}
          </div>
        </div>
      )}

      {members?.length > 0 && (
        <div className="mt-8">
          <Title titleText="Members" description="Committee members who participate in committee activities"/>
          <div className="mt-4 flex flex-wrap gap-6">
            {members.sort((a, b) => a.name.localeCompare(b.name)).map((person, index) => (
              <Person
                key={index}
                name={person.name || ''}
                roles={person.role ? [person.role] : []}
                title={person.title || ''}
                company={person.company || ''}
                linkedin={person.linkedin || ''}
              />
            ))}
          </div>
        </div>
      )}

      {pageContent && (
        <div className="mt-8 prose max-w-none">
          <div dangerouslySetInnerHTML={{ __html: pageContent }} />
        </div>
      )}

      {projects?.length > 0 && (
        <div className="mt-8">
          <Title titleText="Projects" />
          <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {projects.map((project, index) => (
              <ProjectCard key={index} {...project} className="w-full" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 