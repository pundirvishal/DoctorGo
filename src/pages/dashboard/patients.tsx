import { UploadButton } from "@/_components/patients/upload-button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export default function PatientsPage() {
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

      <div className="border rounded-lg p-6">
        <p className="text-muted-foreground text-center py-8">
          No patient records yet. Upload an X-Ray to get started.
        </p>
      </div>
    </div>
  );
}