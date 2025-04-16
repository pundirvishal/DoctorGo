import React, { createContext } from "react";
import { useParams } from "react-router-dom";

interface OrgContextType {
  orgId: string | undefined;
}

const OrgContext = createContext<OrgContextType | undefined>(undefined);

export const OrgProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { org } = useParams(); // Extract orgId from the URL
  const orgId = org; // Map 'org' to 'orgId'

  return (
    <OrgContext.Provider value={{ orgId }}>
      {children}
    </OrgContext.Provider>
  );
};

// Export the context for use in other files
export { OrgContext };
