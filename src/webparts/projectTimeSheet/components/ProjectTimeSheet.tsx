import * as React from "react";
import type { IProjectTimeSheetProps } from "./IProjectTimeSheetProps";
import Project from "../CustomComponents/Projects/Project";
import Jobs from "../CustomComponents/Jobs/Jobs";
import HomePage from "../CustomComponents/HomePage";
import AppHeader from "../CustomComponents/App Header/AppHeader";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import TimeLogs from "../CustomComponents/TimeLogs/TimeLogs";
import {LoggedInUserDetails,projectsInitialState,} from "../CustomComponents/Projects/IProjectStats";
import { getLoggedInUserData } from "../CustomComponents/Projects/Services";
import TimeSheet from "../CustomComponents/TimeSheet/TimeSheet";
import { ChoiceFieldFormatType } from "@pnp/sp/fields/types";
import { EmployeeTimeSheetProvider } from "../EmployeeTimeSheetContext";
import { HashRouter, Route, Routes } from "react-router-dom";
import ProjectDashboard from "../CustomComponents/Projects/ProjectDashboard/ProjectDashboard";
import ConfigurationScreen from "../CustomComponents/ConfigurationScreen/ConfigurationScreen";
import { getConfigurationListData} from "./Service";
import { SPFI, SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/lists/web";
import "@pnp/sp/items";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "@pnp/sp/fields";
import "@pnp/sp/lists/web";
import "@pnp/sp/attachments";
import "@pnp/sp/views";
import { WebPartContext } from "@microsoft/sp-webpart-base";
let sp: SPFI = spfi();

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

const ProjectTimeSheet: React.FC<IProjectTimeSheetProps> = (  props: IProjectTimeSheetProps) => {
  const [isUserReportingManager, setIsUserReportingManager] = useState<boolean>(false);
  const [isUserProjectManager, setIsUserProjectManager] = useState<boolean>(false);
  const [isUserAdmin, setUserAdmin] = useState<boolean>(false);
  const [isUserProjectTeam, setIsUserProjectTeam] = useState<boolean>(false);
  const [loggedInUserDetails, setLoggedInUserDetails] = useState<LoggedInUserDetails>(projectsInitialState.loggedInUserDetails);
  const [isDataAvailable, setIsDataAvailable] = useState<boolean>(false);
  const [configurationListData, setConfigurationListData] = useState<ConfigurationData[]>([{ Permissions: '', Title: '' , AttachmentFiles: ''}]);
  const [reload , setReload] = useState('false');

  useEffect(() => {
    const fetchData = async () => {
      await provisionProjectList ();
      await provisionConfigurationsList ();
      await provisionDepartmentsList ();
      await provisionTasksList();
      await provisionTimeLogsList();
      const configurationData = await getConfigurationListData(props.spHttpClient , props.absoluteURL);
      setConfigurationListData(configurationData);
      let userData: LoggedInUserDetails = await getLoggedInUserData( props.spHttpClient,props.absoluteURL);
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
      let reportingMangerGroup = false;
      let adminGroup = false;
      const configurationData = await getConfigurationListData(props.spHttpClient , props.absoluteURL);
      setConfigurationListData(configurationData);
      let userData: LoggedInUserDetails = await getLoggedInUserData(props.spHttpClient,props.absoluteURL);
      setLoggedInUserDetails(userData || {});
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
    const response = await fetch(`${siteUrl}/_api/web/sitegroups(${groupId})/users`, {headers: { Accept: "application/json;odata=verbose",},});
    const result = await response.json();
    return result.d.results.map((user: any) => user.Email);
  };

  const getSP = (context:WebPartContext)=>{
    sp = spfi().using(SPFx(context))
    return sp;
  }

  const provisionProjectList = async () => {
    const sp = await getSP(props.context);
    let listTitle = "Projects";
    const projectStatusChoice = ["Not Started" , "In Progress" , "Completed" , "On Hold"]
    const projectTypeChoice = ["Fixed Cost" , "Resource Based"]
    try {
      // Check if the list already exists
      const listEnsureResult = await sp.web.lists.ensure(listTitle);
      // check if the list was created, or if it already existed:
      if (listEnsureResult.created) {
        await sp.web.lists .getByTitle(listTitle).fields.addNumber("ProjectId", { Required: true });
        await sp.web.lists .getByTitle(listTitle).fields.addText("ProjectName", { MaxLength: 255, Required: true });
        await sp.web.lists .getByTitle(listTitle).fields.addText("ClientName", { MaxLength: 255,  });
        await sp.web.lists .getByTitle(listTitle).fields.addNumber("ProjectCost", { Required: true });
        await sp.web.lists .getByTitle(listTitle).fields.addUser("ProjectManagerPeoplePicker")
        await sp.web.lists .getByTitle(listTitle).fields.addUser("ProjectTeamPeoplePicker")
        await sp.web.lists .getByTitle(listTitle).fields.addUser("ReportingManagerPeoplePicker" )
        await sp.web.lists .getByTitle(listTitle).fields.addMultilineText("ProjectManager", {  Required: false, RichText: false,  NumberOfLines: 998, });
        await sp.web.lists .getByTitle(listTitle).fields.addMultilineText("ProjectTeam", {  Required: false, RichText: false,  NumberOfLines: 998, });
        await sp.web.lists .getByTitle(listTitle).fields.addMultilineText("ReportingManager", {  Required: false, RichText: false,  NumberOfLines: 998, });
        await sp.web.lists .getByTitle(listTitle).fields.addMultilineText("DepartmentsORTeam", {  Required: false, RichText: false,  NumberOfLines: 998, });
        await sp.web.lists .getByTitle(listTitle).fields.addMultilineText("Description", {  Required: false, RichText: false,  NumberOfLines: 998, });
        await sp.web.lists .getByTitle(listTitle).fields.addNumber("ProjectHours", { Required: false });
        await sp.web.lists .getByTitle(listTitle).fields.addChoice("ProjectStatus" , {Choices: projectStatusChoice , EditFormat: ChoiceFieldFormatType.Dropdown , FillInChoice: false})
        await sp.web.lists .getByTitle(listTitle).fields.addChoice("ProjectType" , {Choices: projectTypeChoice , EditFormat: ChoiceFieldFormatType.Dropdown , FillInChoice: false})

        //Update field
        await sp.web.lists.getByTitle(listTitle).fields.getByTitle("Title").update({ Required: false });
        await sp.web.lists.getByTitle(listTitle).fields.getByTitle("ReportingManagerPeoplePicker").update({AllowMultipleValues: false});
        await sp.web.lists.getByTitle(listTitle).fields.getByTitle("ProjectTeamPeoplePicker").update({AllowMultipleValues: true});
        await sp.web.lists.getByTitle(listTitle).fields.getByTitle("ReportingManagerPeoplePicker").update({AllowMultipleValues: false});

        // Hide the list
        await sp.web.lists.getByTitle(listTitle).update({Hidden: true})
      } else {
        // console.log("List already existed!");
      }
    } catch (error) {
      //console.error("Error provisioning list:", error);
    }
  };

  const provisionTasksList = async () => {
    const sp = await getSP(props.context);
    let listTitle = "Tasks";
    const jobStatusChoice = ["Not Started" , "In Progress" , "Completed" , "On Hold"]
    const BillableStatusChoice = ["nonbillable" , "billable"]
    try {
      const listEnsureResult = await sp.web.lists.ensure(listTitle);
      if (listEnsureResult.created) {
        await sp.web.lists .getByTitle(listTitle).fields.addNumber("JobId", { Required: true });
        await sp.web.lists .getByTitle(listTitle).fields.addNumber("ProjectId", { Required: true });
        await sp.web.lists .getByTitle(listTitle).fields.addText("JobName", { MaxLength: 255, Required: true });
        await sp.web.lists .getByTitle(listTitle).fields.addText("ProjectName", { MaxLength: 255, Required: true });
        await sp.web.lists .getByTitle(listTitle).fields.addDateTime("StartDate");
        await sp.web.lists .getByTitle(listTitle).fields.addDateTime("EndDate");
        await sp.web.lists .getByTitle(listTitle).fields.addMultilineText("Description", {  Required: false, RichText: false,  NumberOfLines: 998, });
        await sp.web.lists .getByTitle(listTitle).fields.addChoice("JobStatus" , {Choices: jobStatusChoice , EditFormat: ChoiceFieldFormatType.Dropdown , FillInChoice: false})
        await sp.web.lists .getByTitle(listTitle).fields.addChoice("BillableStatus" , {Choices: BillableStatusChoice , EditFormat: ChoiceFieldFormatType.Dropdown , FillInChoice: false})
        await sp.web.lists .getByTitle(listTitle).fields.addMultilineText("AssignedTo", {  Required: false, RichText: false,  NumberOfLines: 998, });
        await sp.web.lists .getByTitle(listTitle).fields.addNumber("loggedHours", { Required: false });
        await sp.web.lists .getByTitle(listTitle).fields.addNumber("EstimatedHours", { Required: false });
        await sp.web.lists .getByTitle(listTitle).fields.addUser("AssignedToPeoplePicker")
        await sp.web.lists. getByTitle(listTitle).fields.getByTitle("Title").update({ Required: false });
        await sp.web.lists. getByTitle(listTitle).fields.getByTitle("AssignedToPeoplePicker").update({AllowMultipleValues: true});
        await sp.web.lists. getByTitle(listTitle).fields.getByTitle("Title") .setShowInDisplayForm(false);
        await sp.web.lists. getByTitle(listTitle).fields.getByTitle("Title").setShowInEditForm(false);
        await sp.web.lists .getByTitle(listTitle).fields.getByTitle("Title").setShowInNewForm(false);
        await sp.web.lists. getByTitle(listTitle).update({Hidden: true})
      } else {
        // console.log("List already existed!");
      }
    } catch (error) {
      //console.error("Error provisioning list:", error);
    }
  };

  const provisionTimeLogsList = async () => {
    const sp = await getSP(props.context);
    let listTitle = "TimeLogs";
    const BillableStatusChoice = ["Non Billable" , "Billable"]
    const StatusChoice = ["Not Submitted" , "Pending" , "Approved" , "Rejected"]
    try {
      const listEnsureResult = await sp.web.lists.ensure(listTitle);
      if (listEnsureResult.created) {
        await sp.web.lists .getByTitle(listTitle).fields.addNumber("TimelogsId", { Required: true });
        await sp.web.lists .getByTitle(listTitle).fields.addNumber("JobId", { Required: true });
        await sp.web.lists .getByTitle(listTitle).fields.addNumber("ProjectId", { Required: true });
        await sp.web.lists .getByTitle(listTitle).fields.addText("JobName", { MaxLength: 255, Required: true });
        await sp.web.lists .getByTitle(listTitle).fields.addText("ProjectName", { MaxLength: 255, Required: true });
        await sp.web.lists .getByTitle(listTitle).fields.addMultilineText("Description", {  Required: false, RichText: false,  NumberOfLines: 998, });
        await sp.web.lists .getByTitle(listTitle).fields.addChoice("BillableStatus" , {Choices: BillableStatusChoice , EditFormat: ChoiceFieldFormatType.Dropdown , FillInChoice: false})
        await sp.web.lists .getByTitle(listTitle).fields.addNumber("LoggedHours", { Required: false });
        await sp.web.lists .getByTitle(listTitle).fields.addNumber("EstimatedHours", { Required: false });
        await sp.web.lists .getByTitle(listTitle).fields.addChoice("Status" , {Choices: StatusChoice , EditFormat: ChoiceFieldFormatType.Dropdown , FillInChoice: false})
        await sp.web.lists.getByTitle(listTitle).fields.getByTitle("Status").update({  DefaultValue: StatusChoice[0]});
        await sp.web.lists.getByTitle(listTitle).fields.getByTitle("Title").update({ Required: false });
        await sp.web.lists.getByTitle(listTitle).fields.getByTitle("Title") .setShowInDisplayForm(false);
        await sp.web.lists.getByTitle(listTitle).fields.getByTitle("Title").setShowInEditForm(false);
        await sp.web.lists .getByTitle(listTitle).fields.getByTitle("Title").setShowInNewForm(false);
        await sp.web.lists.getByTitle(listTitle).update({Hidden: true})
      } else {
        // console.log("List already existed!");
      }
    } catch (error) {
      //console.error("Error provisioning list:", error);
    }
  };

  const provisionConfigurationsList = async () => {
    const sp = await getSP(props.context);
    let listTitle = "Configurations";
    try {
      const listEnsureResult = await sp.web.lists.ensure(listTitle);
      if (listEnsureResult.created) {
        await sp.web.lists .getByTitle(listTitle).fields.addMultilineText("Permissions", {  Required: false, RichText: false,  NumberOfLines: 998, });
        await sp.web.lists.getByTitle(listTitle).fields.getByTitle("Title").update({ Required: false });
        await sp.web.lists.getByTitle(listTitle).update({Hidden: true})
      } else {
        // console.log("List already existed!");
      }
    } catch (error) {
      //console.error("Error provisioning list:", error);
    }
  };

  const provisionDepartmentsList = async () => {
    const sp = await getSP(props.context);
    let listTitle = "Departments";
    try {
      const listEnsureResult = await sp.web.lists.ensure(listTitle);
      if (listEnsureResult.created) {
        await sp.web.lists .getByTitle(listTitle).fields.addText("DepartmentName", { MaxLength: 255, Required: true });
        await sp.web.lists.getByTitle(listTitle).fields.addBoolean("isActive");
        await sp.web.lists.getByTitle(listTitle).fields.getByTitle("Title").update({ Required: false });
        await sp.web.lists.getByTitle(listTitle).update({Hidden: true})
      } else {
        // console.log("List already existed!");
      }
    } catch (error) {
      //console.error("Error provisioning list:", error);
    }
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
            <AppHeader userEmail={props.context.pageContext.user.email} userName={props.context.pageContext.user.displayName} isUserAdmin={isUserAdmin} siteURL={props.context.pageContext.web.absoluteUrl}title={configurationListData && configurationListData[0]?.Title ? configurationListData[0].Title : "Employee Timesheet"} configurationListData ={configurationListData}  logo={configurationListData && configurationListData[0]?.AttachmentFiles ? configurationListData[0]?.AttachmentFiles : {}} absoluteURL = {props.absoluteURL}  />
            <MainContainer>
              <ContentContainer>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/ConfigurationScreen" element={ <ConfigurationScreen spHttpClient={props.spHttpClient} absoluteURL={props.absoluteURL} context={props.context} title={props.title}  configurationListData={configurationListData} configurationListDataLength={configurationListData?.length ? configurationListData?.length : 0} loggedInUserDetails={loggedInUserDetails} isUserProjectTeam={isUserProjectTeam} isUserAdmin={isUserAdmin} isUserProjectManager={isUserProjectManager}setReload={setReload} isUserReportingManager={isUserReportingManager} /> } />
                  <Route path="/Projects" element={ <Project spHttpClient={props.spHttpClient} absoluteURL={props.absoluteURL} context={props.context}loggedInUserDetails={loggedInUserDetails} isUserProjectTeam={isUserProjectTeam} isUserAdmin={isUserAdmin} isUserProjectManager={isUserProjectManager} isUserReportingManager={isUserReportingManager} /> } />
                  <Route path="/Projects/:id" element={ <ProjectDashboard spHttpClient={props.spHttpClient} absoluteURL={props.absoluteURL} loggedInUserDetails={loggedInUserDetails}isUserAdmin={isUserAdmin} context={props.context}/> } />
                  <Route path="/Tasks" element={ <Jobs spHttpClient={props.spHttpClient}  absoluteURL={props.absoluteURL} context={props.context}  loggedInUserDetails={loggedInUserDetails}isUserProjectTeam={isUserProjectTeam}isUserAdmin={isUserAdmin} isUserProjectManager={isUserProjectManager} isUserReportingManager={isUserReportingManager}/> } />
                  <Route path="/TimeLogs" element={<TimeLogs spHttpClient={props.spHttpClient} absoluteURL={props.absoluteURL} context={props.context} loggedInUserDetails={loggedInUserDetails} isUserProjectTeam={isUserProjectTeam} isUserAdmin={isUserAdmin}isUserProjectManager={isUserProjectManager}isUserReportingManager={isUserReportingManager} />  } />
                  <Route path="/TimeSheets" element={<TimeSheet spHttpClient={props.spHttpClient} absoluteURL={props.absoluteURL} context={props.context} loggedInUserDetails={loggedInUserDetails} isUserProjectTeam={isUserProjectTeam} isUserAdmin={isUserAdmin} isUserProjectManager={isUserProjectManager}isUserReportingManager={isUserReportingManager} />} /> </Routes>
              </ContentContainer>
            </MainContainer>
          </HashRouter>
        </div>
      )}
    </EmployeeTimeSheetProvider>
  );
};

export default ProjectTimeSheet;
