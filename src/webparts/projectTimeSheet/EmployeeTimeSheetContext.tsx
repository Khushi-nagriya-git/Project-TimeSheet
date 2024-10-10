import * as React from 'react';
import { ReactNode, createContext, useContext, useState } from 'react';
import { LoggedInUserDetails, ProjectsData, projectsInitialState } from './CustomComponents/Projects/IProjectStats';
import { JobsData, jobsInitialState } from './CustomComponents/Jobs/IJobsStats';
import { TimeLogsData } from './CustomComponents/TimeLogs/ITimeLogsStats';

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
  jobsData: JobsData[];
  setJobsData:  React.Dispatch<React.SetStateAction<JobsData[]>>;
  timeLogsData:TimeLogsData[],
  setTimeLogsData:  React.Dispatch<React.SetStateAction<[]>>;
  siteUsers : [],
  setSiteUsers :  React.Dispatch<React.SetStateAction<[]>>;
 
}

// Default values for the context
const defaultContextValue: EmployeeTimeSheetContextType = {
  projectsData: projectsInitialState.projectsData,
  isUserReportingManager:false,
  isUserProjectManager:false,
  isUserAdmin:false,
  isUserProjectTeam:false,
  loggedInUserDetails:'',
  jobsData:jobsInitialState.jobsData,
  timeLogsData:[],
  siteUsers:[],
  setSiteUsers:() => {},
  setTimeLogsData:() => {},
  setJobsData:() => {},
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
const [jobsData, setJobsData] = useState<JobsData[]>(
  jobsInitialState.jobsData
);
const [timeLogsData, setTimeLogsData] = useState<TimeLogsData[]>([]);
const [isUserProjectTeam, setIsUserProjectTeam] = useState<boolean>(false);
const [loggedInUserDetails, setLoggedInUserDetails] = useState<LoggedInUserDetails>(projectsInitialState.loggedInUserDetails);
const [siteUsers , setSiteUsers] = useState<[]>([]);


  return (
    <EmployeeTimeSheetContext.Provider value={{ projectsData,jobsData,setJobsData,timeLogsData,setTimeLogsData, setProjectsData, setSiteUsers,siteUsers,isUserAdmin,  setUserAdmin, isUserProjectTeam, setIsUserProjectTeam, loggedInUserDetails, setLoggedInUserDetails, isUserReportingManager, setIsUserReportingManager, isUserProjectManager, setIsUserProjectManager, }}>
      {children}
    </EmployeeTimeSheetContext.Provider>
  );
};

// Custom hook for using context
export const useEmployeeTimeSheetContext = () => useContext(EmployeeTimeSheetContext);
