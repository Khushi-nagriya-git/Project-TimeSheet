import * as React from "react";
import { useState, useEffect } from "react";
import { ITimeLogsProps } from "./ITimeLogsProps";
import {
  addTimeLogs,
  deleteTimelog,
  getTimeLogsListData,
  updateRecords,
} from "./Services";
import {
  CurrentUserDetails,
  TimeLogsData,
  timeLogsDataInitialState,
} from "./ITimeLogsStats";
import {
  Button,
  Grid,
  JobsData,
  ProjectsData,
  TextField,
  TopNavigation,
  getJobListData,
  getProjectListData,
  jobsInitialState,
  projectsInitialState,
  styled,
} from "../../../..";
import AddTimeLog from "./AddEditTimeLog/AddTimeLog";
import TimeLogTable from "./TimeLogTable/TimeLogTable";
import {
  Box,
  CircularProgress,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";
import { Alert } from "@mui/material";
import DeleteDialogBox from "./DialogBoxs/DeleteDialogBox";
import EditTimeLog from "./AddEditTimeLog/EditTimeLog";
import { IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight, Pending } from "@mui/icons-material";
import { updateJobRecords } from "../Jobs/Services";
import { JobFormData, initialState } from "../Jobs/Forms/IJobFormStats";
import { Drawer } from "@mui/material";
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
const DrawerContainer = styled(Drawer)({
  width: 500,
  flexShrink: 0,
});


const NavigationLinks = styled("div")({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%", // Ensures it takes the full width of the container
  gap: "10px", // Space between items
});

const IconButtonStyled = styled(IconButton)({
  margin: "0 4px", // Margin for spacing between buttons
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

const WeekDateDisplay = styled("div")({
  display: "flex",
  alignItems: "center",
  fontSize: "14px",
  color: "rgba(0, 0, 0, 0.87)",
  fontWeight: "600",
});

const TimeLogs: React.FC<ITimeLogsProps> = (props) => {
  const { absoluteURL, spHttpClient } = props;
  const [timeLogsData, setTimeLogsData] = useState<TimeLogsData[]>([]);
  const [topNavigationMode, setTopNavigationMode] = useState();
  const [topNavigationState, setTopNavigationState] = useState("myData");
  const [myDataActiveLink, setMyDataActiveLink] = useState<string>("TimeLog");
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  const [selectedJobName, setSelectedJobName] = useState<string>("");
  const [selectedJob, setSelectedJob] = useState<string>();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [addTimeLog, setAddTimeLog] = useState<TimeLogsData>(
    timeLogsDataInitialState.timeLogsData
  );
  const [initialFormData, setInitialFormData] = useState<TimeLogsData>(
    timeLogsDataInitialState.timeLogsData
  );
  const [projectError, setProjectError] = useState("");
  const [jobError, setJobError] = useState("");
  const [statusError, setStatusError] = useState("");
  const [deleteSuccessfullyAlert, setDeleteSuccessfullyAlert] = useState(false);
  const [jobsData, setJobsData] = useState<JobsData[]>(
    jobsInitialState.jobsData
  );
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [selectedBillableStatus, setSelectedBillableStatus] =
    useState<string>();
  const [currentUserDetails, setCurrentUserDetails] =
    useState<CurrentUserDetails>();
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [timerAlert, setTimerAlert] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [deletedTimelogId, setDeletedTimelogId] = useState<number>(0);
  const [editTimeLogId, setEditTimeLogId] = useState<number>(0);
  const [editFormOpen, setEditFormOpen] = useState(false);
  const [projectsData, setProjectsData] = useState<ProjectsData[]>(
    projectsInitialState.projectsData
  );
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [updateStatus, setUpdateStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };
  const [alert, setAlert] = useState(false);
  const [addSuccessFullyAlert, setAddSuccessFullyAlert] = useState(false);
  const [editSuccessFullyAlert, setEditSuccessFullyAlert] = useState(false);
  const [timerResumeAlert, setTimerResumeAlert] = useState(false);
  const [timerStopAlert , setTimerStopAlert] = useState(false);
  const [timeLogSubmitted , setTimeLogSubmitted] = useState(false);
  const [currentData, setCurrentData] = useState<JobFormData>(initialState.jobFormData);
  

  useEffect(() => {
    setCurrentWeek(getCurrentWeek(startDate));
  }, [startDate]);

  useEffect(() => {
    if (selectedDate) {
      setCurrentWeek(getCurrentWeek(selectedDate));
      setStartDate(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    let timer: any;
    if (deleteSuccessfullyAlert || addSuccessFullyAlert || editSuccessFullyAlert) {
      timer = setTimeout(() => {
        setDeleteSuccessfullyAlert(false);
        setAddSuccessFullyAlert(false);
        setEditSuccessFullyAlert(false);
        setTimeLogSubmitted(false);
        setTimerResumeAlert(false);
        setTimerStopAlert(false);
        setAlert(false);
      }, 5000); 
    }
    return () => clearTimeout(timer);
  }, [deleteSuccessfullyAlert, addSuccessFullyAlert , editSuccessFullyAlert]);
  

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
        await getJobListData(
          props.absoluteURL,
          props.spHttpClient,
          setJobsData,
          props.loggedInUserDetails,
          projectsData,
          props.isUserAdmin
        );
        await getTimeLogsListData(
          props.absoluteURL,
          props.spHttpClient,
          setTimeLogsData,
          props.loggedInUserDetails,
          "TimeLogs",
          props.isUserAdmin,
          props.isUserReportingManager
        );
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Function to get the dates of the current week
  const getCurrentWeek = (date: Date): Date[] => {
    const startOfWeek: Date = new Date(date as unknown as string);
    startOfWeek.setDate(date.getDate() - date.getDay()); // Set to Sunday of the current week
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek as unknown as string);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };

  // Function to handle moving to the previous week
  const handlePreviousWeek = () => {
    const previousWeekStart = new Date(currentWeek[0] as unknown as string);
    previousWeekStart.setDate(currentWeek[0].getDate() - 7);
    setStartDate(previousWeekStart);
  };

  // Function to handle moving to the next week
  const handleNextWeek = () => {
    const nextWeekStart = new Date(currentWeek[0] as unknown as string);
    nextWeekStart.setDate(currentWeek[0].getDate() + 7);
    setStartDate(nextWeekStart);
  };

  // Filter timeLogsData based on the current week
  const filteredTimeLogsData = timeLogsData.filter((log) =>
    currentWeek.some(
      (date) =>
        date.toDateString() ===
        new Date(log.Created.split("T")[0]).toDateString()
    )
  );

  const handleStartStop = async () => {
    if (isRunning) {
      // Stopping the timer
      let startTime = parseInt(localStorage.getItem("startTime") || "0", 10);
      let endTime = Date.now();
      let milliseconds = endTime - startTime;
      const LockedMinutes = Math.floor(milliseconds / 60000);
      let timerTimeLogId = parseInt(localStorage.getItem("TimeLogId") || "0", 10);
      let jobId = 0;
      for(let i=0;i<timeLogsData.length;i++){
        if(timeLogsData[i].TimelogsId === timerTimeLogId){
          jobId = timeLogsData[i].JobId;
        }
      }
      
      await updateRecords(
        props.spHttpClient,
        props.absoluteURL,
        "timer",
        LockedMinutes,
        initialFormData,
        editTimeLogId,
        setUpdateStatus
      );

      await updateJobRecords(props.spHttpClient,props.absoluteURL,jobId,LockedMinutes,"loggedTimeUpdate",setJobsData,setCurrentData,props.loggedInUserDetails)

      await getTimeLogsListData(
        props.absoluteURL,
        props.spHttpClient,
        setTimeLogsData,
        props.loggedInUserDetails,
        "TimeLogs",
        props.isUserAdmin,
        props.isUserReportingManager
      );
      setAlert(true);
      setTimerStopAlert(true);

      setIsRunning(false);

      setStartTime(null);
      setElapsedTime(0);
      localStorage.removeItem("stopwatchStartTime");
      localStorage.removeItem("stopwatchIsRunning");
      localStorage.removeItem("selectedProject");
      localStorage.removeItem("selectedJobName");
      localStorage.removeItem("selectedProjectName");
      localStorage.removeItem("selectedJob");
      localStorage.removeItem("selectedBillableStatus");
      localStorage.removeItem("description");
      // Clear fields
      setSelectedProject("");
      setSelectedProjectName("");
      setSelectedJob("");
      setSelectedBillableStatus("");
      setAddTimeLog(timeLogsDataInitialState.timeLogsData);

    } else {

      // new data
      if (!selectedProject) {
        setProjectError("Project is required");
        return;
      } else {
        setProjectError("");
      }

      if (!selectedJob) {
        setJobError("Job is required");
        return;
      } else {
        setJobError("");
      }

      if (!selectedBillableStatus) {
        setStatusError("Task Type is required");
        return;
      } else {
        setStatusError("");
      }

      const now = Date.now();
      localStorage.setItem("startTime", Date.now().toString());
      setStartTime(now - elapsedTime * 1000);
      setIsRunning(true);
      localStorage.setItem(
        "stopwatchStartTime",
        (now - elapsedTime * 1000).toString()
      );
      localStorage.setItem("stopwatchIsRunning", JSON.stringify(true));

      // Save field values to localStorage
      localStorage.setItem(
        "selectedProject",
        JSON.stringify({ id: selectedProject, name: selectedProjectName })
      );
      localStorage.setItem(
        "selectedJob",
        JSON.stringify({ id: selectedJob, name: selectedJobName })
      );
      localStorage.setItem(
        "selectedBillableStatus",
        selectedBillableStatus || ""
      );
      localStorage.setItem("description", addTimeLog.Description || "");

      await addTimeLogs(
        addTimeLog,
        props.absoluteURL,
        props.spHttpClient,
        jobsData,
        setTimeLogsData
      );
      await getTimeLogsListData(
        props.absoluteURL,
        props.spHttpClient,
        setTimeLogsData,
        props.loggedInUserDetails,
        "TimeLogs",
        props.isUserAdmin,
        props.isUserReportingManager
      );
       setAlert(true);
       setAddSuccessFullyAlert(true);

    }
  };

  const jobResumeTimer = async (id: any) => {
    await getTimeLogsListData(
      props.absoluteURL,
      props.spHttpClient,
      setTimeLogsData,
      props.loggedInUserDetails,
      "TimeLogs",
      props.isUserAdmin,
      props.isUserReportingManager
    );
    const jobTimeLogData = timeLogsData.filter(
      (timelog: any) => timelog.TimelogsId === id
    )[0];

    if (jobTimeLogData) {
      const loggedMinutes = jobTimeLogData.LoggedHours;
      const now = Date.now();
      const startTime = now - loggedMinutes * 60000;
      localStorage.setItem("startTime", startTime.toString());
      localStorage.setItem("stopwatchElapsedTime", loggedMinutes.toString());
      setStartTime(startTime);
      setElapsedTime(loggedMinutes * 60);
      setIsRunning(true);
      setAlert(true);
      setTimerResumeAlert(true);
      setSelectedProject(jobTimeLogData.ProjectId as unknown as string);
      setSelectedJob(jobTimeLogData.JobId as unknown as string);
      setSelectedBillableStatus(jobTimeLogData.BillableStatus);
      setAddTimeLog({
        ...addTimeLog,
        Description: jobTimeLogData.Description,
      });
      localStorage.setItem("stopwatchIsRunning", JSON.stringify(true));
      localStorage.setItem(
        "stopwatchStartTime",
        (startTime - elapsedTime * 1000).toString()
      );
      // Save field values to localStorage
      localStorage.setItem(
        "selectedProject",
        JSON.stringify({
          id: jobTimeLogData.ProjectId,
          name: jobTimeLogData.ProjectName,
        })
      );
      localStorage.setItem(
        "selectedJob",
        JSON.stringify({
          id: jobTimeLogData.JobId,
          name: jobTimeLogData.JobName,
        })
      );
      localStorage.setItem(
        "selectedBillableStatus",
        jobTimeLogData.BillableStatus || ""
      );
      localStorage.setItem("description", jobTimeLogData.Description || "");
      
    } else {
      console.error("Job time log data not found.");
    }
  };

  const handleDelete = async () => {
    await deleteTimelog(
      props.absoluteURL,
      props.spHttpClient,
      deletedTimelogId,
      setTimeLogsData
    );
    await getTimeLogsListData(
      props.absoluteURL,
      props.spHttpClient,
      setTimeLogsData,
      props.loggedInUserDetails,
      "TimeLogs",
      props.isUserAdmin,
      props.isUserReportingManager
    );
    setIsOpen(false);
    setAlert(true);
    setDeleteSuccessfullyAlert(true);
  };

  const handleTabChange = (tab: string) => {
    setMyDataActiveLink(tab);
  };

  const onProjectChange = (projectName: string) => {
    setSelectedProjectName(projectName);
  };

  const onJobChange = (jobName: string) => {
    setSelectedJobName(jobName);
  };

  const onBillableStatusChange = (status: string) => {
    setSelectedBillableStatus(status);
  };

  const handleSubmit = async (data: TimeLogsData) => {
    await updateRecords(
      props.spHttpClient,
      props.absoluteURL,
      "formdata",
      0,
      data,
      editTimeLogId,
      setUpdateStatus
    );
    let timerTimeLogId = editTimeLogId;
    let jobId = 0;
    for(let i=0;i<timeLogsData.length;i++){
      if(timeLogsData[i].TimelogsId === timerTimeLogId){
        jobId = timeLogsData[i].JobId;
      }
    }

    await getTimeLogsListData(
      props.absoluteURL,
      props.spHttpClient,
      setTimeLogsData,
      props.loggedInUserDetails,
      "TimeLogs",
      props.isUserAdmin,
      props.isUserReportingManager
    );

    await updateJobRecords(props.spHttpClient,props.absoluteURL,jobId,data.LoggedHours,"loggedTimeUpdate",setJobsData,setCurrentData, props.loggedInUserDetails)

    setEditFormOpen(false);
     setAlert(true);
     setEditSuccessFullyAlert(true);
    // setCurrentData(initialState.formData);
  };

  const updateTimeLogStatusforApproval = async () => {
    const updatedTimeLogsData = filteredTimeLogsData.map((timeLog) => ({
      ...timeLog,
      Status: "Pending",
    }));

    await updateRecords(
      props.spHttpClient,
      props.absoluteURL,
      "updateTimeLogStatusforApproval",
      0,
      updatedTimeLogsData,
      editTimeLogId,
      setUpdateStatus
    );
    await getTimeLogsListData(
      props.absoluteURL,
      props.spHttpClient,
      setTimeLogsData,
      props.loggedInUserDetails,
      "TimeLogs",
      props.isUserAdmin,
      props.isUserReportingManager
    );
    setTimeLogSubmitted(true);
    setAlert(true);
  };

  const weekStart = currentWeek[0];
  const weekEnd = currentWeek[6];
  const formatDate = (date?: Date) => {
    if (date) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    }
    return "N/A";
  };

  return (
    <div>
      <FullHeightGrid container>
        <FullHeightGrid
          item
          style={{ display: "flex", height: "100%", width: "100%" }}
        >
          <MainContainer>

            {topNavigationState === "myData" && (
              <Content>
                <NavigationLinks>
                  <Box display="flex" alignItems="left" marginRight="10px">

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
                      <SideNavigation setModuleTab={props.setModuleTab} />
                    </DrawerContainer>
                  </Box>
                  <NavLink
                    className={myDataActiveLink === "TimeLog" ? "active" : ""}
                    onClick={() => handleTabChange("TimeLog")}
                  >
                    TimeLogs
                  </NavLink>
                  </Box>
              
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <IconButtonStyled onClick={handlePreviousWeek}>
                      <ChevronLeft />
                    </IconButtonStyled>
                    <img
                      src={require("../../assets/calendars.png")}
                      alt="Calendar"
                      style={{
                        width: "21px",
                        height: "21px",
                        marginLeft: "5px",
                      }}
                    />
                    <IconButtonStyled onClick={handleNextWeek}>
                      <ChevronRight />
                    </IconButtonStyled>
                    <WeekDateDisplay>
                      {`${formatDate(weekStart)} - ${formatDate(weekEnd)}`}
                    </WeekDateDisplay>
                  </div>
                  <Button
                    onClick={updateTimeLogStatusforApproval}
                    disabled={isRunning}
                    style={{
                      backgroundColor: "#6fbb4d",
                      color: "white",
                      width: "90px",
                      textAlign: "center",
                      height: "30px",
                      fontSize: "16px",
                      textTransform: "none",
                    }}
                  >
                    Submit
                  </Button>
                </NavigationLinks>

                {myDataActiveLink === "TimeLog" && (
                  <>
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
                        <><AddTimeLog
                        onProjectChange={onProjectChange}
                        onJobChange={onJobChange}
                        onBillableStatusChange={onBillableStatusChange}
                        setElapsedTime={setElapsedTime}
                        elapsedTime={elapsedTime}
                        isRunning={isRunning}
                        setIsRunning={setIsRunning}
                        setTimerAlert={setTimerAlert}
                        absoluteURL={absoluteURL}
                        spHttpClient={spHttpClient}
                        selectedProject={selectedProject}
                        setSelectedProject={setSelectedProject}
                        addTimeLog={addTimeLog}
                        setAddTimeLog={setAddTimeLog}
                        statusError={statusError}
                        setStatusError={setStatusError}
                        selectedJob={selectedJob}
                        projectError={projectError}
                        setSelectedJob={setSelectedJob}
                        startTime={startTime}
                        setStartTime={setStartTime}
                        jobError={jobError}
                        setSelectedJobName={setSelectedJobName}
                        handleStartStop={handleStartStop}
                        setSelectedProjectName={setSelectedProjectName}
                        selectedProjectName={selectedProjectName}
                        setSelectedBillableStatus={setSelectedBillableStatus}
                        selectedBillableStatus={selectedBillableStatus}
                        loggedInUserDetails={props.loggedInUserDetails}
                        isUserReportingManager={props.isUserReportingManager}
                        isUserProjectTeam={props.isUserProjectTeam}
                        isUserProjectManager={props.isUserProjectManager}
                        isUserAdmin={props.isUserAdmin}
                      ></AddTimeLog><TimeLogTable
                        absoluteURL={absoluteURL}
                        spHttpClient={spHttpClient}
                        timelogProps={props}
                        currentUserDetails={currentUserDetails}
                        elapsedTime={elapsedTime}
                        isRunning={isRunning}
                        timeLogsData={timeLogsData}
                        setTimeLogsData={setTimeLogsData}
                        handleStartStop={handleStartStop}
                        jobResumeTimer={jobResumeTimer}
                        setDeletedTimelogId={setDeletedTimelogId}
                        setIsOpen={setIsOpen}
                        setEditTimeLogId={setEditTimeLogId}
                        setInitialFormData={setInitialFormData}
                        setEditFormOpen={setEditFormOpen}
                        setIsRunning={setIsRunning}
                        filteredTimeLogsData={filteredTimeLogsData}
                        loggedInUserDetails={props.loggedInUserDetails}
                        isUserAdmin={props.isUserAdmin}
                        isUserReportingManager={props.isUserReportingManager}
                      ></TimeLogTable></>
                    )}
                  
                  </>
                )}
                {(isOpen || deleteAlert) && (
                  <DeleteDialogBox
                    open={isOpen || deleteAlert}
                    handleClose={function (): void {
                      setIsOpen(false);
                      setDeleteAlert(false);
                    }}
                    handleDeleteAction={handleDelete}
                  />
                )}
                {editFormOpen && (
                  <EditTimeLog
                    setEditFormOpen={setEditFormOpen}
                    onSubmit={handleSubmit}
                    open={editFormOpen}
                    projectsData={projectsData}
                    jobsData={jobsData}
                    initialFormData={initialFormData}
                    setInitialFormData={setInitialFormData}
                    loggedInUserDetails={props.loggedInUserDetails}
                    isUserReportingManager={props.isUserReportingManager}
                    isUserProjectTeam={props.isUserProjectTeam}
                    isUserProjectManager={props.isUserProjectManager}
                  />
                )}

              
{alert && (
         <Alert
         severity= {deleteSuccessfullyAlert ? "warning":"success"}
         onClose={function (): void {
          setDeleteSuccessfullyAlert(false)
           setEditSuccessFullyAlert(false)
           setAddSuccessFullyAlert(false)
           setTimeLogSubmitted(false)
           setTimerResumeAlert(false);
           setTimerStopAlert(false);
        }}
         sx={{
           position: "fixed",
           top: "50px",
           right: "20px",
           zIndex: 9999, 
         }}
       >
        {deleteSuccessfullyAlert ?"Timelog has been successfully deleted!" : addSuccessFullyAlert ? "Timelog has been successfully added and Timer started!" : editSuccessFullyAlert ? "TimeLog has been successfully Updated!" : timerStopAlert ? "Timer Stop" : timerResumeAlert ? "Timer Started": timeLogSubmitted ? "TimeLogs Submitted":""}
       </Alert>
      )}

              </Content>
            )}
          </MainContainer>
        </FullHeightGrid>
      </FullHeightGrid>
    </div>
  );
};

export default TimeLogs;
