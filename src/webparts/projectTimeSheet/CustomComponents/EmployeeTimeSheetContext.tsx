import * as React from 'react';
import { ReactNode, createContext, useContext, useState } from 'react';
import { LoggedInUserDetails, ProjectsData, projectsInitialState } from './Projects/IProjectStats';

// Define the shape of the context value
interface EmployeeTimeSheetContextType {
  projectsData: ProjectsData[];
  setProjectsData: React.Dispatch<React.SetStateAction<ProjectsData[]>>;
  isUserReportingManager:boolean;
  setIsUserReportingManager:React.Dispatch<React.SetStateAction<boolean>>;
  isUserProjectManager:boolean;
  setIsUserProjectManager:React.Dispatch<React.SetStateAction<boolean>>;
  isUserAdmin:boolean;
  setUserAdmin:React.Dispatch<React.SetStateAction<boolean>>;
  isUserProjectTeam:boolean;
  setIsUserProjectTeam:React.Dispatch<React.SetStateAction<boolean>>;
  loggedInUserDetails:any;
  setLoggedInUserDetails:React.Dispatch<React.SetStateAction<any>>;

}

// Default values for the context
const defaultContextValue: EmployeeTimeSheetContextType = {
  projectsData: projectsInitialState.projectsData,
  isUserReportingManager:false,
  isUserProjectManager:false,
  isUserAdmin:false,
  isUserProjectTeam:false,
  loggedInUserDetails:'',
  setLoggedInUserDetails:() => {},
  setIsUserProjectTeam:() => {},
  setUserAdmin:() => {},
  setIsUserProjectManager:() => {},
  setIsUserReportingManager:() => {},
  setProjectsData: () => {},

};

// Create the context
const EmployeeTimeSheetContext = createContext<EmployeeTimeSheetContextType>(defaultContextValue);

// Create a provider component
export const EmployeeTimeSheetProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [projectsData, setProjectsData] = useState<ProjectsData[]>(projectsInitialState.projectsData);
  const [isUserReportingManager, setIsUserReportingManager] =
  useState<boolean>(false);
const [isUserProjectManager, setIsUserProjectManager] =
  useState<boolean>(false);
const [isUserAdmin, setUserAdmin] = useState<boolean>(false);
const [isUserProjectTeam, setIsUserProjectTeam] = useState<boolean>(false);
const [loggedInUserDetails, setLoggedInUserDetails] =
  useState<LoggedInUserDetails>(projectsInitialState.loggedInUserDetails);
  return (
    <EmployeeTimeSheetContext.Provider value={{ projectsData, setProjectsData, isUserAdmin,  setUserAdmin, isUserProjectTeam, setIsUserProjectTeam, loggedInUserDetails, setLoggedInUserDetails, isUserReportingManager, setIsUserReportingManager, isUserProjectManager, setIsUserProjectManager, }}>
      {children}
    </EmployeeTimeSheetContext.Provider>
  );
};

// Custom hook for using context
export const useEmployeeTimeSheetContext = () => useContext(EmployeeTimeSheetContext);
