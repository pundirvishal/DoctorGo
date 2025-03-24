import { useOrganization } from "@clerk/clerk-react";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { InviteButton } from "./invite-button";
import { Loader2 } from "lucide-react";
import { Button } from "../../components/ui/button";
  
  export function MembersList() {
    const { 
      organization,
      memberships,
      invitations
    } = useOrganization({
      memberships: {
        infinite: true,
        keepPreviousData: true,
        pageSize: 10
      },
      invitations: {
        infinite: true,
        keepPreviousData: true,
        pageSize: 10
      }
    });
  
    if (!organization) {
      return (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      );
    }
  
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-medium">Team Members</h3>
            <p className="text-sm text-muted-foreground">
              Manage who has access to this organization
            </p>
          </div>
          <InviteButton />
        </div>
  
        {/* Current Members */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Active Members</h4>
          {!memberships ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {memberships.data?.map((membership) => (
                  <div
                    key={membership.id}
                    className="flex items-center justify-between p-4 border rounded-lg bg-background"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={membership.publicUserData.imageUrl} />
                        <AvatarFallback>
                          {membership.publicUserData.identifier?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">
                          {membership.publicUserData.firstName || membership.publicUserData.identifier}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {membership.publicUserData.identifier}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">{membership.role}</Badge>
                  </div>
                ))}
              </div>
              {memberships.hasNextPage && (
                <Button 
                  variant="outline" 
                  onClick={() => memberships.fetchNext()}
                  disabled={memberships.isLoading}
                  className="w-full"
                >
                  {memberships.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Load More Members
                </Button>
              )}
            </>
          )}
        </div>
  
        {/* Pending Invitations */}
        <div className="mt-8">
          <h4 className="text-sm font-medium mb-4">Pending Invitations</h4>
          {!invitations ? (
            <div className="space-y-4">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {invitations.data?.map((invitation) => (
                  <div
                    key={invitation.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarFallback>
                          {invitation.emailAddress[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{invitation.emailAddress}</p>
                        <p className="text-sm text-muted-foreground">
                          Invited {new Date(invitation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                ))}
                {invitations.data?.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No pending invitations
                  </p>
                )}
              </div>
              {invitations.hasNextPage && (
                <Button 
                  variant="outline" 
                  onClick={() => invitations.fetchNext()}
                  disabled={invitations.isLoading}
                  className="w-full"
                >
                  {invitations.isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
                  Load More Invitations
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    );
  }