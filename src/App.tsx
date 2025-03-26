// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import OrgSelection from "./pages/org-selection";
import { DashboardLayout } from "@/_components/dashboard/layout";
import PatientsPage from "./pages/dashboard/patients";
import ReportsPage from "./pages/dashboard/reports";
import { MembersList } from "./pages/dashboard/members";
import SignInPage from "./pages/SignIn";
import { SignedIn, SignedOut } from '@clerk/clerk-react'

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public route - redirect based on auth status */}
          <Route path="/" element={
            <>
              <SignedOut>
                <Navigate to="/sign-in" replace />
              </SignedOut>
              <SignedIn>
                <Navigate to="/org-selection" replace />
              </SignedIn>
            </>
          } />

          {/* Sign-in route */}
          <Route path="/sign-in" element={
            <SignedOut>
              <SignInPage />
            </SignedOut>
          } />

          {/* Org selection (protected) */}
          <Route path="/org-selection" element={
            <SignedIn>
              <OrgSelection />
            </SignedIn>
          } />

          {/* Dashboard routes (protected) */}
          <Route path="/dashboard/:org" element={
            <SignedIn>
              <DashboardLayout />
            </SignedIn>
          }>
            <Route index element={<Navigate to="patients" replace />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="members" element={<MembersList />} />
          </Route>

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" />
    </>
  );
}