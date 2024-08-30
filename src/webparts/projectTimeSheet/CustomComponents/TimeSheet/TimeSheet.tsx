import * as React from "react";
import { useState, useEffect } from "react";
import { ITimeSheetProps } from "./ITimeSheetProps";
import { styled } from "styled-components";
import { Button, Grid, IconButton } from "@mui/material";
import TopNavigation from "../Navigation/TopNavigation";
import TimeSheetTable from "./TimeSheetTable/TimeSheetTable";
import { TimeLogsData } from "../TimeLogs/ITimeLogsStats";
import { getTimeLogsListData } from "../TimeLogs/Services";
import { getProjectListData } from "../Projects/Services";
import { ProjectsData, projectsInitialState } from "../Projects/IProjectStats";

const FullHeightGrid = styled(Grid)({
  height: "100%",
  boxSizing: "border-box",
});

const MainContainer = styled("div")({
  width: "100%",
  height: "100%",
  padding: "16px",
  boxSizing: "border-box",
});

const NavigationLinks = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "100%",
  gap: "0px",
});

const NavLink = styled(Button)(({ }) => ({
  textTransform: "none",
  color: "#000",
  borderBottom: "3px solid transparent",
  marginRight: "20px",
  "&.active": {
    color: "#000",
    borderBottom: "3px solid #1565c0",
  },
}));

const Content = styled("div")({
  height: "440px",
  backgroundColor: "#F9F9F9",
  boxSizing: "border-box",
  padding: "13px",
  borderRadius: "5px",
  boxShadow: "0 4px 8px #9D9D9D",
});

const TimeSheet: React.FC<ITimeSheetProps> = (props) => {
  const { absoluteURL, spHttpClient } = props;
  const [topNavigationMode, setTopNavigationMode] = useState();
  const [topNavigationState, setTopNavigationState] = useState("myData");
  const [myDataActiveLink, setMyDataActiveLink] = useState<string>("MyTimeSheet");
  const [timeLogsData, setTimeLogsData] = useState<TimeLogsData[]>([]);
  const [myTimeSheetData, setMyTimeSheetData] = useState<TimeLogsData[]>([]);
  const [projectsData, setProjectsData] = useState<ProjectsData[]>(
    projectsInitialState.projectsData
  );
  const [teamTimeSheetData, setTeamTimeSheetData] = useState<TimeLogsData[]>([]);
  const [updateStatus, setUpdateStatus] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      await getProjectListData(
        props.absoluteURL,
        props.spHttpClient,
        setProjectsData,
        props.loggedInUserDetails,
        props.isUserAdmin
      );
      await getTimeLogsListData(
        props.absoluteURL,
        props.spHttpClient,
        setTimeLogsData,
        props.loggedInUserDetails,
        "TimeSheet",
        props.isUserAdmin,
        props.isUserReportingManager
      );
      setTeamTimeSheetData(teamTimeSheetData);
      await handleTabChange("MyTimeSheet");
    };
    fetchData();
  }, []);


  const filterDataForReportingManager = (
    projectsData: any[],
    setTeamTimeSheetData: (data: any) => void
  ) => {
    
    if (props.isUserReportingManager) {
      const filteredTimeLogs = teamTimeSheetData.filter((timeLog) => {
        const project = projectsData.find(
          (project) =>
            project.ProjectId === timeLog.ProjectId &&
            JSON.parse(project.ReportingManager)?.[0]?.[0]?.secondaryText ===
            props.loggedInUserDetails.Email
        );
        return !!project;
      });
      setTeamTimeSheetData(filteredTimeLogs);
    }
  };

  const handleTabChange = async (tab: string) => {
    setMyDataActiveLink(tab);
    if (tab === "TeamTimeSheet") {
      await filterDataForReportingManager(
        projectsData,
        setTeamTimeSheetData
      );
    }
    if (tab === "MyTimeSheet") {
      let isUserAdmin = false;
      let isUserReportingManager = false;
      await getTimeLogsListData(
        props.absoluteURL,
        props.spHttpClient,
        setMyTimeSheetData,
        props.loggedInUserDetails,
        "MyTimeSheet",
        isUserReportingManager,
        isUserAdmin
      );
    }
  };

  return (
    <FullHeightGrid container>
      <FullHeightGrid
        item
        style={{ display: "flex", height: "100%", width: "100%" }}
      >
        <MainContainer>
          <TopNavigation
            setTopNavigationState={setTopNavigationState}
            setTopNavigationMode={setTopNavigationMode}
            setModuleTab={props.setModuleTab}
          />
          {topNavigationState === "myData" && (
            <Content>
              <NavigationLinks>
                <NavLink
                  className={myDataActiveLink === "MyTimeSheet" ? "active" : ""}
                  onClick={() => handleTabChange("MyTimeSheet")}
                >
                  My TimeSheet
                </NavLink>
                {props.isUserReportingManager && (
                  <NavLink
                    className={
                      myDataActiveLink === "TeamTimeSheet" ? "active" : ""
                    }
                    onClick={() => handleTabChange("TeamTimeSheet")}
                  >
                    Team TimeSheet
                  </NavLink>
                )}
              </NavigationLinks>

              {myDataActiveLink === "MyTimeSheet" && (
                <>
                  <TimeSheetTable
                    absoluteURL={props.absoluteURL}
                    spHttpClient={props.spHttpClient}
                    loggedInUserDetails={props.loggedInUserDetails}
                    timeLogsData={myTimeSheetData}
                    myDataActiveLink={myDataActiveLink}
                    TableType="MyTimeSheet"
                    setUpdateStatus = {setUpdateStatus}
                    updateStatus = {updateStatus}
                  ></TimeSheetTable>
                </>
              )}

              {myDataActiveLink === "TeamTimeSheet" && (
                <>
                  <TimeSheetTable
                    absoluteURL={props.absoluteURL}
                    spHttpClient={props.spHttpClient}
                    loggedInUserDetails={props.loggedInUserDetails}
                    timeLogsData={timeLogsData}
                    myDataActiveLink={myDataActiveLink}
                    TableType="TeamTimeSheet"
                    setUpdateStatus = {setUpdateStatus}
                    updateStatus ={updateStatus}
                  ></TimeSheetTable>
                </>
              )}


            </Content>
          )}
        </MainContainer>
      </FullHeightGrid>
    </FullHeightGrid>
  );
};

export default TimeSheet;
