import * as React from "react";
import styles from "./ProjectTimeSheet.module.scss";
import type { IProjectTimeSheetProps } from "./IProjectTimeSheetProps";
import Project from "../CustomComponents/Projects/Project";
import Jobs from "../CustomComponents/Jobs/Jobs";
import AppHeader from "../CustomComponents/App Header/AppHeader";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import TimeLogs from "../CustomComponents/TimeLogs/TimeLogs";
import { LoggedInUserDetails, projectsInitialState } from "../CustomComponents/Projects/IProjectStats";
import { getLoggedInUserData } from "../CustomComponents/Projects/Services";
import TimeSheet from "../CustomComponents/TimeSheet/TimeSheet";
import { EmployeeTimeSheetProvider } from "../CustomComponents/EmployeeTimeSheetContext";


const MainContainer = styled(Box)({
  display: "flex",
  height: "100%", // Full viewport height
  width: "100%",
  overflow: "hidden",
});

const ContentContainer = styled(Box)({
  flexGrow: 1,
  transition: "margin 0.3s", // Smooth transition for drawer open/close
});

const ProjectTimeSheet: React.FC<IProjectTimeSheetProps> = (
  props: IProjectTimeSheetProps
) => {
  const [moduleTab, setModuleTab] = useState("Projects");
  const [isUserReportingManager , setIsUserReportingManager] = useState<Boolean>(false);
  const [isUserProjectManager , setIsUserProjectManager] = useState<Boolean>(false);
  const [isUserAdmin , setUserAdmin] = useState<Boolean>(false);
  const [isUserProjectTeam , setIsUserProjectTeam] = useState<Boolean>(false);
  const [loggedInUserDetails ,setLoggedInUserDetails] = useState<LoggedInUserDetails>(projectsInitialState.loggedInUserDetails);
  const [isDataAvaiable , setIsDataAvaiable] = useState<Boolean>(false);
   useEffect(() => {
    const fetchData = async () => {
    let userData: LoggedInUserDetails = await getLoggedInUserData(props.spHttpClient, props.absoluteURL);
      setLoggedInUserDetails(userData || {});
      userData.Groups?.forEach((group: { Title: string }) => {
        setIsDataAvaiable(true);
        switch (group.Title.trim()) {
          case "PTReportingManager":
            setIsUserReportingManager(true);
            break;
          case "PTProjectManager":
            setIsUserProjectManager(true);
            break;
          case "PTUsers":
            setIsUserProjectTeam(true);
            break;
            case "ProjectTimeSheetAdmin":
              setUserAdmin(true);
            break;
          default:
            break;
        }
      });
    }
    fetchData();
  }, []);

  return (
    <>
    <EmployeeTimeSheetProvider>
    {isDataAvaiable && (
        <div>
          <style>
            {`
              #spSiteHeader,
              #spCommandBar,
              #sp-appBar {
                display: none;
              }
            `}
          </style>
          <AppHeader
            userEmail={props.context.pageContext.user.email}
            userName={props.context.pageContext.user.displayName}
            siteURL={props.context.pageContext.web.absoluteUrl}
          />
          <MainContainer>
            <ContentContainer>
              {moduleTab === "Projects" && (
                <Project
                  spHttpClient={props.spHttpClient}
                  absoluteURL={props.absoluteURL}
                  context={props.context}
                  setModuleTab={setModuleTab}
                  loggedInUserDetails={loggedInUserDetails}
                  isUserProjectTeam={isUserProjectTeam}
                  isUserAdmin={isUserAdmin}
                  isUserProjectManager={isUserProjectManager}
                  isUserReportingManager={isUserReportingManager}
                />
              )}
              {moduleTab === "Jobs" && (
                <Jobs
                  spHttpClient={props.spHttpClient}
                  absoluteURL={props.absoluteURL}
                  context={props.context}
                  setModuleTab={setModuleTab}
                  loggedInUserDetails={loggedInUserDetails}
                  isUserProjectTeam={isUserProjectTeam}
                  isUserAdmin={isUserAdmin}
                  isUserProjectManager={isUserProjectManager}
                  isUserReportingManager={isUserReportingManager}
                />
              )}
              {moduleTab === "TimeLogs" && (
                <TimeLogs
                  spHttpClient={props.spHttpClient}
                  absoluteURL={props.absoluteURL}
                  context={props.context}
                  setModuleTab={setModuleTab}
                  loggedInUserDetails={loggedInUserDetails}
                  isUserProjectTeam={isUserProjectTeam}
                  isUserAdmin={isUserAdmin}
                  isUserProjectManager={isUserProjectManager}
                  isUserReportingManager={isUserReportingManager}
                />
              )}
              {moduleTab === "TimeSheets" && (
                <TimeSheet 
                spHttpClient={props.spHttpClient}
                absoluteURL={props.absoluteURL}
                context={props.context}
                setModuleTab={setModuleTab}
                loggedInUserDetails={loggedInUserDetails}
                isUserProjectTeam={isUserProjectTeam}
                isUserAdmin={isUserAdmin}
                isUserProjectManager={isUserProjectManager}
                isUserReportingManager={isUserReportingManager}
                />
              )}
            </ContentContainer>
          </MainContainer>
        </div>
      )}
    </EmployeeTimeSheetProvider>
    
    </>
  );
  
  
};

export default ProjectTimeSheet;
