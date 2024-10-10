import * as React from "react";
import { useState, useEffect } from "react";
import { IProjectDashboardProps } from "./IProjectDashboardProps";
import { useEmployeeTimeSheetContext } from "../../../EmployeeTimeSheetContext";
import { useParams } from "react-router-dom";
import {
  Box,
  Label,
  ProjectStyle,
  ProjectsData,
  getJobListData,
  getProjectListData,
  projectsInitialState,
  styled,
} from "../../../../../index";
import DashBoardHeader from "./DashBoardLeftHeader";
import DashBoardBody from "./PieChart";
import PieChart from "./PieChart";
import DoughnutChart from "./DoughnutChart";
import { getTimeLogsListData } from "../../TimeLogs/Services";
import DashBoardTable from "./TeamMemberTaskStatus";
import DashBoardLeftHeader from "./DashBoardLeftHeader";
import DashBoardTopHeader from "./DashBoardTopHeader";
import BarCharts from "./BarChart";
import TeamMemberTaskStatus from "./TeamMemberTaskStatus";
import UserEstimatedVsLoggedHoursTable from "./UserEstimatedVsLoggedHoursTable";

const Content = styled("div")({
  height: "calc(100vh - 143px)",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
  padding: "10px 10px 0px 10px",
  overflowY: "scroll",
});

