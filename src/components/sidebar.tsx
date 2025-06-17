import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Newsletter } from "./newsletter";
import { useEffect, useState } from "react";
import { LeafIcon, Building2Icon, PackageIcon, BookUserIcon, CrownIcon, MessageCircleIcon } from "lucide-react";

const items = [
  {
    icon: <Building2Icon size={16} />,
    title: "Members",
    url: "/members",
  },
  {
    icon: <LeafIcon size={16} />,
    title: "Projects",
    url: "/projects",
  },
  {
    icon: <PackageIcon size={16} />,
    title: "Working Groups",
    url: "/working-groups",
  },
  {
    icon: <BookUserIcon size={16} />,
    title: "Committees",
    url: "/committees",
  },
  // {
  //   icon: <CrownIcon size={16} />,
  //   title: "Staff",
  //   url: "/staff",
  // },
  // {
  //   icon: <MessageCircleIcon size={16} />,
  //   title: "Reps",
  //   url: "/reps",
  // },
];

export function AppSidebar() {
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  const isActive = (url) => {
    return currentPath.startsWith(url);
  };

  return (
    <Sidebar className="border-none pt-4">
      <SidebarContent className="bg-accent-lightest-2">
        <SidebarGroup>
          <a href="/" className="flex items-center justify-between mb-6">
            <img
              src="/assets/greensoftware-logo.svg"
              alt="Green Software Foundation logo"
              className="flex-shrink-0 w-28"
            />
          </a>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={isActive(item.url)} asChild>
                    <a href={item.url} className="text-sm font-bold">
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            {/* <Newsletter className="w-full" /> */}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
