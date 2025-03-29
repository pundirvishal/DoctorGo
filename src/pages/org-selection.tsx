// OrgSelection.tsx
import { OrganizationList } from "@clerk/clerk-react";

export default function OrgSelection() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to MedScan AI</h1>
          <p className="text-muted-foreground">Select an organization to continue</p>
        </div>

        <div className="space-y-4 w-full justify-items-center">
          <OrganizationList
            afterCreateOrganizationUrl={(org) => `/dashboard/${org.slug}/patients`}
            afterSelectOrganizationUrl={(org) => `/dashboard/${org.slug}/patients`}
          />
        </div>
      </div>
    </div>
  );
}