import { Dropdown, IDropdownOption, Label, TextField } from "@fluentui/react";
import { Box, Button, Grid } from "@mui/material";
import * as React from "react";
import { useState, useEffect } from "react";
import {
  JobsData,
  jobsInitialState,
  projectsInitialState,
  ProjectsData,
  getProjectListData,
  getJobListData,
} from "../../../../..";

const AddTimeLog = (props: {
  absoluteURL: any;
  spHttpClient: any;
  onProjectChange: any;
  onJobChange: any;
  elapsedTime: any;
  onBillableStatusChange: any;
  isRunning: any;
  selectedProject: any;
  statusError: any;
  selectedJob: any;
  projectError: any;
  startTime: any;
  jobError: any;
  handleStartStop: any;
  addTimeLog: any;
  selectedBillableStatus : any;
  isUserProjectManager:any;
  loggedInUserDetails:any;
  isUserProjectTeam:any;
  isUserReportingManager:any;
  isUserAdmin:any;
  setSelectedProjectName:React.Dispatch<React.SetStateAction<any>>;
  selectedProjectName:any;
  setSelectedJobName: React.Dispatch<React.SetStateAction<any>>;
  setStartTime: React.Dispatch<React.SetStateAction<any>>;
  setSelectedJob: React.Dispatch<React.SetStateAction<any>>;
  setStatusError: React.Dispatch<React.SetStateAction<any>>;
  setAddTimeLog: React.Dispatch<React.SetStateAction<any>>;
  setSelectedProject: React.Dispatch<React.SetStateAction<any>>;
  setTimerAlert: React.Dispatch<React.SetStateAction<any>>;
  setIsRunning: React.Dispatch<React.SetStateAction<any>>;
  setElapsedTime: React.Dispatch<React.SetStateAction<any>>;
  setSelectedBillableStatus: React.Dispatch<React.SetStateAction<any>>;
}) => {
  
  const statusOptions = ["Billable", "Non Billable"];
  const [projectsData, setProjectsData] = useState<ProjectsData[]>(
    projectsInitialState.projectsData
  );
  const [jobsData, setJobsData] = useState<JobsData[]>(
    jobsInitialState.jobsData
  );
  const [filterJobs, setFilteredJobs] = useState<JobsData[]>(
    jobsInitialState.jobsData
  );

  useEffect(() => {
    const savedStartTime = localStorage.getItem("stopwatchStartTime");
    const savedElapsedTime = localStorage.getItem("stopwatchElapsedTime");
    const savedIsRunning = localStorage.getItem("stopwatchIsRunning");
    const savedProject = localStorage.getItem("selectedProject");
    const savedJob = localStorage.getItem("selectedJob");
    const savedBillableStatus = localStorage.getItem("selectedBillableStatus");
    const savedDescription = localStorage.getItem("description");

    if (savedStartTime && savedElapsedTime && savedIsRunning) {
        props.setStartTime(Number(savedStartTime));
        props.setElapsedTime(Number(savedElapsedTime));
        props.setIsRunning(JSON.parse(savedIsRunning));
    }

    if (savedProject) {
        const project = JSON.parse(savedProject);
        props.setSelectedProject(project.id);
        props.setSelectedProjectName(project.name);
    }

    if (savedJob) {
        const job = JSON.parse(savedJob);
        props.setSelectedJob(job.id);
        props.setSelectedJobName(job.name);
    }

    if (savedBillableStatus) {
       props. setSelectedBillableStatus(savedBillableStatus);
    }

    if (savedDescription) {
        props.setAddTimeLog((prev: any) => ({ ...prev, Description: savedDescription }));
    }
}, []);


  useEffect(() => {
    let interval: number | undefined;
    if (props.isRunning && props.startTime !== null) {
      interval = setInterval(() => {
        const now = Date.now();
        props.setElapsedTime(Math.floor((now - props.startTime) / 1000));
      }, 1000);
    } else if (!props.isRunning && props.startTime !== null) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [props.isRunning, props.startTime]);

  useEffect(() => {
    localStorage.setItem("stopwatchElapsedTime", props.elapsedTime.toString());
    localStorage.setItem("stopwatchIsRunning", JSON.stringify(props.isRunning));
  }, [props.elapsedTime, props.isRunning]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProjectListData(props.absoluteURL, props.spHttpClient, setProjectsData, props.loggedInUserDetails,props.isUserAdmin);
        await getJobListData(props.absoluteURL, props.spHttpClient, setJobsData, props.loggedInUserDetails, projectsData,props.isUserAdmin);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);
  

  useEffect(() => {
    if (props.selectedProject) {
      const filtered = jobsData.filter(
        (job) => job.ProjectId === props.selectedProject
      );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(jobsData);
    }
  }, [props.selectedProject, jobsData]);

  const handleProjectChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (option) {
      const selectedValue = option.key as string;
      props.setSelectedProject(selectedValue);
      props.setSelectedProjectName(option.text);
      props.onProjectChange(selectedValue);
      props.setAddTimeLog({
        ...props.addTimeLog,
        ProjectId: option.key as number,
        ProjectName: option.text,
      });
    }
  };

  const handleJobChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (option) {
      const selectedValue = option.key as string;
      props.setSelectedJob(selectedValue);
      props.onJobChange(selectedValue);
      props.setAddTimeLog({
        ...props.addTimeLog,
        JobId: option.key as number,
        JobName: option.text,
      });
    }
  };

  const handleBillableStatusChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    if (option) {
      const selectedValue = option.key as string;
      props.setSelectedBillableStatus(selectedValue);
      props.onBillableStatusChange(selectedValue);
      props.setAddTimeLog({
        ...props.addTimeLog,
        BillableStatus: option.text as string,
      });
    }
  };

  const handleChange = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    const { name, value } = ev.currentTarget;
    props.setAddTimeLog({
      ...props.addTimeLog,
      Description: value,
    });
  };
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSecs = secs < 10 ? `0${secs}` : `${secs}`;
    return `${formattedHours}:${formattedMinutes}:${formattedSecs}`;
  };

  return (
    <div>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
      >
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <Label style={{ fontWeight: "600" }}>Projects</Label>
            <Dropdown
              placeholder="Select Project"
              selectedKey={props.selectedProject}
              onChange={handleProjectChange}
              disabled={props.isRunning}
              errorMessage={props.projectError}
              options={projectsData.map((project) => ({
                key: project.ProjectId,
                text: project.ProjectName,
              }))}
              styles={{
                root: {
                  width: 200,
                  height: 60,
                  marginBottom: 5,
                  borderWidth: 2,
                },
                title: {
                  textAlign: "left",
                  lineHeight: "25px",
                },
                dropdownItemsWrapper: {
                  maxHeight: 200,
                },
                dropdownItem: {
                  height: 35,
                  borderRadius: 5,
                  width: 200,
                  backgroundColor: "#ffffff",
                },
              }}
            />
          </Grid>

          <Grid item>
            <Label style={{ fontWeight: "600" }}>Jobs</Label>
            <Dropdown
              placeholder="Select Job"
              selectedKey={props.selectedJob}
              onChange={handleJobChange}
              disabled={props.isRunning}
              errorMessage={props.jobError}
              options={filterJobs.map((job) => ({
                key: job.JobId,
                text: job.JobName,
              }))}
              styles={{
                root: {
                  width: 200,
                  height: 60,
                  marginBottom: 5,
                  borderWidth: 2,
                },
                title: {
                  textAlign: "left",
                  lineHeight: "25px",
                },
                dropdownItemsWrapper: {
                  maxHeight: 200,
                },
                dropdownItem: {
                  height: 35,
                  borderRadius: 5,
                  width: 200,
                  backgroundColor: "#ffffff",
                },
              }}
            />
          </Grid>

          <Grid item>
            <Label style={{ fontWeight: "600" }}>Billable Status</Label>
            <Dropdown
              placeholder="Select billable status"
              selectedKey={props.selectedBillableStatus}
              onChange={handleBillableStatusChange}
              disabled={props.isRunning}
              errorMessage={props.statusError}
              options={statusOptions.map((status) => ({
                key: status,
                text: status,
              }))}
              styles={{
                root: {
                  width: 200,
                  height: 60,
                  marginBottom: 5,
                  borderWidth: 2,
                },
                title: {
                  textAlign: "left",
                  lineHeight: "25px",
                },
                dropdownItemsWrapper: {
                  maxHeight: 200,
                },
                dropdownItem: {
                  height: 35,
                  borderRadius: 5,
                  width: 200,
                  backgroundColor: "#ffffff",
                },
              }}
            />
          </Grid>

          <Grid item sx={{ marginBottom: "33px" }}>
            <Label style={{ fontWeight: "600" }}>Description</Label>
            <TextField
              name="Description"
              placeholder="What are you working on ?"
              style={{ width: "350px" }}
              onChange={handleChange}
              value={props.addTimeLog.Description}
              disabled={props.isRunning}
            />
          </Grid>
        </Grid>
        <Box>
          <Label style={{ fontWeight: "600" }}>
            {props.isRunning ? "Stop Timer" : "Start Timer"}
          </Label>
          <Button
            onClick={props.handleStartStop}
            style={{
              backgroundColor: props.isRunning ? "red" : "#1565c0",
              color: "white",
              width: "90px",
              textAlign: "center",
              height: "30px",
              fontSize: "16px",
              marginBottom: "30px",
            }}
          >
            {props.isRunning ? formatTime(props.elapsedTime) : "00:00:00"}
          </Button>
        </Box>
      </Box>
    </div>
  );
};

export default AddTimeLog;
