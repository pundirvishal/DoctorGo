import { UploadButton } from "@/_components/patients/upload-button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";

export default function PatientsPage() {
  const reports = useQuery(api.reports.getReports);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Patient Records</h2>
          <p className="text-sm text-muted-foreground">
            Manage and review patient cases
          </p>
        </div>
        <UploadButton />
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search patients..."
          className="pl-10"
        />
      </div>

      {reports === undefined ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="border rounded-lg p-6">
          <p className="text-muted-foreground text-center py-8">
            No patient records yet. Upload an X-Ray to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {reports.map((report) => (
          <div
            key={report._id}
            className="border rounded-lg p-4 space-y-4 hover:bg-muted/50 transition-colors"
          >
            <div className="space-y-1">
              <h3 className="font-semibold text-lg">{report.patientName}</h3>
              <p className="text-sm">Age: {report.age}</p>
              <p className="text-sm">
                Status:{" "}
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    report.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : report.status === "error"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {report.status}
                </span>
              </p>
            </div>

            {report.xrayUrl && (
              <img
                src={report.xrayUrl}
                alt="X-Ray preview"
                className="rounded-md object-contain w-full h-48"
              />
            )}

            <div className="space-y-2">
              {report.diagnosis && (
                <p className="text-sm">
                  Diagnosis:{" "}
                  <span className="font-medium">{report.diagnosis}</span>
                </p>
              )}
              {report.status === "completed" && report.confidence && (
                <p className="text-sm">
                  Confidence:{" "}
                  <span className="font-medium">
                    {(report.confidence * 100).toFixed(1)}%
                  </span>
                </p>
              )}
              <p className="text-xs text-muted-foreground">
                {new Date(report.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}