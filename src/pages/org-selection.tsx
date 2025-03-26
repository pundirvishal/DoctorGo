import { useEffect } from "react";
import { OrganizationList, useOrganization } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function OrgSelection() {
  const navigate = useNavigate();
  const { organization } = useOrganization();

  useEffect(() => {
    if (organization && organization.slug) {
      // Once the organization is set, navigate client-side to the dynamic route.
      navigate(`/dashboard/${organization.slug}/patients`);
    }
  }, [organization, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">Welcome to MedScan AI</h1>
          <p className="text-muted-foreground">Select an organization to continue</p>
        </div>

        <div className="space-y-4 justify-items-center">
          {/* Note: Removed callbacks such as onOrganizationSelect and onOrganizationCreate */}
          <OrganizationList />
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate("/dashboard/default-slug/patients")}
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
}
