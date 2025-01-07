import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { IJobsProps } from "./IJobsProps";
import JobsFiltersandSearch from "./JobsView/JobsFiltersandSearch";
import { JobsData } from "./IJobsStats";
import { ProjectsData, projectsInitialState } from "../Projects/IProjectStats";
import { getProjectListData } from "../Projects/Services";
import { addJobs,  deleteJobs,  getJobListData,  updateJobRecords,} from "./Services";
import JobsTable from "./JobsView/JobsTable";
import JobForm from "./Forms/JobForm";
import { JobFormData, initialState } from "./Forms/IJobFormStats";
import { TimeLogsData } from "../TimeLogs/ITimeLogsStats";
import { getTimeLogsListData } from "../TimeLogs/Services";
import DeleteDialogBox from "./DialogBoxs/DeleteDialogBox";
import { Alert, Box, MyTeam } from "../../../..";
import { CircularProgress } from "@mui/material";
import { Drawer, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SideNavigation from "../Navigation/SideNavigation";

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
  marginBottom: "10px",
});

const NavLink = styled(Button)(({ theme }) => ({
  textTransform: "none",
  color: "#000",
  borderBottom: "3px solid transparent",
  marginRight: "20px",
  "&.active": {
    color: "#000",
    borderBottom: "3px solid #1565c0",
  },
}));

const DrawerContainer = styled(Drawer)({
  width: 500,
  flexShrink: 0,
});

const Content = styled("div")({
  height: "calc(100vh - 143px)",
  backgroundColor: "#F9F9F9",
  boxSizing: "border-box",
  padding: "13px",
  borderRadius: "5px",
  boxShadow: "0 4px 8px #9D9D9D",
});

