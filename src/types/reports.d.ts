import type { Doc } from "convex/_generated/dataModel";

export interface Report extends Doc<"reports"> {
  // All fields should match your schema
  _id: string;
  _creationTime: number;
  patientName: string;
  age: number;
  xrayUrl: string;
  diagnosis: string;  // Explicitly include
  confidence: number;
  findings: string;
  userId: string;
  orgId: string;
  status: "pending" | "completed" | "error";
  createdAt: number;
}