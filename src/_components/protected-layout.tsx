// src/_components/protected-layout.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export function ProtectedLayout() {
  const { isSignedIn} = useUser();

  // If not signed in, redirect to the sign-in page.
  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }

  // If signed in, render the nested routes.
  return <Outlet />;
}
