"use client";

import { REPORT_STATUSES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface ReportCardProps {
  report: {
    id: string;
    status: "pending" | "completed" | "error";
    diagnosis?: string;
    findings?: string;
    createdAt: Date;
    confidence?: number;
    patientName: string;
    age: number;
  };
  onProcess?: () => void;
  isProcessing?: boolean;
}

export function ReportCard({ report, onProcess, isProcessing }: ReportCardProps) {
  const statusKey = report.status.toUpperCase() as keyof typeof REPORT_STATUSES;
  const status = REPORT_STATUSES[statusKey];

  return (
    <div className="border rounded-lg p-4 space-y-3">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">
            {report.patientName} (Age: {report.age})
          </h3>
          <p className="text-sm text-gray-500">
            Created: {report.createdAt.toLocaleDateString()}
          </p>
        </div>
        <Badge variant={status.variant} className="shrink-0">
          {status.label}
        </Badge>
      </div>

      {/* Completed Report Section */}
      {report.status === "completed" && (
        <div className="space-y-3">
          {report.diagnosis && (
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
              <h4 className="font-medium text-blue-800">Diagnosis</h4>
              <p className="text-gray-800">
                {report.diagnosis}
                {report.confidence && (
                  <span className="text-blue-600 ml-2">
                    ({(Number(report.confidence.toFixed(2)) * 100)}% confidence)
                  </span>
                )}
              </p>
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">Clinical Findings</h4>
            {report.findings ? (
              <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                {report.findings}
              </pre>
            ) : (
              <p className="text-gray-500 italic">No clinical findings available</p>
            )}
          </div>

          <Button variant="outline" size="sm" className="w-full">
            View Full Report
          </Button>
        </div>
      )}

      {/* Process Report Button - Always Displayed */}
      {onProcess && (
        <div className="space-y-3">
          {report.status === "error" && (
            <div className="bg-red-50 p-3 rounded-lg border border-red-200">
              <h4 className="font-medium text-red-700 mb-1">Error Details</h4>
              <p className="text-red-600 text-sm">
                {report.findings || "Processing failed - please try again"}
              </p>
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={onProcess}
            disabled={isProcessing}
            className="w-full"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Process"
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
