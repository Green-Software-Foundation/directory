import { Title } from "./title";
import { Person } from "./person";
import { AppBreadcrumb } from "./breadcrumb";
import { Button } from "./ui/button";
import { BadgeTooltip } from "./badge-tooltip";
import { GlobeIcon, MailIcon } from "lucide-react";
import { SiGithub } from "react-icons/si";
import { Member } from "./member-card";

export default function SingleProject({
  project: {
    title,
    lifecycleStage,
    launchDate,
    description,
    icon,
    website,
    repo,
    googleGroup,
    workingGroup,
    leads,
    pageContent,
  },
}) {
  const // leads = [],
    consent = [];

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
      <AppBreadcrumb currentPath="/projects" pageName={title} />
      <div className="p-8 border border-gray rounded-lg">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
        <div className="flex items-center flex-wrap gap-4">
          {icon && (
            <img
              src={icon}
              alt={`${title} icon`}
              className="w-16 object-cover shrink-0"
            />
          )}
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {lifecycleStage && <BadgeTooltip badgeText={lifecycleStage} tooltipText="Lifecycle Stage" />}
              </div>
             
            </div>
            <h1 className="text-2xl font-extrabold text-primary mt-1">
              {title}
            </h1>
          </div>
        </div>
        {launchDate && (
                <span className=" font-extrabold text-[10px] tracking-wider uppercase">Launched: {launchDate}</span>
              )}
        </div>
        

        <p className="text-base text-gray-darker mt-4 whitespace-pre-line">{description}</p>

        <div className="flex items-center justify-between flex-wrap gap-6 mt-6">
          <div className="flex items-center flex-wrap gap-2">
            {socials.map((social) => {
              return (
                <Button
                  key={social.label}
                  size="sm"
                  className="border border-gray-darker bg-transparent text-gray-darker hover:bg-accent-light hover:text-primary-darker"
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
          {workingGroup && (
            <span className="text-primary font-extrabold text-[10px] tracking-wider uppercase">
              {workingGroup.name}
            </span>
          )}
        </div>
      </div>

      {leads?.length > 0 && (
        <div className="mt-8">
          <Title titleText="Team" />
          <div className="mt-4 flex  flex-wrap gap-6">
            {leads
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((person, index) => (
              <Person key={index} {...person} roles={person.role ? [person.role] : []} />
            ))}
          </div>
        </div>
      )}
      {pageContent && (
        <div className="mt-8 prose  max-w-none">
          <div dangerouslySetInnerHTML={{ __html: pageContent }} />
        </div>
      )}

      {consent?.length > 0 && (
        <div className="mt-8">
          <Title titleText="Consent" />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 items-center gap-6">
            {consent.map((member, index) => (
              <Member key={index} {...member} className="w-full" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
