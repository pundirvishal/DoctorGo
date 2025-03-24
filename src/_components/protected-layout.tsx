// src/_components/protected-layout.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export function ProtectedLayout() {
  const { isSignedIn, user } = useUser();

  // If not signed in, redirect to the sign-in page.
  if (!isSignedIn) {
    return <Navigate to="/sign-in" />;
  }
  else{
    console.log(user)
  }

  // If signed in, render the nested routes.
  return <Outlet />;
}
