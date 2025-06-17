import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface WorkingGroupCardProps {
  title: string;
  description?: string;
  icon?: string;
  projects?: any[];
  className?: string;
}

export const WorkingGroupCard = ({
  title,
  icon,
  projects,
  ...props
}: WorkingGroupCardProps) => {
  const workingGroupSlug = title.toLowerCase().replace(/\s+/g, "-");
  return (
    <a href={`/working-groups/${workingGroupSlug}`}>
      <Card className={cn("w-96 flex flex-col gap-4 h-full", props.className)}>
        <div className="flex-1">
          <div className="flex items-center gap-4 ">
            {icon && <img
              src={icon}
              alt={`${title} working group`}
              className="size-12 object-cover shrink-0"
            />}
            <CardHeader>
              <CardTitle className="text-primary text-xl font-extrabold">
                {title}
              </CardTitle>
            </CardHeader>
          </div>
        </div>
        <CardFooter className="flex-row justify-between items-center">
          {projects && (
            <small className="text-gray-darker font-extrabold text-[10px] tracking-wider uppercase">
              {projects.length} Projects
            </small>
          )}
        </CardFooter>
      </Card>
    </a>
  );
}; 