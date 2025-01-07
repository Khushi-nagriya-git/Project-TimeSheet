import Grid from "@mui/material/Grid";
import Table from "@mui/material/Table/Table";
import TableBody from "@mui/material/TableBody/TableBody";
import TableCell from "@mui/material/TableCell/TableCell";
import TableContainer from "@mui/material/TableContainer/TableContainer";
import TableHead from "@mui/material/TableHead/TableHead";
import TableRow from "@mui/material/TableRow/TableRow";
import * as React from "react";
import Row from "./JobTableRows";
import { useState, useEffect } from "react";
import Box from "@mui/material/Box/Box";
import tableStyle from "../JobsView/JobTable.module.scss"

const JobsTable = (props: {
  projectsData: any;
  jobsProps: any;
  jobsData: any;
  mode: any;
  timeLogsData: any;
  selectedProjectName: any;
  selectedStatusName: any;
  selectedAssigneesName: any;
  searchQuery: any;
  filteredJobs: any;
  isUserProjectTeam: any;
  isUserReportingManager: any;
  isUserProjectManager: any;
  isUserAdmin: any;
  loggedInUserDetails: any;
  setMode: React.Dispatch<React.SetStateAction<any>>;
  setEditJobId: React.Dispatch<React.SetStateAction<any>>;
  setCurrentData: React.Dispatch<React.SetStateAction<any>>;
  setAddFormOpen: React.Dispatch<React.SetStateAction<any>>;
  setDrawerOpen: React.Dispatch<React.SetStateAction<any>>;
  setDeleteAlert: React.Dispatch<React.SetStateAction<any>>;
  setDeletedJobId: React.Dispatch<React.SetStateAction<any>>;
  setIsOpen: React.Dispatch<React.SetStateAction<any>>;
  setFilteredJobs: React.Dispatch<React.SetStateAction<any>>;
  setIsTimeLogAvailable: React.Dispatch<React.SetStateAction<any>>;
  setPeoplePickerDefaultTeam: React.Dispatch<React.SetStateAction<any>>;
}) => {
  useEffect(() => {
    let filteredJobs: any[] = [];

    // Admins see all jobs
    if (props.isUserAdmin) {
      filteredJobs = props.jobsData;
    } else {
      // For non-admins, start with an empty array
      filteredJobs = [];

      // Check if user is part of the project team
      // Filter jobs based on the AssignedToPeoplePicker and isUserProjectTeam
      const projectTeamJobs = props.jobsData.filter(
        (job: { AssignedToPeoplePicker: any[] }) =>
          job?.AssignedToPeoplePicker?.some(
            (person: { EMail: any }) =>
              props.loggedInUserDetails.Email === person?.EMail
          )
      );

      // If isUserProjectTeam is true or if any project team jobs were found, update filteredJobs
      if (props.isUserProjectTeam || projectTeamJobs.length > 0) {
        filteredJobs = [...filteredJobs, ...projectTeamJobs];
      }
    }

    // Filter jobs based on the ProjectManagerPeoplePicker and isProjectManager
    const projectManagerJobs = props.projectsData
      .filter(
        (project: { ProjectManagerPeoplePicker: { EMail: any } }) =>
          project?.ProjectManagerPeoplePicker?.EMail ===
          props.loggedInUserDetails.Email
      )
      .flatMap((project: { ProjectId: any }) =>
        props.jobsData.filter(
          (job: { ProjectId: any }) => job.ProjectId === project.ProjectId
        )
      );

    // If isProjectManager is true or if any reporting manager jobs were found, add them to filteredJobs
    if (props.isUserProjectManager || projectManagerJobs.length > 0) {
      filteredJobs = [...filteredJobs, ...projectManagerJobs];
    }

    // Filter jobs based on the ReportingManagerPeoplePicker and isUserReportingManager
    const reportingManagerJobs = props.projectsData
      .filter(
        (project: { ReportingManagerPeoplePicker: { EMail: any } }) =>
          project?.ReportingManagerPeoplePicker?.EMail ===
          props.loggedInUserDetails.Email
      )
      .flatMap((project: { ProjectId: any }) =>
        props.jobsData.filter(
          (job: { ProjectId: any }) => job.ProjectId === project.ProjectId
        )
      );

    // If isUserReportingManager is true or if any reporting manager jobs were found, add them to filteredJobs
    if (props.isUserReportingManager || reportingManagerJobs.length > 0) {
      filteredJobs = [...filteredJobs, ...reportingManagerJobs];
    }

    const uniqueJobIds = new Set(filteredJobs.map((job) => job.JobId));
    filteredJobs = filteredJobs.filter((job: { JobId: any }) => {
      if (uniqueJobIds.has(job.JobId)) {
        uniqueJobIds.delete(job.JobId);
        return true;
      }
      return false;
    });

    // Filter by selected project names
    if (props.selectedProjectName.length > 0) {
      filteredJobs = filteredJobs.filter((job: { ProjectName: any }) =>
        props.selectedProjectName.includes(job.ProjectName)
      );
    }

    // Filter by selected status names
    if (props.selectedStatusName.length > 0) {
      filteredJobs = filteredJobs.filter((job: { JobStatus: any }) =>
        props.selectedStatusName.includes(job.JobStatus)
      );
    }

    // Filter by selected assignees
    if (props.selectedAssigneesName.length > 0) {
      filteredJobs = filteredJobs.filter((job: { AssignedTo: string }) => {
        const assignedToArray = JSON.parse(job.AssignedTo);
        return assignedToArray.some((assignee: { id: number }) =>
          props.selectedAssigneesName.includes(assignee.id)
        );
      });
    }

    // Search query filter
    if (props.searchQuery.trim() !== "") {
      filteredJobs = filteredJobs.filter(
        (job: {
          JobName: {
            toLowerCase: () => {
              (): any;
              new (): any;
              includes: { (arg0: any): any; new (): any };
            };
          };
          JobStatus: {
            toLowerCase: () => {
               (): any;
              new (): any;
              includes: { (arg0: any): any; new (): any };
            };
          };
        }) =>
          job.JobName.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
          job.JobStatus.toLowerCase().includes(props.searchQuery.toLowerCase())
      );
    }

    // Update filtered jobs
    props.setFilteredJobs(filteredJobs);
  }, [
    props.selectedProjectName,
    props.selectedStatusName,
    props.selectedAssigneesName,
    props.jobsData,
    props.searchQuery,
    props.isUserAdmin,
    props.isUserProjectTeam,
    props.loggedInUserDetails,
  ]);

  const padZero = (num: number) => {
    return num < 10 ? "0" + num : num;
  };

  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    return `${year}-${month}-${day}`;
  };

  const handleEditIconClick = async (jobId: number) => {
    props.setMode("edit");
    props.setEditJobId(jobId);
    const job = props.jobsData.find((jobs: any) => jobs.JobId === jobId);

    let jobAssignees = job.AssignedTo ? JSON.parse(job.AssignedTo) : [];
    let emails = jobAssignees.map((member: { email: string }) => member.email);
    props.setPeoplePickerDefaultTeam(emails.length > 0 ? emails : []);

    props.setCurrentData({
      jobName: job.JobName,
      projectName: job.ProjectName,
      projectId: job.ProjectId,
      startDate: job.StartDate ? formatDate(job.StartDate) : "",
      endDate: job.EndDate ? formatDate(job.EndDate) : "",
      description: job.Description,
      billableStatus: job.BillableStatus,
      jobStatus: job.JobStatus === "In Progress" ? "InProgress" : job.JobStatus === "On Hold" ? "OnHold" : job.JobStatus === "Not Started" ? "NotStarted": job.JobStatus === "Completed" ? "Completed" : "",
      JobAssigness: jobAssignees,
      attachment: job.AttachmentFiles,
      Author:job.Author.EMail,
      
    });
    props.setAddFormOpen(true);
    props.setDrawerOpen(true);
  };

  const handleDeleteIconClick = async (jobId: number) => {
    let jobCount = 0;
    const matchingJobs = [];
    for (let i = 0; i < props.timeLogsData.length; i++) {
      if (props.timeLogsData[i].JobId === jobId) {
        jobCount++;
        matchingJobs.push(props.jobsData[i]);
      }
    }
    if (jobCount > 0) {
      props.setDeleteAlert(true);
      props.setIsTimeLogAvailable(true);
    } else {
      props.setIsOpen(true);
      props.setDeletedJobId(jobId);
      props.setIsTimeLogAvailable(false);
    }
  };

  function createData( jobId: number,jobName: string,  projectId: number,  projectName: string, startDate: Date, endDate: Date,  estimatedHours: number, loggedHours: number,status: string, assignedTo: any,Author: { EMail: string } ) {
    return { jobId, jobName, projectId,  projectName,  startDate, endDate, estimatedHours, loggedHours,  status, Author,  history: JSON.parse(assignedTo), };
  }

  return (
    <div style={{ overflowY: "auto",  height: "calc(100vh - 300px)", marginTop: "-15px" }}>
      <Grid item xs={12}>
        <div className={tableStyle.tableMainDiv}>
          <TableContainer>
            <Table size="small"aria-label="collapsible table" sx={{fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }} >
              <TableHead>

                <TableRow className={tableStyle.tableHeader}>
                  <TableCell />

                  <TableCell className={tableStyle.tableCell} sx={{ width: "20%", color:"#ffffff" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }} align="left">
                    Task Name
                  </TableCell>

                  <TableCell className={tableStyle.tableCell} sx={{ width: "20%", color:"#ffffff" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }} align="left">
                    Project
                  </TableCell>

                  <TableCell className={tableStyle.tableCell} sx={{ width: "14%", color:"#ffffff" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }} align="left">
                    Start Date
                  </TableCell>

                  <TableCell className={tableStyle.tableCell} sx={{ width: "14%", color:"#ffffff" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }} align="left" >
                    End Date
                  </TableCell>

                  <TableCell className={tableStyle.tableCell} sx={{ width: "14%", color:"#ffffff" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }} align="left">
                    Estimated Hrs
                  </TableCell>

                  <TableCell className={tableStyle.tableCell} sx={{ width: "14%", color:"#ffffff" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }}align="left" >
                    Logged Hrs
                  </TableCell>

                  <TableCell className={tableStyle.tableCell}sx={{ width: "5%", color:"#ffffff" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }}align="left" >
                    Status
                  </TableCell>

                  <TableCell className={tableStyle.tableCell}sx={{ width: "5%", color:"#ffffff" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }} align="center" >
                    Assignee(s)
                  </TableCell>

                  <TableCell className={tableStyle.tableCell}sx={{ width: "5%", color:"#ffffff" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }}align="left">
                    Actions
                  </TableCell>
                </TableRow>

              </TableHead>
              <TableBody>
                {props.filteredJobs.length > 0 ? (
                  props.filteredJobs.map((row: any) => {
                    const rowData = createData(
                      row.JobId,
                      row.JobName,
                      row.ProjectId,
                      row.ProjectName,
                      row.StartDate,
                      row.EndDate,
                      row.EstimatedHours,
                      row.loggedHours,
                      row.JobStatus,
                      row.AssignedTo,
                      row.Author
                    );

                    return (
                      <Row key={rowData.jobId} row={rowData} projectProps={props.jobsProps} handleDeleteIconClick={handleDeleteIconClick} handleEditIconClick={handleEditIconClick} loggedInUserDetails={props.loggedInUserDetails}  />
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Box className={tableStyle.NoDataText}>No data found</Box>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Grid>
    </div>
  );
};

export default JobsTable;