const Jobs: React.FC<IJobsProps> = (props: IJobsProps) => {
  const [topNavigationState, setTopNavigationState] = useState<string>("myData");
  const [myDataActiveLink, setMyDataActiveLink] = useState<string>("Jobs");
  const [jobsData, setJobsData] = useState<JobsData[]>([]);
  const [projectsData, setProjectsData] = useState<ProjectsData[]>( projectsInitialState.projectsData );
  const [addFormOpen, setAddFormOpen] = useState<boolean>(false);
  const [selectedProjectName, setSelectedProjectName] = useState<string[]>([]);
  const [selectedStatusName, setSelectedStatusName] = useState<string[]>([]);
  const [selectedAssigneesName, setSelectedAssigneesName] = useState<string[]>(  [] );
  const [peoplePickerDefaultTeam, setPeoplePickerDefaultTeam] = useState("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [editJobId, setEditJobId] = useState<number>(0);
  const [currentData, setCurrentData] = useState<JobFormData>( initialState.jobFormData );
  const [timeLogsData, setTimeLogsData] = useState<TimeLogsData[]>([]);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isTimeLogAvailable, setIsTimeLogAvailable] = useState<boolean>(false);
  const [deletedJobId, setDeletedJobId] = useState<number>(0);
  const [alert, setAlert] = useState(false);
  const [deleteSuccessfullyAlert, setDeleteSuccessfullyAlert] = useState(false);
  const [addSuccessFullyAlert, setAddSuccessFullyAlert] = useState(false);
  const [editSuccessFullyAlert, setEditSuccessFullyAlert] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState<JobsData[]>([]);
  const [loading, setLoading] = useState(true);
  const toggleDrawer = (open: boolean) => () => { setDrawerOpenNavigation(open); };
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerOpenNavigation, setDrawerOpenNavigation] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProjectListData( props.absoluteURL, props.spHttpClient,setProjectsData, props.loggedInUserDetails, props.isUserAdmin);
        await getTimeLogsListData( props.absoluteURL, props.spHttpClient, setTimeLogsData, props.loggedInUserDetails, "TimeLogs", props.isUserAdmin, props.isUserReportingManager );
      } catch (error) {
        //console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (projectsData.length > 0) {
      const fetchJobData = async () => {
        try {
          await getJobListData( props.absoluteURL, props.spHttpClient, setJobsData,  props.loggedInUserDetails, projectsData, props.isUserAdmin );
        } catch (error) {
         // console.log("Error fetching job data:", error);
        }
      };
      fetchJobData();
    }
  }, [projectsData]);

  useEffect(() => {
    let timer: any;
    if (deleteSuccessfullyAlert ||addSuccessFullyAlert || editSuccessFullyAlert) {
      timer = setTimeout(() => {
        setDeleteSuccessfullyAlert(false);
        setAddSuccessFullyAlert(false);
        setEditSuccessFullyAlert(false);
        setAlert(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [deleteSuccessfullyAlert, addSuccessFullyAlert, editSuccessFullyAlert]);

  const handleTabChange = (tab: string) => {
    setMyDataActiveLink(tab);
  };

  const handleAddProject = () => {
    setAddFormOpen(true);
    setDrawerOpen(true);
  };

  const onjobFilterChange = (jobName: string[]) => {
    setSelectedProjectName(jobName);
  };

  const onJobsStatusChange = (status: string[]) => {
    setSelectedStatusName(status);
  };

  const onJobsAssigneesChange = (status: string[]) => {
    setSelectedAssigneesName(status);
  };

  const handleSubmit = async (data: JobFormData) => {
    if (mode === "add") {
      await addJobs(data, props.absoluteURL, props.spHttpClient);
      setAddFormOpen(false);
      await getJobListData( props.absoluteURL, props.spHttpClient, setJobsData, props.loggedInUserDetails,  projectsData,  props.isUserAdmin);
      setAlert(true);
      setAddSuccessFullyAlert(true);
      await getProjectListData( props.absoluteURL, props.spHttpClient, setProjectsData, props.loggedInUserDetails, props.isUserAdmin );
    } else if (mode === "edit") {
      await updateJobRecords( props.spHttpClient,  props.absoluteURL, editJobId,  data, "formEdit", setJobsData, setCurrentData, props.loggedInUserDetails );
      setAddFormOpen(false);
      await getJobListData( props.absoluteURL,props.spHttpClient, setJobsData,  props.loggedInUserDetails, projectsData, props.isUserAdmin );
      await getProjectListData( props.absoluteURL,  props.spHttpClient, setProjectsData, props.loggedInUserDetails, props.isUserAdmin );
      setAlert(true);
      setEditSuccessFullyAlert(true);
      setCurrentData(initialState.jobFormData);
    }
    setMode("add");
  };

  const handleDelete = async () => {
    await deleteJobs(props.absoluteURL,props.spHttpClient, deletedJobId, setJobsData );
    await getJobListData( props.absoluteURL, props.spHttpClient, setJobsData,  props.loggedInUserDetails, projectsData, props.isUserAdmin );
    setIsOpen(false);
    setAlert(true);
    setDeleteSuccessfullyAlert(true);
  };

  return (
    <div>
      <FullHeightGrid container>
        <FullHeightGrid item style={{ display: "flex", height: "100%", width: "100%" }} >
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
                      open={drawerOpenNavigation}
                      onClose={toggleDrawer(false)}
                    >
                      <SideNavigation />
                    </DrawerContainer>
                  </Box>
                  <NavLink
                    className={myDataActiveLink === "Jobs" ? "active" : ""}
                    onClick={() => handleTabChange("Jobs")}
                  >
                    {" "}
                    Tasks
                  </NavLink>

                  <Grid item sx={{ marginLeft: "auto", marginBottom: "10px" }}>
                    <Button
                      variant="contained"
                      onClick={handleAddProject}
                      sx={{
                        backgroundColor: "#023E8A",
                        borderRadius: "5px",
                        width: "120px",
                        height: "35px",
                        fontSize: "14px",
                        textTransform: "none",
                      }}
                    >
                      Add Tasks
                    </Button>
                  </Grid>
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
                {!loading && (
                  <>
                    <JobsFiltersandSearch
                      projectsData={projectsData}
                      onJobFilterChange={onjobFilterChange}
                      onJobStatusChange={onJobsStatusChange}
                      onJobsAssigneesChange={onJobsAssigneesChange}
                      setSearchQuery={setSearchQuery}
                      searchQuery={searchQuery}
                      setFilteredJobs={setFilteredJobs}
                      filteredJobs={filteredJobs}
                      jobsData={jobsData}
                      isUserProjectManager={props.isUserProjectManager}
                      isUserReportingManager={props.isUserReportingManager}
                      isUserProjectTeam={props.isUserProjectTeam}
                      isUserAdmin={props.isUserAdmin}
                    ></JobsFiltersandSearch>
                    <JobsTable
                      projectsData={projectsData}
                      jobsProps={props}
                      jobsData={jobsData}
                      setMode={setMode}
                      mode={mode}
                      setEditJobId={setEditJobId}
                      setCurrentData={setCurrentData}
                      setAddFormOpen={setAddFormOpen}
                      setDeleteAlert={setDeleteAlert}
                      setDrawerOpen={setDrawerOpen}
                      setIsTimeLogAvailable={setIsTimeLogAvailable}
                      setIsOpen={setIsOpen}
                      timeLogsData={timeLogsData}
                      setDeletedJobId={setDeletedJobId}
                      setFilteredJobs={setFilteredJobs}
                      setPeoplePickerDefaultTeam={setPeoplePickerDefaultTeam}
                      selectedAssigneesName={selectedAssigneesName}
                      selectedStatusName={selectedStatusName}
                      selectedProjectName={selectedProjectName}
                      searchQuery={searchQuery}
                      filteredJobs={filteredJobs}
                      isUserProjectManager={props.isUserProjectManager}
                      isUserReportingManager={props.isUserReportingManager}
                      isUserProjectTeam={props.isUserProjectTeam}
                      isUserAdmin={props.isUserAdmin}
                      loggedInUserDetails={props.loggedInUserDetails}
                    ></JobsTable>
                  </>
                )}
              </Content>
            )}

            {topNavigationState === "team" && (
              <Content>
                <MyTeam  absoluteURL={props.absoluteURL}  spHttpClient={props.spHttpClient}  projectProps={props}  loggedInUserDetails={props.loggedInUserDetails}
                  isUserReportingManager={props.isUserReportingManager}
                  isUserAdmin={props.isUserAdmin}
                  isUserProjectTeam={props.isUserProjectTeam}
                  isUserProjectManager={props.isUserProjectManager}
                />
              </Content>
            )}
          </MainContainer>
        </FullHeightGrid>
      </FullHeightGrid>
      {addFormOpen && (
        <JobForm
          spHttpClient={props.spHttpClient}
          onSubmit={handleSubmit}
          setMode={setMode}
          initialData={currentData ?? undefined}
          loggedInUserDetails={props.loggedInUserDetails}
          absoluteURL={props.absoluteURL}
          context={props.context}
          peoplePickerDefaultTeam={peoplePickerDefaultTeam}
          projectsData={projectsData}
          mode={mode}
          setAddFormOpen={setAddFormOpen}
          drawerOpen={drawerOpen}
          setDrawerOpen={setDrawerOpen}
        />
      )}
      {(isOpen || deleteAlert) && (
        <DeleteDialogBox
          open={isOpen || deleteAlert}
          handleClose={function (): void {
            setIsOpen(false);
            setDeleteAlert(false);
          }}
          isTimeLogAvailable={isTimeLogAvailable}
          handleDeleteAction={handleDelete}
        />
      )}
      {alert && (
        <Alert
          severity={deleteSuccessfullyAlert ? "warning" : "success"}
          onClose={function (): void {
            setDeleteSuccessfullyAlert(false);
            setEditSuccessFullyAlert(false);
            setAddSuccessFullyAlert(false);
          }}
          sx={{
            position: "fixed",
            top: "50px",
            right: "20px",
            zIndex: 9999,
          }}
        >
          {deleteSuccessfullyAlert
            ? "Task has been successfully deleted!"
            : addSuccessFullyAlert
            ? "Task has been successfully added!"
            : editSuccessFullyAlert
            ? "Task has been successfully Updated!"
            : ""}
        </Alert>
      )}
    </div>
  );
};

export default Jobs;
