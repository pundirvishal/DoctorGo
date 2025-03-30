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