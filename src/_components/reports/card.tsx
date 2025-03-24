"use client";

import { REPORT_STATUSES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ReportCardProps {
  report: {
    id: string;
    status: keyof typeof REPORT_STATUSES;
    diagnosis?: string;
    createdAt: Date;
    completedAt?: Date;
    confidence?: number;
  };
}

export function ReportCard({ report }: ReportCardProps) {
  const status = REPORT_STATUSES[report.status];
  
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium">
            {report.diagnosis || "Pending Analysis"}
          </h3>
          <p className="text-sm text-muted-foreground">
            {report.createdAt.toLocaleDateString()}
          </p>
        </div>
        <Badge variant={status.variant}>{status.label}</Badge>
      </div>
      
      {report.status === "COMPLETED" && (
        <div className="space-y-1">
          <p className="text-sm">
            Confidence: {report.confidence?.toFixed(1)}%
          </p>
          <Button variant="outline" size="sm">
            View Full Report
          </Button>
        </div>
      )}
    </div>
  );
}