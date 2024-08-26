import * as React from "react";
import { useState, useEffect } from "react";
import { ITimeSheetProps } from "./ITimeSheetProps";
import { styled } from "styled-components";
import { Button, Grid, IconButton } from "@mui/material";
import TopNavigation from "../Navigation/TopNavigation";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
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
  justifyContent: "space-between",
  width: "100%", // Ensures it takes the full width of the container
  gap: "10px", // Space between items
});

const NavLink = styled(Button)(({}) => ({
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

const WeekDateDisplay = styled("div")({
  display: "flex",
  alignItems: "center",
  fontSize: "14px",
  color: "rgba(0, 0, 0, 0.87)",
  fontWeight: "600",
});

const TimeSheet: React.FC<ITimeSheetProps> = (props) => {
  const { absoluteURL, spHttpClient } = props;
  const [topNavigationMode, setTopNavigationMode] = useState();
  const [topNavigationState, setTopNavigationState] = useState("myData");
  const [myDataActiveLink, setMyDataActiveLink] = useState<string>("TimeSheet");
  const [timeLogsData, setTimeLogsData] = useState<TimeLogsData[]>([]);
  const [projectsData, setProjectsData] = useState<ProjectsData[]>(projectsInitialState.projectsData);

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
      //await filterDataForReportingManager(timeLogsData,projectsData,setTimeLogsData)
    };
    fetchData();
  }, []); 

  // const filterDataForReportingManager = (
  //   timeLogsData: any[],
  //   projectsData: any[],
  //   setTimeLogsData: (data: any) => void
  // ) => {
  //   if (props.isUserReportingManager) {
  //     const filteredTimeLogs = timeLogsData.filter((timeLog) => {
  //       const project = projectsData.find(
  //         (project) =>
  //           project.ProjectTid === timeLog.projectId &&
  //           project.reportingManager?.Email === props.loggedInUserDetails.Email
  //       );
  //       return !!project;
  //     });
  
  //     setTimeLogsData(filteredTimeLogs);
  //   }
  // };
  
  

  const handleTabChange = (tab: string) => {
    setMyDataActiveLink(tab);
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
                  className={myDataActiveLink === "TimeSheet" ? "active" : ""}
                  onClick={() => handleTabChange("TimeSheet")}
                >
                  Time Sheet
                </NavLink>
              </NavigationLinks>

              {myDataActiveLink === "TimeSheet" && (
              <>
              <TimeSheetTable
              absoluteURL = {props.absoluteURL}
              spHttpClient = {props.spHttpClient}
              loggedInUserDetails = {props.loggedInUserDetails}
              setTimeLogsData = {setTimeLogsData}
              timeLogsData = {timeLogsData}
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
