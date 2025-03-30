"use client";

import { useState } from "react";
import { ReportCard } from "./card";
import { Skeleton } from "../../components/ui/skeleton";
import type { Id } from "../../../convex/_generated/dataModel";

interface ReportsListProps {
  reports: {
    _id: Id<"reports">;
    status: "pending" | "completed" | "error";
    diagnosis?: string;
    findings?: string;
    confidence?: number;
    patientName: string;
    age: number;
    createdAt: number;
  }[];
  onProcessReport: (reportId: Id<"reports">) => Promise<void>;
}

export function ReportsList({ reports, onProcessReport }: ReportsListProps) {
  const [processingId, setProcessingId] = useState<Id<"reports"> | null>(null);

  const handleProcess = async (reportId: Id<"reports">) => {
    setProcessingId(reportId);
    try {
      await onProcessReport(reportId);
    } catch (error) {
      console.error("Error processing report:", error);
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="grid gap-4">
      {reports === undefined ? (
        [...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))
      ) : reports.length === 0 ? (
        <div className="text-center text-muted-foreground py-8">
          No reports found
        </div>
      ) : (
        reports.map((report) => (
          <ReportCard
            key={report._id}
            report={{
              id: report._id,
              status: report.status,
              diagnosis: report.diagnosis,
              findings: report.findings,
              createdAt: new Date(report.createdAt),
              confidence: report.confidence,
              patientName: report.patientName,
              age: report.age
            }}
            onProcess={() => handleProcess(report._id)}
            isProcessing={processingId === report._id}
          />
        ))
      )}
    </div>
  );
}