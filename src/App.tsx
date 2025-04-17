import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import OrgSelection from "./pages/org-selection";
import { DashboardLayout } from "@/_components/dashboard/layout";
import PatientsPage from "./pages/dashboard/patients";
import ReportsPage from "./pages/dashboard/reports";
import { MembersList } from "./pages/dashboard/members";
import SignInPage from "./pages/SignIn";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./App.css"; // Ensure this file contains transition styles

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
    <div className="min-h-screen bg-[var(--color-background)] fade-in">
      <Router>
        <Routes>
          <Route
            path="*"
            element={
              <TransitionGroup>
                <CSSTransition timeout={300} classNames="fade">
                  <Routes>
                    <Route
                      path="/"
                      element={
                        <>
                          <SignedOut>
                            <Navigate to="/sign-in" replace />
                          </SignedOut>
                          <SignedIn>
                            <Navigate to="/org-selection" replace />
                          </SignedIn>
                        </>
                      }
                    />
                    <Route
                      path="/sign-in"
                      element={
                        <SignedOut>
                          <SignInPage />
                        </SignedOut>
                      }
                    />
                    <Route
                      path="/org-selection"
                      element={
                        <SignedIn>
                          <OrgSelection />
                        </SignedIn>
                      }
                    />
                    <Route
                      path="/dashboard/:org"
                      element={
                        <SignedIn>
                          <ValidateOrg>
                            <OrgProvider>
                              <DashboardLayout />
                            </OrgProvider>
                          </ValidateOrg>
                        </SignedIn>
                      }
                    >
                      <Route index element={<Navigate to="patients" replace />} />
                      <Route path="patients" element={<PatientsPage />} />
                      <Route path="reports" element={<ReportsPage />} />
                      <Route path="members" element={<MembersList />} />
                      <Route path="*" element={<Navigate to="../patients" replace />} />
                    </Route>
                  </Routes>
                </CSSTransition>
              </TransitionGroup>
            }
          />
        </Routes>
      </Router>
      <Toaster position="bottom-right" />
    </div>
  );
}
