import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface CommitteeCardProps {
  title: string;
  description?: string;
  icon?: string;
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
  className?: string;
}

export const CommitteeCard = ({
  title,
  icon,
  projects,
  ...props
}: CommitteeCardProps) => {
  const committeeSlug = title.toLowerCase().replace(/\s+/g, "-");
  return (
    <a href={`/committees/${committeeSlug}`}>
      <Card className={cn("w-96 flex flex-col gap-4 h-full", props.className)}>
        <div className="flex-1">
          <div className="flex items-center gap-4 ">
            {icon && <img
              src={icon}
              alt={`${title} committee`}
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