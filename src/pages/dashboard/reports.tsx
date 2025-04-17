"use client";

import { useState } from "react";
import { ReportsList } from "@/_components/reports/list";
import { Button } from "@/components/ui/button";
import { Download, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const reports = useQuery(api.reports.getReports) || [];
  const processReport = useMutation(api.reports.processReport);

  const handleProcessReport = async (reportId: Id<"reports">) => {
    await processReport({ reportId });
  };

  const filteredReports = reports.filter(report =>
    report.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Diagnostic Reports</h2>
          <p className="text-sm text-muted-foreground">
            Review AI analysis results
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export All
        </Button>
      </div>

      <div className="fade-in relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search reports..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">Recent Reports</h3>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </div>
        <ReportsList 
          reports={filteredReports} 
          onProcessReport={handleProcessReport}
        />
      </div>
    </div>
  );
}