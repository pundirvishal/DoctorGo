declare module "convex/_generated/dataModel" {
    interface DocumentTypes {
      reports: {
        _id: string;
        _creationTime: number;
        patientName: string;
        age: number;
        // ... all other fields
      };
    }
    
    // Legacy support
    export type Doc<T extends keyof DocumentTypes> = DocumentTypes[T];
    export type Document = DocumentTypes;
  }