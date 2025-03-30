import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  reports: defineTable({
    patientName: v.string(),
    age: v.number(),
    xrayUrl: v.string(),
    diagnosis: v.optional(v.string()),
    confidence: v.optional(v.number()),
    findings: v.string(),
    userId: v.string(),
    orgId: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("error")
    ),
    createdAt: v.number(),
  })
  .index("by_org", ["orgId"])
  .index("by_user", ["userId"])
});