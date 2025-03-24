// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { ProtectedLayout } from "@/_components/protected-layout";
import OrgSelection from "./pages/org-selection";
import { DashboardLayout } from "@/_components/dashboard/layout";
import PatientsPage from "./pages/dashboard/patients";
import ReportsPage from "./pages/dashboard/reports";
import { MembersList } from "./pages/dashboard/members";
import SignInPage from "./pages/SignIn";


export default function App() {
  return (
    <><Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<OrgSelection />} />
        <Route path="/sign-in" element={<SignInPage />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard/:org" element={<DashboardLayout />}>
            <Route index element={<Navigate to="patients" replace />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="members" element={<MembersList />} />
          </Route>
        </Route>

        {/* Fallback redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router><Toaster position="bottom-right" /></>
  );
}