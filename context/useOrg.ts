import { useContext } from "react";
import { OrgContext } from "./orgProvider"; // Adjust the import path as necessary

export const useOrg = () => {
  const context = useContext(OrgContext);
  if (!context) {
    // ADD: Debug statement for missing OrgContext
    console.error("useOrg - OrgContext is not defined. Make sure to wrap your components in OrgProvider.");
    throw new Error("useOrg must be used within an OrgProvider");
  }

  return context;
};
