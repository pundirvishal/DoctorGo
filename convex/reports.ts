import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import OpenAI from "openai";
import { Id } from "./_generated/dataModel";

const deepseek = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.VITE_DEEPSEEK_API_KEY // Replace with your actual key
});

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

export const processReport = mutation({
  args: {
    reportId: v.id("reports"),
  },
  handler: async (ctx, args) => {
    // Schedule the analysis to run immediately
    await ctx.scheduler.runAfter(0, api.reports.analyzeReport, {
      reportId: args.reportId
    });
  },
});

export const analyzeReport = action({
  args: {
    reportId: v.id("reports"),
  },
  handler: async (ctx, args) => {
    const report = await ctx.runQuery(api.reports.getReportById, { 
      reportId: args.reportId 
    });
    
    if (!report) throw new Error("Report not found");

    try {
      const systemPrompt = `You are an AI medical diagnostic assistant. analyze the provided X-ray image and provide a diagnosis.
      even if you detect the smallest abnormality, please provide a detailed diagnosis. check for lung cancer, damaged lungs and any other abnormalities.
      if there are no errors please also mention what do you see in the image in findings.
        The patient is ${report.patientName}, age ${report.age}. if any error please provide a detailed error message in findings.
        The X-ray image URL is: ${report.xrayUrl}.
        Please provide your response in valid JSON format with these exact keys:
        {
          "diagnosis": "string",
          "confidence": number,
          "findings": "string"
        }`;

      const completion = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        response_format: { type: "json_object" }, // Enforce JSON response
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: JSON.stringify({
              xray_image_url: report.xrayUrl,
              patient_age: report.age,
              patient_name: report.patientName
            })
          }
        ]
      });
      console.log("API response:", completion);
      const resultContent = completion.choices[0].message.content;
      if (!resultContent) throw new Error("Empty API response");
      
      // Parse with error handling
      let result;
      try {
        result = JSON.parse(resultContent);
      } catch {
        throw new Error(`Invalid JSON response: ${resultContent}`);
      }

      // Validate required fields
      if (!result.diagnosis || !result.confidence || !result.findings) {
        throw new Error("Response missing required fields");
      }

      await ctx.runMutation(api.reports.updateReport, {
        reportId: args.reportId,
        status: "completed",
        diagnosis: result.diagnosis,
        confidence: result.confidence,
        findings: result.findings
      });
    } catch (error) {
      await ctx.runMutation(api.reports.updateReport, {
        reportId: args.reportId,
        status: "error",
        findings: error instanceof Error ? error.message : "Processing failed"
      });
    }
  }
});

export const getReportById = query({
  args: { reportId: v.id("reports") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.reportId);
  }
});

export const updateReport = mutation({
  args: {
    reportId: v.id("reports"),
    status: v.union(
      v.literal("pending"),
      v.literal("completed"),
      v.literal("error")
    ),
    diagnosis: v.optional(v.string()),
    confidence: v.optional(v.number()),
    findings: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, {
      status: args.status,
      ...(args.diagnosis !== undefined && { diagnosis: args.diagnosis }),
      ...(args.confidence !== undefined && { confidence: args.confidence }),
      ...(args.findings !== undefined && { findings: args.findings }),
    });
  }
});

export const uploadReport = mutation({
  args: {
    storageId: v.id("_storage"),
    patientName: v.string(),
    age: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const imageUrl = await ctx.storage.getUrl(args.storageId);
    const orgId = identity.orgId ? identity.orgId.toString() : "personal";

    const reportData = {
      patientName: args.patientName,
      age: args.age,
      xrayUrl: imageUrl || "",
      diagnosis: "Pending Analysis",
      confidence: 0,
      findings: "",
      userId: identity.subject,
      orgId,
      status: "pending" as const,
      createdAt: Date.now(),
    };
    const reportId = await ctx.db.insert("reports", reportData);
    return await ctx.db.get(reportId) as ReportDoc;
  },
});

export const getReports = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    
    const orgId = identity.orgId ? identity.orgId.toString() : "personal";
    
    return await ctx.db
      .query("reports")
      .withIndex("by_org", q => q.eq("orgId", orgId))
      .order("desc")
      .collect();
  }
});