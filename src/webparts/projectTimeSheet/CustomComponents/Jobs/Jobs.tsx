import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { IJobsProps } from "./IJobsProps";
import TopNavigation from "../Navigation/TopNavigation";
import JobsFiltersandSearch from "./JobsView/JobsFiltersandSearch";
import { JobsData, initialJobsData, jobsInitialState } from "./IJobsStats";
import {
  LoggedInUserDetails,
  ProjectsData,
  projectsInitialState,
} from "../Projects/IProjectStats";
import { getProjectListData } from "../Projects/Services";
import { addJobs, deleteJobs, getJobListData, updateJobRecords } from "./Services";
import JobsTable from "./JobsView/JobsTable";
import JobForm from "./Forms/JobForm";
import { JobFormData, initialState } from "./Forms/IJobFormStats";
import { TimeLogsData } from "../TimeLogs/ITimeLogsStats";
import { getTimeLogsListData } from "../TimeLogs/Services";
import DeleteDialogBox from "./DialogBoxs/DeleteDialogBox"
import { Alert, MyTeam } from "../../../..";

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

const Content = styled("div")({
  height: "440px",
  backgroundColor: "#F9F9F9",
  boxSizing: "border-box",
  padding: "13px",
  borderRadius: "5px",
  boxShadow: "0 4px 8px #9D9D9D",
});

const Jobs: React.FC<IJobsProps> = (props: IJobsProps) => {
  const [topNavigationState, setTopNavigationState] =
    useState<string>("myData");
  const [topNavigationMode, setTopNavigationMode] = useState<string>("Jobs");
  const [myDataActiveLink, setMyDataActiveLink] = useState<string>("Jobs");
  const [jobsData, setJobsData] = useState<JobsData[]>([]);
  const [projectsData, setProjectsData] = useState<ProjectsData[]>(projectsInitialState.projectsData);
  const [addFormOpen, setAddFormOpen] = useState<boolean>(false);
  const [selectedProjectName, setSelectedProjectName] = useState<string[]>([]);
  const [selectedStatusName, setSelectedStatusName] = useState<string[]>([]);
  const [selectedAssigneesName, setSelectedAssigneesName] = useState<string[]>([]);
  const [peoplePickerDefaultTeam, setPeoplePickerDefaultTeam] = useState('');
  const [teamActiveLink, setTeamActiveLink] = useState<string>("ProjectMembers");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [editJobId , setEditJobId ]= useState<number>(0);
  const [currentData, setCurrentData] = useState<JobFormData>(initialState.jobFormData);
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

  useEffect(() => {
    getProjectListData(props.absoluteURL, props.spHttpClient, setProjectsData, props.loggedInUserDetails);
    getJobListData(props.absoluteURL, props.spHttpClient, setJobsData);
    getTimeLogsListData(props.absoluteURL,props.spHttpClient,setTimeLogsData)
  }, []);

  useEffect(() => {
    let timer: number | undefined;
    if (deleteSuccessfullyAlert || addSuccessFullyAlert || editSuccessFullyAlert) {
      timer = setTimeout(() => {
        setDeleteSuccessfullyAlert(false);
        setAddSuccessFullyAlert(false);
        setEditSuccessFullyAlert(false);
        setAlert(false);
      }, 5000); 
    }
    return () => clearTimeout(timer);
  }, [deleteSuccessfullyAlert, addSuccessFullyAlert , editSuccessFullyAlert]);
  

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
      setAddSuccessFullyAlert(true);
      await getJobListData(props.absoluteURL, props.spHttpClient, setJobsData);
      await getProjectListData(props.absoluteURL, props.spHttpClient, setProjectsData,props.loggedInUserDetails);
    } else if (mode === "edit") {
      updateJobRecords(props.spHttpClient,props.absoluteURL,editJobId,data,"formEdit",setJobsData,setCurrentData)
      setAddFormOpen(false);
      setAlert(true);
      setEditSuccessFullyAlert(true);
      setCurrentData(initialState.jobFormData);
    }
    setMode("add");
  };

  const handleDelete = async () => {
    await deleteJobs(
      props.absoluteURL,
      props.spHttpClient,
      deletedJobId,
      setJobsData,
    );
    setIsOpen(false);
    setAlert(true);
    setDeleteSuccessfullyAlert(true);
  };

  return (
    <div>
      <FullHeightGrid container>
        <FullHeightGrid
          item
          style={{ display: "flex", height: "100%", width: "100%" }}
        >
          <MainContainer>
            <TopNavigation
              setTopNavigationState={setTopNavigationState}
              setTopNavigationMode={setTopNavigationMode}
              setModuleTab = {props.setModuleTab}
            />

            {topNavigationState === "myData" && (
              <Content>
                <NavigationLinks>
                  <NavLink
                    className={myDataActiveLink === "Jobs" ? "active" : ""}
                    onClick={() => handleTabChange("Jobs")}
                  >
                    {" "}
                    Jobs
                  </NavLink>
                  <Grid item sx={{ marginLeft: "auto", marginBottom: "10px" }}>
                    <Button
                      variant="contained"
                      onClick={handleAddProject}
                      sx={{
                        backgroundColor: "#1565c0",
                        borderRadius: "5px",
                        width: "120px",
                        height: "35px",
                        fontSize: "12px",
                      }}
                    >
                      Add Jobs
                    </Button>
                  </Grid>
                </NavigationLinks>
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
                    ></JobsTable>
                  </>
              </Content>
            )}

            {topNavigationState === "team" && (
              <Content>
               <MyTeam  absoluteURL = { props.absoluteURL} spHttpClient = { props.spHttpClient} projectProps={props} loggedInUserDetails={props.loggedInUserDetails} isUserReportingManager={props.isUserReportingManager}isUserAdmin={props.isUserAdmin} isUserProjectTeam={props.isUserProjectTeam} isUserProjectManager={props.isUserProjectManager}/>
              </Content>
            )}
          </MainContainer>
        </FullHeightGrid> 
      </FullHeightGrid>
      {addFormOpen && (
          <JobForm spHttpClient={props.spHttpClient} onSubmit={handleSubmit} setMode={setMode} initialData={currentData ?? undefined} absoluteURL={props.absoluteURL} context={props.context} peoplePickerDefaultTeam = {peoplePickerDefaultTeam} projectsData={projectsData} mode={mode} setAddFormOpen={setAddFormOpen} drawerOpen={drawerOpen} setDrawerOpen = {setDrawerOpen}/>
      )}
      {( isOpen || deleteAlert ) && (
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
         severity= {deleteSuccessfullyAlert ? "warning":"success"}
         onClose={function (): void {
          setDeleteSuccessfullyAlert(false)
           setEditSuccessFullyAlert(false)
           setAddSuccessFullyAlert(false)
        }}
         sx={{
           position: "fixed",
           top: "50px",
           right: "20px",
           zIndex: 9999, 
         }}
       >
        {deleteSuccessfullyAlert ?"Job has been successfully deleted!" : addSuccessFullyAlert ? "Job has been successfully added!" : editSuccessFullyAlert ? "Project has been successfully edited!" : ""}
       </Alert>
      )}
    </div>
  );
};

export default Jobs;
