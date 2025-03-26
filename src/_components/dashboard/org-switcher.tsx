import { OrganizationSwitcher } from "@clerk/clerk-react";

export function OrgSwitcher() {
  return (
    <OrganizationSwitcher
      appearance={{
        elements: {
          organizationSwitcherTrigger: "hover:bg-accent",
        },
      }}
    />
  );
}