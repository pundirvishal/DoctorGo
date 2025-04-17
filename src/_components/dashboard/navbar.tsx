import { UserButton, OrganizationSwitcher } from "@clerk/clerk-react";
import { Button } from "../../components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { DashboardSidebar } from "./sidebar";

export function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-[var(--color-primary)] text-[var(--color-text-primary)] shadow-md">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="hover:bg-[var(--color-accent)]">
                <Menu className="h-5 w-5 text-[var(--color-text-primary)]" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[250px] p-0">
              <DashboardSidebar className="h-full border-r" />
            </SheetContent>
          </Sheet>
        </div>

        <div className="ml-4 md:ml-0">
          <h1 className="text-xl font-bold tracking-wide">MedScan AI</h1>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <OrganizationSwitcher
            appearance={{
              elements: {
                organizationSwitcherTrigger: "hover:bg-[var(--color-accent)] rounded-md p-2 text-[var(--color-text-primary)]",
              }
            }}
          />
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </header>
  );
}