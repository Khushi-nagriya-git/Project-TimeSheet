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
import { EmployeeTimeSheetProvider } from "../EmployeeTimeSheetContext";
import { HashRouter, Route, Routes } from "react-router-dom";
import { useEmployeeTimeSheetContext } from "../EmployeeTimeSheetContext";
import ProjectDashboard from "../CustomComponents/Projects/ProjectDashboard/ProjectDashboard";
import ConfigurationScreen from "../CustomComponents/ConfigurationScreen/ConfigurationScreen";
import { getAllSiteUsers , getConfigurationListData} from "./Service";

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

interface ConfigurationData {
  AttachmentFiles: any;
  Permissions: string | { Admin: string[]; ReportingManager: string[] };
  Title: string;
}

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
  const [configurationListData, setConfigurationListData] = useState<ConfigurationData[]>([{ Permissions: '', Title: '' , AttachmentFiles: ''}]);
  const [reload , setReload] = useState('false');

  useEffect(() => {
    const fetchData = async () => {
      const configurationData = await getConfigurationListData(props.spHttpClient , props.absoluteURL);
      setConfigurationListData(configurationData);
      let userData: LoggedInUserDetails = await getLoggedInUserData(
        props.spHttpClient,
        props.absoluteURL
      );

      setLoggedInUserDetails(userData || {});
      let reportingMangerGroup = false;
      let adminGroup = false;


      if(configurationData){
        let data=(JSON.parse(configurationData? configurationData[0]?.Permissions : ''));
        
      const reportingManager = data?.ReportingManager?.includes(userData?.Email);

      for (let i = 0; i < data?.ReportingManagerGroups?.length; i++) {
        const groupEmails = await getGroupMembers(data.ReportingManagerGroups[i].split(",")[0]);
        if (groupEmails?.includes(userData?.Email)) {
          reportingMangerGroup = true;
          break; 
        }
      }
      if(reportingMangerGroup || reportingManager){
        setIsUserReportingManager(true);
      }

      const admin = data?.Admin?.includes(userData?.Email);
      for (let i = 0; i < data?.AdminGroup?.length; i++) {
        const groupEmails = await getGroupMembers(data.AdminGroup[i].split(",")[0]);
        if (groupEmails?.includes(userData?.Email)) {
          adminGroup = true;
          break; 
        }
      }
     if(admin || adminGroup){
      setUserAdmin(true);
     }
      }
      setIsDataAvailable(true);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const configurationData = await getConfigurationListData(props.spHttpClient , props.absoluteURL);
      setConfigurationListData(configurationData);
      let userData: LoggedInUserDetails = await getLoggedInUserData(
        props.spHttpClient,
        props.absoluteURL
      );

      setLoggedInUserDetails(userData || {});
      let reportingMangerGroup = false;
      let adminGroup = false;


      if(configurationData){
        let data=(JSON.parse(configurationData? configurationData[0]?.Permissions : ''));
        
      const reportingManager = data?.ReportingManager?.includes(userData?.Email);

      for (let i = 0; i < data?.ReportingManagerGroups?.length; i++) {
        const groupEmails = await getGroupMembers(data.ReportingManagerGroups[i].split(",")[0]);
        if (groupEmails?.includes(userData?.Email)) {
          reportingMangerGroup = true;
          break; 
        }
      }
      if(reportingMangerGroup || reportingManager){
        setIsUserReportingManager(true);
      }

      const admin = data?.Admin?.includes(userData?.Email);
      for (let i = 0; i < data?.AdminGroup?.length; i++) {
        const groupEmails = await getGroupMembers(data.AdminGroup[i].split(",")[0]);
        if (groupEmails?.includes(userData?.Email)) {
          adminGroup = true;
          break; 
        }
      }
     if(admin || adminGroup){
      setUserAdmin(true);
     }
      }
      setIsDataAvailable(true);
    };
    fetchData();
  }, [reload]);

  const getGroupMembers = async (groupId: string) => {
    const siteUrl = props.context.pageContext.site.absoluteUrl;
    const response = await fetch(`${siteUrl}/_api/web/sitegroups(${groupId})/users`, {
      headers: {
        Accept: "application/json;odata=verbose",
      },
    });
    const result = await response.json();
    return result.d.results.map((user: any) => user.Email);
  };

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
          <HashRouter>
            <AppHeader
              userEmail={props.context.pageContext.user.email}
              userName={props.context.pageContext.user.displayName}
              siteURL={props.context.pageContext.web.absoluteUrl}
              title={configurationListData && configurationListData[0]?.Title ? configurationListData[0].Title : "Employee Timesheet"}
              logo={configurationListData && configurationListData[0]?.AttachmentFiles ? configurationListData[0]?.AttachmentFiles : {}}
              absoluteURL = {props.absoluteURL}
            />
            <MainContainer>
              <ContentContainer>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route
                    path="/ConfigurationScreen"
                    element={
                      <ConfigurationScreen
                        spHttpClient={props.spHttpClient}
                        absoluteURL={props.absoluteURL}
                        context={props.context}
                        title={props.title} 
                        configurationListData={configurationListData}
                        configurationListDataLength={configurationListData?.length ? configurationListData?.length : 0}
                        loggedInUserDetails={loggedInUserDetails}
                        isUserProjectTeam={isUserProjectTeam}
                        isUserAdmin={isUserAdmin}
                        isUserProjectManager={isUserProjectManager}
                        setReload={setReload}
                        isUserReportingManager={isUserReportingManager}
                      />
                    }
                  />
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
                    path="/Projects/:id"
                    element={
                      <ProjectDashboard
                        spHttpClient={props.spHttpClient}
                        absoluteURL={props.absoluteURL}
                        loggedInUserDetails={loggedInUserDetails}
                        isUserAdmin={isUserAdmin}
                        context={props.context}
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
              </ContentContainer>
            </MainContainer>
          </HashRouter>
        </div>
      )}
    </EmployeeTimeSheetProvider>
  );
};

export default ProjectTimeSheet;
