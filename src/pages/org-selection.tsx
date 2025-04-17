// OrgSelection.tsx
import { OrganizationList } from "@clerk/clerk-react";

export default function OrgSelection() {

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-[var(--color-background)] text-[var(--color-text)]">
      <div className="w-full max-w-md space-y-6 text-center flex flex-col items-center bg-[var(--color-secondary)] p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-[var(--color-text-light)] leading-tight">Welcome to MedScan AI</h1>
        <p className="text-lg text-[var(--color-text-light-muted)] leading-relaxed">Select an organization to continue</p>

        <div className="space-y-4 w-full flex justify-center mt-6">
          <OrganizationList
            hidePersonal={true}
            afterCreateOrganizationUrl={(org) => `/dashboard/${org.slug}/patients`}
            afterSelectOrganizationUrl={(org) => `/dashboard/${org.slug}/patients`}
          />
        </div>
      </div>
    </div>
  );
}