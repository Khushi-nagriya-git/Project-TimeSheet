import * as React from "react";
import { useState, useEffect } from "react";
import { ITimeSheetProps } from "./ITimeSheetProps";
import { styled } from "styled-components";
import { Box, Button, CircularProgress, Grid } from "@mui/material";
import TopNavigation from "../Navigation/TopNavigation";
import TimeSheetTable from "./TimeSheetTable/TimeSheetTable";
import { TimeLogsData } from "../TimeLogs/ITimeLogsStats";
import { getTimeLogsListData } from "../TimeLogs/Services";
import { getProjectListData } from "../Projects/Services";
import { ProjectsData, projectsInitialState } from "../Projects/IProjectStats";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SideNavigation from "../Navigation/SideNavigation";

const DrawerContainer = styled(Drawer)({
  width: 500,
  flexShrink: 0,
});

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
  height: "calc(100vh - 143px)",
  backgroundColor: "#F9F9F9",
  boxSizing: "border-box",
  padding: "13px",
  borderRadius: "5px",
  boxShadow: "0 4px 8px #9D9D9D",
});

const TimeSheet: React.FC<ITimeSheetProps> = (props) => {
  const [topNavigationState, setTopNavigationState] = useState("myData");
  const [myDataActiveLink, setMyDataActiveLink] =
    useState<string>("MyTimeSheet");
  const [timeLogsData, setTimeLogsData] = useState<TimeLogsData[]>([]);
  const [myTimeSheetData, setMyTimeSheetData] = useState<TimeLogsData[]>([]);
  const [projectsData, setProjectsData] = useState<ProjectsData[]>(
    projectsInitialState.projectsData
  );
  const [teamTimeSheetData, setTeamTimeSheetData] = useState<TimeLogsData[]>(
    []
  );
  const [updateStatus, setUpdateStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProjectListData(
          props.absoluteURL,
          props.spHttpClient,
          setProjectsData,
          props.loggedInUserDetails,
          props.isUserAdmin
        );
        const data = await getTimeLogsListData(
          props.absoluteURL,
          props.spHttpClient,
          setTimeLogsData,
          props.loggedInUserDetails,
          "TimeSheet",
          props.isUserAdmin,
          props.isUserReportingManager
        );
        setTeamTimeSheetData(data);
        await handleTabChange("MyTimeSheet");
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    setTeamTimeSheetData(teamTimeSheetData);
  }, [teamTimeSheetData, myDataActiveLink]);

  const filterDataForReportingManager = (
    projectsData: any[],
    setTeamTimeSheetData: (data: any) => void,
    data: TimeLogsData[]
  ) => {
    if (props.isUserReportingManager) {
      const projectIds = projectsData
        .filter(
          (project) =>
            project.ReportingManagerPeoplePicker.EMail ===
            props.loggedInUserDetails.Email
        )
        .map((project) => project.ProjectId);
      const filteredTimeLogs = data.filter((timesheet) =>
        projectIds.includes(timesheet.ProjectId)
      );
      setTeamTimeSheetData(filteredTimeLogs);
    }
  };

  const handleTabChange = async (tab: string = "TeamTimeSheet") => {
    setMyDataActiveLink(tab);
    if (tab === "TeamTimeSheet") {
      const data = await getTimeLogsListData(
        props.absoluteURL,
        props.spHttpClient,
        setTimeLogsData,
        props.loggedInUserDetails,
        "TimeSheet",
        props.isUserAdmin,
        props.isUserReportingManager
      );
      await filterDataForReportingManager(
        projectsData,
        setTeamTimeSheetData,
        data
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
    
          {topNavigationState === "myData" && (
            <Content>
              <NavigationLinks>
              <Box display="flex" alignItems="center" marginRight="10px">
                    <IconButton
                      edge="start"
                      color="inherit"
                      aria-label="menu"
                      onClick={toggleDrawer(true)}
                      sx={{ margin: 0 }}
                    >
                      <MenuIcon />
                    </IconButton>
                    <DrawerContainer
                      anchor="left"
                      open={drawerOpen}
                      onClose={toggleDrawer(false)}
                    >
                      <SideNavigation  />
                    </DrawerContainer>
                  </Box>
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
              {loading && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                >
                  <CircularProgress />
                </Box>
              )}

              {myDataActiveLink === "MyTimeSheet" && !loading && (
                <TimeSheetTable
                  absoluteURL={props.absoluteURL}
                  spHttpClient={props.spHttpClient}
                  loggedInUserDetails={props.loggedInUserDetails}
                  timeLogsData={myTimeSheetData}
                  myDataActiveLink={myDataActiveLink}
                  TableType="MyTimeSheet"
                  setUpdateStatus={setUpdateStatus}
                  updateStatus={updateStatus}
                  TimeSheetProps={props}
                  handleTabChange={handleTabChange}
                />
              )}

              {myDataActiveLink === "TeamTimeSheet" && !loading && (
                <>
                  <TimeSheetTable
                    absoluteURL={props.absoluteURL}
                    spHttpClient={props.spHttpClient}
                    loggedInUserDetails={props.loggedInUserDetails}
                    timeLogsData={teamTimeSheetData}
                    myDataActiveLink={myDataActiveLink}
                    TableType="TeamTimeSheet"
                    setUpdateStatus={setUpdateStatus}
                    updateStatus={updateStatus}
                    TimeSheetProps={props}
                    handleTabChange={handleTabChange}
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
