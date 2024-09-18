import * as React from "react";
import styles from "./ProjectTimeSheet.module.scss";
import type { IProjectTimeSheetProps } from "./IProjectTimeSheetProps";
import Project from "../CustomComponents/Projects/Project";
import Jobs from "../CustomComponents/Jobs/Jobs";
import HomePage from "../CustomComponents/HomePage";
import AppHeader from "../CustomComponents/App Header/AppHeader";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import TimeLogs from "../CustomComponents/TimeLogs/TimeLogs";
import {
  LoggedInUserDetails,
  projectsInitialState,
} from "../CustomComponents/Projects/IProjectStats";
import { getLoggedInUserData } from "../CustomComponents/Projects/Services";
import TimeSheet from "../CustomComponents/TimeSheet/TimeSheet";
import { EmployeeTimeSheetProvider } from "../CustomComponents/EmployeeTimeSheetContext";
import { HashRouter, Route, Routes } from "react-router-dom";
import { useEmployeeTimeSheetContext } from "../CustomComponents/EmployeeTimeSheetContext";

const MainContainer = styled(Box)({
  display: "flex",
  height: "100%",
  width: "100%",
  overflow: "hidden",
});

const ContentContainer = styled(Box)({
  flexGrow: 1,
  transition: "margin 0.3s",
});

const ProjectTimeSheet: React.FC<IProjectTimeSheetProps> = (
  props: IProjectTimeSheetProps
) => {
  const [isUserReportingManager, setIsUserReportingManager] =
    useState<boolean>(false);
  const [isUserProjectManager, setIsUserProjectManager] =
    useState<boolean>(false);
  const [isUserAdmin, setUserAdmin] = useState<boolean>(false);
  const [isUserProjectTeam, setIsUserProjectTeam] = useState<boolean>(false);
  const [loggedInUserDetails, setLoggedInUserDetails] =
    useState<LoggedInUserDetails>(projectsInitialState.loggedInUserDetails);
  const [isDataAvailable, setIsDataAvailable] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      let userData: LoggedInUserDetails = await getLoggedInUserData(
        props.spHttpClient,
        props.absoluteURL
      );
      setLoggedInUserDetails(userData || {});
      userData.Groups?.forEach((group: { Title: string }) => {
        setIsDataAvailable(true);
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
    };
    fetchData();
  }, []);

  return (
    <EmployeeTimeSheetProvider>
      {isDataAvailable && (
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
              <HashRouter>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/Projects"
                    element={
                      <Project
                        spHttpClient={props.spHttpClient}
                        absoluteURL={props.absoluteURL}
                        context={props.context}
                        loggedInUserDetails={loggedInUserDetails}
                        isUserProjectTeam={isUserProjectTeam}
                        isUserAdmin={isUserAdmin}
                        isUserProjectManager={isUserProjectManager}
                        isUserReportingManager={isUserReportingManager}
                      />
                    }
                  />
                  <Route
                    path="/Tasks"
                    element={
                      <Jobs
                        spHttpClient={props.spHttpClient}
                        absoluteURL={props.absoluteURL}
                        context={props.context}
                        loggedInUserDetails={loggedInUserDetails}
                        isUserProjectTeam={isUserProjectTeam}
                        isUserAdmin={isUserAdmin}
                        isUserProjectManager={isUserProjectManager}
                        isUserReportingManager={isUserReportingManager}
                      />
                    }
                  />
                  <Route
                    path="/TimeLogs"
                    element={
                      <TimeLogs
                        spHttpClient={props.spHttpClient}
                        absoluteURL={props.absoluteURL}
                        context={props.context}
                        loggedInUserDetails={loggedInUserDetails}
                        isUserProjectTeam={isUserProjectTeam}
                        isUserAdmin={isUserAdmin}
                        isUserProjectManager={isUserProjectManager}
                        isUserReportingManager={isUserReportingManager}
                      />
                    }
                  />
                  <Route
                    path="/TimeSheets"
                    element={
                      <TimeSheet
                        spHttpClient={props.spHttpClient}
                        absoluteURL={props.absoluteURL}
                        context={props.context}
                        loggedInUserDetails={loggedInUserDetails}
                        isUserProjectTeam={isUserProjectTeam}
                        isUserAdmin={isUserAdmin}
                        isUserProjectManager={isUserProjectManager}
                        isUserReportingManager={isUserReportingManager}
                      />
                    }
                  />
                </Routes>
              </HashRouter>
            </ContentContainer>
          </MainContainer>
        </div>
      )}
    </EmployeeTimeSheetProvider>
  );
};

export default ProjectTimeSheet;
