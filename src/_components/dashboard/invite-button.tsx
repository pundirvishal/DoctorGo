import { Plus } from "lucide-react";
import { OrganizationProfile } from "@clerk/clerk-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useOrganization } from "@clerk/clerk-react";

export const InviteButton = () => {
  const { organization } = useOrganization();

  if (!organization) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Invite Members
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 bg-transparent border-none max-w-[880px]">
        <OrganizationProfile 
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "shadow-none border bg-background",
              navbar: "hidden", // Hide sidebar if desired
            }
          }}
          routing="hash"
        />
      </DialogContent>
    </Dialog>
  );
};