const ProjectDashboard = (props: IProjectDashboardProps) => {
  const { id } = useParams<{ id: string }>();

  const {
    setProjectsData,
    projectsData,
    setJobsData,
    jobsData,
    timeLogsData,
    setTimeLogsData,
  } = useEmployeeTimeSheetContext();

  let project: any;
  let lockedHours = 0;
  let totalTask = 0;
  let inProgressTask = 0;
  let completedTask = 0;
  let onHoldTask = 0;
  let notStartedTask = 0;
  let allProjects: any;
  let billableTime = 0;
  let nonBillableTime = 0;
  useEffect(() => {
    const fetchData = async () => {
      try {
        allProjects = await getProjectListData(
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
          allProjects,
          false
        );
        await getTimeLogsListData(
          props.absoluteURL,
          props.spHttpClient,
          setTimeLogsData,
          props.loggedInUserDetails,
          "dashBoard",
          props.isUserAdmin,
          false
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchData();
  }, []);

  for (let i = 0; i < projectsData.length; i++) {
    if (projectsData[i].ProjectId === parseInt(id ? id : "", 10)) {
      project = projectsData[i];
    }
  }

  // find job status for whole project
  for (let i = 0; i < jobsData.length; i++) {
    if (jobsData[i].ProjectId === project?.ProjectId) {
      lockedHours += jobsData[i].loggedHours;
      if (jobsData[i].JobStatus === "In Progress") {
        inProgressTask++;
      }
      if (jobsData[i].JobStatus === "Not Started") notStartedTask++;
      if (jobsData[i].JobStatus === "On Hold") onHoldTask++;
      if (jobsData[i].JobStatus === "Completed") completedTask++;
    }
  }

  let projectTeam: any[] = [];
  if (
    project?.ProjectTeam &&
    typeof project.ProjectTeam === "string" &&
    project.ProjectTeam.trim() !== ""
  ) {
    try {
      projectTeam = JSON.parse(project.ProjectTeam);
      projectTeam.push(project.ProjectManagerPeoplePicker);
      projectTeam.push(project.ReportingManagerPeoplePicker);
    } catch (error) {
      console.error("Error parsing project team JSON:", error);
    }
  }

  let finalData = [];

  for (let i = 0; i < projectTeam.length; i++) {
    let inProgressCount = 0;
    let holdCount = 0;
    let notStartedCount = 0;
    let completedCount = 0;
    let totalJobs = 0;
    let overDueJobs = 0;
    let calculateLoggedHours = 0;
    let calculateEstimateHours = 0;

    for (let j = 0; j < jobsData.length; j++) {
      if (project.ProjectId === jobsData[j].ProjectId) {
        for (let k = 0; k < jobsData[j].AssignedToPeoplePicker.length; k++) {
          const assignedPerson = jobsData[j].AssignedToPeoplePicker[k];
          if (
            projectTeam[i].EMail === assignedPerson.EMail ||
            projectTeam[i].email === assignedPerson.EMail
          ) {
            totalJobs++;
            const todayDate = new Date();
            const endDate = new Date(jobsData[j].EndDate.split("T")[0]);
            if (endDate < todayDate) overDueJobs++;
            if (jobsData[j].JobStatus === "Not Started") {
              notStartedCount++;
            } else if (jobsData[j].JobStatus === "In Progress") {
              inProgressCount++;
            } else if (jobsData[j].JobStatus === "Completed") {
              completedCount++;
            } else if (jobsData[j].JobStatus === "On Hold") {
              holdCount++;
            }

            // calculate estimated Hours 
            calculateLoggedHours += jobsData[j].loggedHours;
            calculateEstimateHours += jobsData[j].EstimatedHours

            break;
          }
        }
      }
    }
    // Add the final count for this team member
    finalData.push({
      Name: projectTeam[i].name ? projectTeam[i].name : projectTeam[i].Title,
      Email: projectTeam[i].email ? projectTeam[i].email : projectTeam[i].EMail,
      TotalTask: totalJobs,
      InProgress: inProgressCount,
      Hold: holdCount,
      Completed: completedCount,
      NotStarted: notStartedCount,
      OverDueJobs: overDueJobs,
      CalculateEstimateHours : calculateEstimateHours,
      CalculateLoggedHours: calculateLoggedHours
    });
  }


  for (let i = 0; i < timeLogsData.length; i++) {
    if (timeLogsData[i].ProjectId === project?.ProjectId) {
      if (timeLogsData[i].BillableStatus === "Billable") {
        billableTime += timeLogsData[i].LoggedHours;
      } else {
        nonBillableTime += timeLogsData[i].LoggedHours;
      }
    }
  }

  return (
    <React.Fragment>
      <Content>
        <Box
          sx={{
            display: "flex",
            height: "auto",
            backgroundColor: "#f8f8f9",
          }}
        >
          {/* Left Header: Takes up around 25-30% of the screen width */}
          <Box
            sx={{
              width: "20%", // Adjust this width based on your needs
              backgroundColor: "#fff",
              // padding: "10px",
              boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)", // Optional shadow for left section
            }}
          >
            <DashBoardLeftHeader project={project} context={props.context} team={(projectTeam?.length)-2} />
          </Box>

          {/* Right Content: Takes up the remaining 70-75% of the screen */}
          <Box
            sx={{
              width: "80%",
              display: "flex",
              flexDirection: "column",
              padding: "10px",
            }}
          >
            {/* Top Header */}
            <Box
              sx={{
                marginBottom: "20px",
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius:"10px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <DashBoardTopHeader />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Box
                sx={{
                  height: "100px",
                  width: "250px",
                  borderRadius: "10px",
                  backgroundColor: "#023E8A",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    color: "white",
                    fontSize: "16px",
                    fontFamily:
                      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  }}
                >
                  Status
                </Box>
                <Label style={{ fontSize: "20px", color: "white" }}>
                  {project?.ProjectStatus}
                </Label>
              </Box>

              <Box
                sx={{
                  height: "100px",
                  width: "250px",
                  borderRadius: "10px",
                  backgroundColor: "#0077B6",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    color: "white",
                    fontSize: "16px",
                    fontFamily:
                      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  }}
                >
                  Type
                </Box>
                <Label style={{ fontSize: "20px", color: "white" }}>
                  {project?.ProjectType}
                </Label>
              </Box>

              <Box
                sx={{
                  height: "100px",
                  width: "250px",
                  borderRadius: "10px",
                  backgroundColor: "#0096C7",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    color: "white",
                    fontSize: "16px",
                    fontFamily:
                      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  }}
                >
                  Cost
                </Box>
                <Label style={{ fontSize: "20px", color: "white" }}>
                  ${project?.ProjectCost}
                </Label>
              </Box>

              <Box
                sx={{
                  height: "100px",
                  width: "250px",
                  borderRadius: "10px",
                  backgroundColor: "#00B4D8",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <Box
                  sx={{
                    color: "white",
                    fontSize: "16px",
                    fontFamily:
                      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  }}
                >
                  Project Estimated Hours
                </Box>
                <Label style={{ fontSize: "20px", color: "white" }}>
                  {project?.ProjectHours}
                </Label>
              </Box>
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <BarCharts
                data={[
                  inProgressTask +
                    notStartedTask +
                    (onHoldTask + completedTask),
                  inProgressTask,
                  completedTask,
                  notStartedTask,
                  onHoldTask,
                ]}
                label={"Task Status"}
                status={["In-Progress", "Completed", "Not Started", "On Hold"]}
              ></BarCharts>

              <PieChart project={project} lockedHours={lockedHours}></PieChart>

              <DoughnutChart
                centerValue={billableTime + nonBillableTime}
                data={[billableTime, nonBillableTime]}
                label={"Billable Vs Non-Billable Hours"}
                status={["Billable", "Non-Billable"]}
                type={"Billable chart"}
              ></DoughnutChart>
            </Box>

            <Box>
              <TeamMemberTaskStatus
                data={finalData}
                context={props.context}
                columnName={[
                  "Team Member",
                  "Total Task",
                  "Not Started",
                  "In progress",
                  "Completed",
                  "On Hold",
                  "Overdue Task",
                ]}
              ></TeamMemberTaskStatus>
            </Box>
            
            <Box>
              <UserEstimatedVsLoggedHoursTable
                data={finalData}
                context={props.context}
                columnName={[
                  "Team Member",
                  "Total Task",
                  "Estimated Hours",
                  "Logged Hours",
                ]}
              ></UserEstimatedVsLoggedHoursTable>
            </Box>   

          </Box>
        </Box>

      </Content>
    </React.Fragment>
  );
};

export default ProjectDashboard;
