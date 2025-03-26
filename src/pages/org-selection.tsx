import { useEffect } from "react";
import { OrganizationList, useOrganization } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function OrgSelection() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to MedScan AI</h1>
          <p className="text-muted-foreground">Select an organization to continue</p>
        </div>

        <div className="space-y-4 justify-items-center">
          {/* Note: Removed callbacks such as onOrganizationSelect and onOrganizationCreate */}
          <OrganizationList
          afterCreateOrganizationUrl={(org) => `/dashboard/${org.slug}/patients`}
          afterSelectPersonalUrl={(user) => `/dashboard/${user.id}/patients`}
          afterSelectOrganizationUrl={(org) => `/dashboard/${org.slug}/patients`}
          />
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/dashboard/personal/patients")}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}