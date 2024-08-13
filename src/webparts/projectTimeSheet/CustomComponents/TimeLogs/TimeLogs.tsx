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
import { Snackbar, SnackbarCloseReason } from "@mui/material";
import { Alert } from "@mui/material";
import DeleteDialogBox from "./DialogBoxs/DeleteDialogBox";
import EditTimeLog from "./AddEditTimeLog/EditTimeLog";
import { IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { updateJobRecords } from "../Jobs/Services";
import { LoggedInUserDetails } from "../Projects/IProjectStats";

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
  gap: "5px",
  width: "100%", // Ensures it takes full width of the container
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
  const [currentWeek, setCurrentWeek] = useState<Date[]>([]); // State to store the current week's dates
  const [startDate, setStartDate] = useState<Date>(new Date()); // State to manage the start date
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
 
  useEffect(() => {
    setCurrentWeek(getCurrentWeek(startDate));
  }, [startDate]);

  useEffect(() => {
    if (selectedDate) {
      setCurrentWeek(getCurrentWeek(selectedDate));
      setStartDate(selectedDate);
    }
  }, [selectedDate]);

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProjectListData(props.absoluteURL, props.spHttpClient, setProjectsData, props.loggedInUserDetails,props.isUserAdmin);
        await getJobListData(props.absoluteURL, props.spHttpClient, setJobsData, props.loggedInUserDetails, projectsData,props.isUserAdmin);
        await getTimeLogsListData(props.absoluteURL, props.spHttpClient, setTimeLogsData);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  

  useEffect(() => {
    let timer: number | undefined;
    if (deleteSuccessfullyAlert) {
      timer = setTimeout(() => {
        setDeleteSuccessfullyAlert(false);
        //setAlert(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [deleteSuccessfullyAlert]);

  const handleStartStop = async () => {
    if (isRunning) {
      // Stopping the timer
      let startTime = parseInt(localStorage.getItem("startTime") || "0", 10);
      let endTime = Date.now();
      let milliseconds = endTime - startTime;
      const LockedMinutes = Math.floor(milliseconds / 60000);
      updateRecords(
        props.spHttpClient,
        props.absoluteURL,
        "timer",
        LockedMinutes,
        setTimeLogsData,
        initialFormData,
        editTimeLogId
      );
      //   await getJobListData(props.absoluteURL, props.spHttpClient, setJobsData);
      //   let data;
      //   let timerTimeLogId = parseInt(localStorage.getItem("TimeLogId") || "0", 10);
      //   for(let i=0;i<timeLogsData.length; i++){
      //     timeLogsData[i].TimelogsId = timerTimeLogId;
      //     data = timeLogsData[i];
      //   }
      //   let updatedLoggedTime =0;
      //   for(let i=0;i<timeLogsData.length;i++){
      //     if(timeLogsData[i].JobId === data?.JobId){
      //       updatedLoggedTime += timeLogsData[i].LoggedHours
      //     }
      //   }
      //  await updateJobRecords(
      //     props.spHttpClient,
      //     props.absoluteURL,
      //     data?.JobId as number,
      //     {
      //       jobName: "",
      //       jobId: data?.JobId as number,
      //       projectName: "",
      //       projectId: undefined,
      //       startDate: undefined,
      //       endDate: undefined,
      //       JobAssigness: [],
      //       description: "",
      //       billableStatus: "",
      //       jobStatus: "",
      //       estimatedHours: 0,
      //       loggedHours: updatedLoggedTime,
      //       attachment: undefined
      //     },
      //     "loggedTimeUpdate",
      //     setJobsData,
      //     setJobsData
      //   );

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
        setStatusError("Billable status is required");
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
        setTimeLogsData
      );
      setTimerAlert(true);
    }
  };

  const jobResumeTimer = async (id: any) => {
    await getTimeLogsListData(
      props.absoluteURL,
      props.spHttpClient,
      setTimeLogsData
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
      console.log(jobTimeLogData);
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
    setIsOpen(false);
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

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setTimerAlert(false);
  };

  const handleSubmit = async (data: TimeLogsData) => {
    updateRecords(
      props.spHttpClient,
      props.absoluteURL,
      "formdata",
      0,
      setTimeLogsData,
      data,
      editTimeLogId
    );
    setEditFormOpen(false);
    // setAlert(true);
    // setEditSuccessFullyAlert(true);
    // setCurrentData(initialState.formData);
  };

  const weekStart = currentWeek[0];
  const weekEnd = currentWeek[6];
  const formatDate = (date?: Date) => {
    if (date) {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: '2-digit' 
      });
    }
    return "N/A"; // Fallback text if date is undefined
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
              setModuleTab={props.setModuleTab}
            />

            {topNavigationState === "myData" && (
              <Content>
                <NavigationLinks>
                  <NavLink
                    className={myDataActiveLink === "TimeLog" ? "active" : ""}
                    onClick={() => handleTabChange("TimeLog")}
                  >
                    TimeLogs
                  </NavLink>
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
                      alt="Calender"
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
                </NavigationLinks>

                {myDataActiveLink === "TimeLog" && (
                  <>
                    <AddTimeLog
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
                    ></AddTimeLog>
                    <TimeLogTable
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
                    ></TimeLogTable>
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

                <Snackbar
                  open={timerAlert}
                  autoHideDuration={5000}
                  onClose={handleClose}
                  anchorOrigin={{ vertical: "top", horizontal: "right" }}
                >
                  <Alert
                    onClose={handleClose}
                    severity="success"
                    sx={{ width: "100%" }}
                  >
                    Timer started
                  </Alert>
                </Snackbar>
              </Content>
            )}
          </MainContainer>
        </FullHeightGrid>
      </FullHeightGrid>
    </div>
  );
};

export default TimeLogs;
