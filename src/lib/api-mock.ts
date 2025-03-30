import { REPORT_STATUSES } from "./constants";
import { v4 as uuidv4 } from "uuid";

// Mock database storage
let mockReportsDB: Report[] = [];
let mockPatientsDB: Patient[] = [];

// Types
type Patient = {
  id: string;
  name: string;
  age: number;
  gender: string;
  contact?: string;
  notes?: string;
  createdAt: Date;
};

type Report = {
  id: string;
  patientId: string;
  xrayType: string;
  imageUrl: string;
  status: keyof typeof REPORT_STATUSES;
  diagnosis?: string;
  confidence?: number;
  findings?: string;
  createdAt: Date;
  completedAt?: Date;
};

// Mock API functions
export const mockApi = {
  // Patient CRUD
  createPatient: async (patientData: Omit<Patient, "id" | "createdAt">): Promise<Patient> => {
    const newPatient: Patient = {
      id: uuidv4(),
      ...patientData,
      createdAt: new Date(),
    };
    mockPatientsDB.push(newPatient);
    return newPatient;
  },

  getPatient: async (patientId: string): Promise<Patient | undefined> => {
    return mockPatientsDB.find((p) => p.id === patientId);
  },

  // Report operations
  uploadXray: async (
    patientId: string,
    file: File,
    xrayType: string
  ): Promise<{ reportId: string }> => {
    // In a real app, this would upload to storage and return a URL
    const imageUrl = URL.createObjectURL(file);
    
    const newReport: Report = {
      id: uuidv4(),
      patientId,
      xrayType,
      imageUrl,
      status: "PENDING",
      createdAt: new Date(),
    };
    
    mockReportsDB.push(newReport);
    
    // Simulate async processing
    setTimeout(() => {
      const reportIndex = mockReportsDB.findIndex((r) => r.id === newReport.id);
      if (reportIndex !== -1) {
        mockReportsDB[reportIndex] = {
          ...mockReportsDB[reportIndex],
          status: "COMPLETED",
          confidence: Math.random() * 100,
          completedAt: new Date(),
        };
      }
    }, 3000); // Simulate 3 second processing time
    
    return { reportId: newReport.id };
  },

  getReport: async (reportId: string): Promise<Report | undefined> => {
    return mockReportsDB.find((r) => r.id === reportId);
  },

  getReportsByPatient: async (patientId: string): Promise<Report[]> => {
    return mockReportsDB.filter((r) => r.patientId === patientId).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  getAllReports: async (): Promise<Report[]> => {
    return mockReportsDB.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  },

  // Utility function to clear mock DB (for testing)
  _clearMockDB: () => {
    mockReportsDB = [];
    mockPatientsDB = [];
  },
};

// Export the mock API
export default mockApi;