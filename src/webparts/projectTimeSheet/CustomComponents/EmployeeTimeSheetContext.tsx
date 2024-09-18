import * as React from 'react';
import { ReactNode, createContext, useContext, useState } from 'react';
import { ProjectsData, projectsInitialState } from './Projects/IProjectStats';

// Define the shape of the context value
interface EmployeeTimeSheetContextType {
  projectsData: ProjectsData[];
  setProjectsData: React.Dispatch<React.SetStateAction<ProjectsData[]>>;
}

// Default values for the context
const defaultContextValue: EmployeeTimeSheetContextType = {
  projectsData: projectsInitialState.projectsData,
  setProjectsData: () => {},
};

// Create the context
const EmployeeTimeSheetContext = createContext<EmployeeTimeSheetContextType>(defaultContextValue);

// Create a provider component
export const EmployeeTimeSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projectsData, setProjectsData] = useState<ProjectsData[]>(projectsInitialState.projectsData);

  return (
    <EmployeeTimeSheetContext.Provider value={{ projectsData, setProjectsData }}>
      {children}
    </EmployeeTimeSheetContext.Provider>
  );
};

// Custom hook for using context
export const useEmployeeTimeSheetContext = () => useContext(EmployeeTimeSheetContext);
