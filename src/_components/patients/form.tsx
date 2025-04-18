"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PATIENT_FORM_FIELDS } from "@/lib/constants";

interface PatientFormProps {
  fields: typeof PATIENT_FORM_FIELDS;
}

export function PatientForm({ fields }: PatientFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const uploadReport = useMutation(api.reports.uploadReport);

  const commonToastStyle = {
    style: {
      background: "#ffffff",
      color: "#000000",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const toastId = toast.loading("Uploading X-Ray...", {
      ...commonToastStyle,
    });

    try {
      const formData = new FormData(e.currentTarget as HTMLFormElement);
      const file = formData.get("xray") as File;

      // Validate inputs
      if (!file) throw new Error("No file selected");
      if (file.size > 10 * 1024 * 1024) throw new Error("File too large (max 10MB)");

      // Step 1: Get an upload URL
      const uploadUrl = await generateUploadUrl();

      // Step 2: Upload the file to Convex storage
      const uploadResult = await fetch(uploadUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      if (!uploadResult.ok) throw new Error("Upload failed");

      const { storageId } = await uploadResult.json();

      // Step 3: Create the report record
      await uploadReport({
        storageId,
        patientName: formData.get("name") as string,
        age: Number(formData.get("age")),
      });

      toast.success("Report submitted successfully!", {
        id: toastId,
        description: (
          <span style={{ color: "#000000" }}>
            Your X-Ray is being processed
          </span>
        ),
        ...commonToastStyle,
      });

      (e.target as HTMLFormElement).reset();
      setFile(null);
    } catch (error) {
      toast.error("Submission failed", {
        id: toastId,
        description:
          error instanceof Error ? error.message : "Try again later",
        ...commonToastStyle,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name} className="space-y-2">
          <Label htmlFor={field.name}>{field.label}</Label>
          {field.type === "select" ? (
            <select
              id={field.name}
              name={field.name}
              required={field.required}
              disabled={isSubmitting}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select {field.label}</option>
              {field.options?.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          ) : (
            <Input
              id={field.name}
              name={field.name}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              disabled={isSubmitting}
            />
          )}
        </div>
      ))}
      {/* File Upload */}
      <div className="space-y-2">
        <Label htmlFor="xray">X-Ray Image (JPEG/PNG, max 10MB)</Label>
        <Input
          id="xray"
          name="xray"
          type="file"
          accept="image/jpeg,image/png"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          disabled={isSubmitting}
        />
        {file && (
          <p className="text-sm text-muted-foreground">
            Selected: {file.name} (
            {(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          "Submit for Analysis"
        )}
      </Button>
    </form>
  );
}