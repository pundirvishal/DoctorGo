import { query, mutation, action } from "./_generated/server";
import { v } from "convex/values";
import { api } from "./_generated/api";
import OpenAI from 'openai';
import { Id } from "./_generated/dataModel";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY, // Replace with your actual OpenRouter API Key
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
  processedImageStorageId?: string; // Optional field for processed image storage ID
}

export const processReport = mutation({
  args: {
    reportId: v.id("reports")
  },
  handler: async (ctx, args) => {
    await ctx.scheduler.runAfter(0, api.reports.analyzeReport2, {
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
      const systemPrompt = `As a highly skilled radiologist specializing in analyzing x-ray images, you are an expert in identifying bone fractures on multi-region x-ray data. You can identify fractures in anatomical body regions, including lower limb, upper limb, lumbar, hips, and knees, among others.

Your responsibilities are:
1. Detailed analysis: Thoroughly analyze the provided X-ray image, focusing on identifying fractures or any abnormal findings, even the smallest abnormality. Check for lung cancer, damaged lungs, and any other abnormalities.
2. Report Findings: Document all your findings. Clearly articulate these findings in a structured format. If no errors are found, also mention what you see in the image.
3. Recommend treatment: Based on your analysis, always suggest the next steps. If fractures or any abnormal findings are present, recommend the best-known treatment.

Scope of Response: Only respond if the image is an x-ray image. If the image quality prevents you from making an analysis, mention it to the user.
Disclaimer: Add a disclaimer at the end of your response if you have made an analysis. Tell the user that your analysis is only based on statistical data and emphasize that it is very important to consult a real doctor before making any medical decisions.

The patient is ${report.patientName}, age ${report.age}. The X-ray image URL is: ${report.xrayUrl}.
Please provide your response in valid JSON format with these exact keys:
{
  "diagnosis": "string",
  "confidence": number,
  "findings": "string"
}`;

      const completion = await openai.chat.completions.create({
        model: "google/gemini-2.0-flash-001",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: JSON.stringify({
                  xray_image_url: report.xrayUrl,
                  patient_age: report.age,
                  patient_name: report.patientName
                })
              },
              {
                type: "image_url",
                image_url: {
                  url: report.xrayUrl
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
      });


      console.log("API Response:", completion);
      if (!completion.choices || completion.choices.length === 0) {
        throw new Error("No choices returned from the API."); // More specific error
      }

      const resultContent = completion.choices[0].message?.content; // Optional chaining

      if (!resultContent) {
        throw new Error("Empty API response or missing content."); // More specific error
      }
      if (!resultContent) throw new Error("Empty API response");

      let result;
      try {
        result = JSON.parse(resultContent);
      } catch {
        throw new Error(`Invalid JSON response: ${resultContent}`);
      }

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
    processedImageStorageId: v.optional(v.string()), // Add this field
    xrayUrl: v.optional(v.string()), // Optional field for original X-ray URL
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.reportId, {
      status: args.status,
      ...(args.diagnosis !== undefined && { diagnosis: args.diagnosis }),
      ...(args.confidence !== undefined && { confidence: args.confidence }),
      ...(args.findings !== undefined && { findings: args.findings }),
      ...(args.processedImageStorageId !== undefined && {
        processedImageStorageId: args.processedImageStorageId,
      }),
      ...(args.xrayUrl !== undefined && { xrayUrl: args.xrayUrl }), // Patch xrayUrl
    });
  },
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
      .withIndex("by_user", q => q.eq("userId", identity.subject))
      .filter((q) => q.eq(q.field("orgId"), orgId))
      .order("desc")
      .collect();
  }
});


export const analyzeReport2 = action({
  args: {
    reportId: v.id("reports"),
  },
  handler: async (ctx, args) => {
    // Fetch the report from the database
    const report = await ctx.runQuery(api.reports.getReportById, {
      reportId: args.reportId,
    });

    if (!report) throw new Error("Report not found");

    try {
      // Generate an upload URL for the processed image
      const convexUploadUrl = await ctx.runMutation(api.files.generateUploadUrl);

      // Prepare the payload for the Python server
      const payload = {
        xray_url: report.xrayUrl,        // Original X-ray URL
        patient_name: report.patientName, // Patient name
        age: report.age,                 // Patient age
        convex_upload_url: convexUploadUrl, // Upload URL for processed image
      };

      // Send a POST request to the Python server
      const response = await fetch("https://19c4-103-87-57-0.ngrok-free.app/analyze_report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error from Python server:", errorText);
        throw new Error(`Failed to analyze report: ${response.statusText}`);
      }

      const result = await response.json();

      // Validate required fields in the response
      if (
        !result.diagnosis ||
        result.confidence === undefined ||
        !result.findings ||
        !result.processed_image_storage_id
      ) {
        throw new Error("Invalid response format from Python server");
      }
      const imageUrl = await ctx.storage.getUrl(result.processed_image_storage_id);

      // Update the report in the Convex database
      await ctx.runMutation(api.reports.updateReport, {
        reportId: args.reportId,
        status: "completed",
        diagnosis: result.diagnosis,
        confidence: result.confidence,
        findings: result.findings,
        processedImageStorageId: result.processed_image_storage_id, // Save processed image storage ID
        xrayUrl: imageUrl || "", // Keep the original X-ray URL
      });
    } catch (error) {
      console.error("Error processing report:", error);
      // Update the report with an error status in case of failure
      await ctx.runMutation(api.reports.updateReport, {
        reportId: args.reportId,
        status: "error",
        findings: error instanceof Error ? error.message : "Processing failed",
      });
    }
  },
});