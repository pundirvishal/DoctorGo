import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { PatientForm } from "./form";
import { PATIENT_FORM_FIELDS } from "@/lib/constants"; // Add this import

export function UploadButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New X-Ray Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-white">
        <DialogHeader>
          <DialogTitle>New Patient Record</DialogTitle>
        </DialogHeader>
        <PatientForm fields={PATIENT_FORM_FIELDS} />
      </DialogContent>
    </Dialog>
  );
}