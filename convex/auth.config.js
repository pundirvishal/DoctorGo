export default {
  providers: [
    {
      domain: "https://cheery-bee-515.convex.cloud",
      applicationID: "convex",
    },
  ],
  isAuthenticated: (user) => !!user,
  orgId: (user) => user.orgId || "personal",
};