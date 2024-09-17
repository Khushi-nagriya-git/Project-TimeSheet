import * as React from 'react';
import { ReactNode, createContext, useContext, useState } from 'react';
import { ProjectsData, projectsInitialState } from './Projects/IProjectStats';

// Define the shape of the context value
interface EmployeeTimeSheetContextType {
  projectsData: ProjectsData[]; // Correct type for projectsData
  setProjectsData: React.Dispatch<React.SetStateAction<ProjectsData[]>>; // Correct type for setProjectsData
}

// Create a default value (optional)
const defaultContextValue: EmployeeTimeSheetContextType = {
  projectsData: projectsInitialState.projectsData,
  setProjectsData: () => {}, // Default to an empty function
};

// Create the context
const EmployeeTimeSheetContext = createContext<EmployeeTimeSheetContextType>(defaultContextValue);

// Create a provider component
export const EmployeeTimeSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projectsData, setProjectsData] = useState<ProjectsData[]>(projectsInitialState.projectsData); // Initialize with the correct type

  return (
    <EmployeeTimeSheetContext.Provider value={{ projectsData, setProjectsData }}>
      {children}
    </EmployeeTimeSheetContext.Provider>
  );
};

// Custom hook for using context
export const useEmployeeTimeSheetContext = () => useContext(EmployeeTimeSheetContext);
