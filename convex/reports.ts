import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Define the full report document type.
interface ReportDoc {
  _id: Id<"reports">;
  _creationTime: number;
  patientName: string;
  age: number;
  xrayUrl: string;
  diagnosis: string;
  confidence: number;
  findings: string;
  userId: string;
  orgId: string;
  status: "pending" | "completed" | "error";
  createdAt: number;
}

export const uploadReport = mutation({
  args: {
    storageId: v.id("_storage"),
    patientName: v.string(),
    age: v.number(),
  },
  handler: async (ctx, args): Promise<ReportDoc> => {
    // Use ctx.auth.getUserIdentity() provided via Clerk.
    const identity = await ctx.auth.getUserIdentity();
    console.log("Identity:", identity);
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    // Extract user ID and organization ID from the identity.
    // The identity.subject contains the user ID (from Clerk)
    // identity.orgId may be available depending on your integration.
    const userId = identity.subject;
    const orgId = identity.orgId ? identity.orgId.toString() : "personal";
    
    // Get the image URL from Convex storage.
    const imageUrl = await ctx.storage.getUrl(args.storageId);

    // Create the report object with all required fields.
    const reportData = {
      patientName: args.patientName,
      age: args.age,
      xrayUrl: imageUrl || "",
      diagnosis: "Pending Analysis",
      confidence: 0,
      findings: "",
      userId,
      orgId,
      status: "pending" as const,
      createdAt: Date.now(),
    };

    // Insert the report into your database.
    const reportId = await ctx.db.insert("reports", reportData);
    const report = await ctx.db.get(reportId);
    if (!report) throw new Error("Failed to create report");
    return report as ReportDoc;
  },
});

export const getReports = query({
  handler: async (ctx): Promise<ReportDoc[]> => {
    // Retrieve the current user's identity.
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }
    
    // Use the organization ID from identity to filter reports.
    const orgId = identity.orgId ? identity.orgId.toString() : "personal";
    
    // Query reports by organization.
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .collect();
    
    return reports as ReportDoc[];
  },
});
