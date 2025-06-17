import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

export const Person = ({
  imgSrc = "",
  name,
  roles = [],
  title,
  company,
  linkedin
}) => {
  const uniqueRoles = [...new Set(roles)];
  const roleString = uniqueRoles.join(' / ');
  return (
    <>
      {linkedin ? (
        <a href={linkedin} target="_blank" rel="noopener noreferrer" className="w-full max-w-96">
          <Card className=" w-full h-full flex flex-col gap-12 transition-shadow duration-300 hover:shadow-md cursor-pointer relative">
            <ExternalLink className="absolute top-5 right-5 size-4 text-gray-darker" />
            {imgSrc && (
              <img
                src={imgSrc}
                alt={name}
                className="size-14 object-cover shrink-0"
              />
            )}
            <CardHeader className="flex-1">
              <CardTitle className="text-primary text-xl font-bold">{name}</CardTitle>
              <CardDescription>{title} {company? `@ ${company}`: ''}</CardDescription>
            </CardHeader>
            {roles.length > 0 && <CardFooter className="flex flex-col">
              <span className="text-gray-darker font-bold text-xs uppercase">Roles</span>
              <div className="flex flex-wrap gap-1">
                  <small className="text-primary-darker font-bold text-xs uppercase">
                    {roleString}
                  </small>
              </div>
            </CardFooter>}
          </Card>
        </a>
      ) : (
        <Card className="w-96 flex flex-col gap-12">
          {imgSrc && (
            <img
              src={imgSrc}
              alt={name}
              className="size-14 object-cover shrink-0"
            />
          )}
          <CardHeader className="flex-1">
            <CardTitle className="text-primary text-xl font-bold">{name}</CardTitle>
            <CardDescription>{title} {company? `@${company}`: ''}</CardDescription>
          </CardHeader>
          {roles.length > 0 && <CardFooter className="flex flex-col">
            <span className="text-gray-darker font-bold text-xs uppercase">Roles</span>
            <div className="flex flex-wrap gap-1">
              {roles.map((role, index) => (
                <small key={index} className="text-primary-darker font-bold text-xs uppercase">
                  {role}
                </small>
              ))}
            </div>
          </CardFooter>}
        </Card>
      )}
    </>
  );
};
