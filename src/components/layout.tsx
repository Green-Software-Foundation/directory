import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="p-4 w-screen">
        <div
          className="bg-white size-full rounded-xl max-w-full shadow-[0_1px_2px_-1px_#0000001a,_0_1px_3px_0_#0000001a] p-6"
        >

          {children}
        </div>
      </main>
        <SidebarTrigger  />
    </SidebarProvider>
  );
}
