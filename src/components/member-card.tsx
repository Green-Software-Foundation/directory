import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Badge } from "./ui/badge";

export const Member = ({
  sectionTitle = "",
  logo,
  name,
  className = "",
}) => {
  const memberSlug = name.toLowerCase().replace(/\s+/g, "-");
  return (
    <a href={`/members/${memberSlug}`}>
      <Card className={cn("w-44 h-full", className)}>
        <CardHeader className="gap-2">
          {sectionTitle && (
            <Badge className="uppercase text-accent-darker">
              {sectionTitle}
            </Badge>
          )}
          {logo && (
            <div className="h-8 w-24 flex">
              <img
                src={logo}
                alt={`${name} logo`}
                className="max-h-full max-w-full object-contain"
              />
            </div>
          )}
          <CardTitle className="text-lg lg:text-2xl text-primary font-extrabold">
            {name}
          </CardTitle>
        </CardHeader>
      </Card>
    </a>
  );
};
