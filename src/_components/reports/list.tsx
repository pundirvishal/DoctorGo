import { useEffect, useState } from "react";
import { ReportCard } from "./card";
import { Skeleton } from "../../components/ui/skeleton";
import mockApi from "@/lib/api-mock"; // Replace Convex import
import { REPORT_STATUSES } from "@/lib/constants"; // Add constants import

interface Report {
  id: string;
  status: keyof typeof REPORT_STATUSES;
  diagnosis?: string;
  createdAt: Date;
  // Add other necessary fields
}

export function ReportsList() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReports = async () => {
      try {
        const data = await mockApi.getAllReports();
        setReports(data);
      } catch (error) {
        console.error("Error loading reports:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadReports();
  }, []);

  if (isLoading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {reports.map((report) => (
        <ReportCard key={report.id} report={report} />
      ))}
    </div>
  );
}