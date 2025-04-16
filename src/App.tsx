import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import OrgSelection from "./pages/org-selection";
import { DashboardLayout } from "@/_components/dashboard/layout";
import PatientsPage from "./pages/dashboard/patients";
import ReportsPage from "./pages/dashboard/reports";
import { MembersList } from "./pages/dashboard/members";
import SignInPage from "./pages/SignIn";
import { SignedIn, SignedOut } from "@clerk/clerk-react";

// Import OrgProvider
import { OrgProvider } from "../context/orgProvider";
import { JSX } from "react";

// Helper component to validate orgId
function ValidateOrg({ children }: { children: JSX.Element }) {
  const { org } = useParams<{ org: string }>();

  // Check if the org is "personal" and redirect to /org-selection if so
  if (org === "personal") {
    return <Navigate to="/org-selection" replace />;
  }

  // Render children if org is valid
  return children;
}

export default function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Authentication-based redirects */}
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

          {/* Public routes */}
          <Route path="/sign-in" element={
            <SignedOut>
              <SignInPage />
            </SignedOut>
          } />

          {/* Protected routes */}
          <Route path="/org-selection" element={
            <SignedIn>
              <OrgSelection />
            </SignedIn>
          } />

          {/* Dashboard routes */}
          <Route path="/dashboard/:org" element={
            <SignedIn>
              <ValidateOrg>
                {/* Wrap dashboard routes with OrgProvider */}
                <OrgProvider>
                  <DashboardLayout />
                </OrgProvider>
              </ValidateOrg>
            </SignedIn>
          }>
            <Route index element={<Navigate to="patients" replace />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="members" element={<MembersList />} />
            <Route path="*" element={<Navigate to="../patients" replace />} />
          </Route>

          {/* Global redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <Toaster position="bottom-right" />
    </>
  );
}
