// Navigation constants
export const NAV_ITEMS = [
    {
      title: "Dashboard",
      href: "/dashboard",
      icon: "dashboard",
    },
    {
      title: "Patients",
      href: "/patients",
      icon: "users",
    },
    {
      title: "Reports",
      href: "/reports",
      icon: "fileText",
    },
    {
      title: "Organization",
      href: "/organization",
      icon: "building",
    },
  ] as const;
  
  // Patient form fields
  export const PATIENT_FORM_FIELDS = [
    {
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "John Doe",
      required: true,
    },
    {
      name: "age",
      label: "Age",
      type: "number",
      placeholder: "30",
      required: true,
    },
    {
      name: "gender",
      label: "Gender",
      type: "select",
      options: ["Male", "Female", "Other"],
      required: true,
    },
    {
      name: "contact",
      label: "Contact Number",
      type: "tel",
      placeholder: "+1234567890",
      required: false,
    },
    {
      name: "notes",
      label: "Clinical Notes",
      type: "textarea",
      placeholder: "Any additional information...",
      required: false,
    },
  ] as const;
  
// Report statuses
export const REPORT_STATUSES = {
    PENDING: {
      label: "Pending",
      variant: "secondary",
    },
    COMPLETED: {
      label: "Completed",
      variant: "default",
    },
    ERROR: {
      label: "Error",
      variant: "destructive",
    },
  } as const;
  
  export type ReportStatus = keyof typeof REPORT_STATUSES;
  
  // Possible diagnosis results (mock for now)
  export const DIAGNOSIS_RESULTS = [
    "Normal",
    "Pneumonia detected",
    "Tuberculosis suspected",
    "Fracture identified",
    "Lung opacity present",
    "Cardiomegaly observed",
  ] as const;
  
  // X-ray types
  export const XRAY_TYPES = [
    "Chest PA",
    "Chest Lateral",
    "Abdomen AP",
    "Skull Lateral",
    "Spine AP",
    "Spine Lateral",
  ] as const;
  
  export type XRayType = typeof XRAY_TYPES[number];