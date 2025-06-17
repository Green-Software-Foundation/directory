import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const BadgeTooltip = ({
  badgeText = "Badge",
  tooltipText = "This is a tooltip",
}) => {
  return (
    <Badge className="flex items-center gap-2 w-fit">
      <h1 className="uppercase text-accent-darker font-bold text-xs">
        {badgeText}
      </h1>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild className="cursor-pointer">
            <Info className="size-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>{tooltipText}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Badge>
  );
};
