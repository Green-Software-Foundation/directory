import { useState } from "react";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export const Newsletter = ({ className = "" }) => {
  const [emailInput, setEmailInput] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({
      emailInput,
    });
  };

  return (
    <Card className={cn("w-96 flex flex-col gap-6 border-none", className)}>
      <CardHeader>
        <CardTitle className="text-primary-dark text-sm font-extrabold">
          Subscribe to our newsletter
        </CardTitle>
        <CardDescription className="text-xs">
          Stay updated with our latest news and events
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <Input
            id="email"
            type="email"
            placeholder="Enter your email..."
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <Button type="submit" className="w-full text-white">
            <Mail />
            <span>Subscribe</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
};
