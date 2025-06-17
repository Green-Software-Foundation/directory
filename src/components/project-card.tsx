import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Project } from "@/types";

type ProjectCardProps = Project & {
  className?: string;
};

export const ProjectCard = ({
  title,
  description,
  lifecycleStage,
  workingGroup,
  icon,
  ...props
}: ProjectCardProps) => {
  const projectSlug = title.toLowerCase().replace(/\s+/g, "-");
  return (
    <a href={`/projects/${projectSlug}`}>
      <Card className={cn("w-96 flex flex-col gap-4 h-full", props.className)}>
        <div className="flex-1">
          <div className="flex items-center gap-4 ">
            {icon && <img
              src={icon}
              alt={`${title} project`}
              className="size-12 object-cover shrink-0"
            />}
            <CardHeader>
              <CardTitle className="text-primary text-xl font-extrabold">
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </div>
        </div>
        <CardFooter className="flex-row justify-between items-center">
          {workingGroup && <small className="text-primary font-extrabold text-[10px] tracking-wider uppercase">
            {workingGroup.name}
          </small>}
          {lifecycleStage && <small className="text-gray-darker font-extrabold text-[10px] tracking-wider uppercase">
            {lifecycleStage}
          </small>}
        </CardFooter>
      </Card>
    </a>
  );
};
