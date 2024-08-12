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

const JobsTable = (props: {
  projectsData: any;
  jobsProps: any;
  jobsData: any;
  mode:any;
  timeLogsData:any;
  selectedProjectName:any;
  selectedStatusName:any;
  selectedAssigneesName:any;
  searchQuery:any;
  filteredJobs:any;
  setMode: React.Dispatch<React.SetStateAction<any>>;
  setEditJobId:React.Dispatch<React.SetStateAction<any>>;
  setCurrentData:React.Dispatch<React.SetStateAction<any>>;
  setAddFormOpen:React.Dispatch<React.SetStateAction<any>>;
  setDrawerOpen:React.Dispatch<React.SetStateAction<any>>;
  setDeleteAlert:React.Dispatch<React.SetStateAction<any>>;
  setDeletedJobId:React.Dispatch<React.SetStateAction<any>>;
  setIsOpen:React.Dispatch<React.SetStateAction<any>>;
  setFilteredJobs:React.Dispatch<React.SetStateAction<any>>;
  setIsTimeLogAvailable:React.Dispatch<React.SetStateAction<any>>;
  setPeoplePickerDefaultTeam: React.Dispatch<React.SetStateAction<any>>;
  
}) => {

  useEffect(() => {
    let filteredJobs = props.jobsData;
    if (props.selectedProjectName.length > 0) {
      filteredJobs = filteredJobs.filter((job: { ProjectName: string }) =>
        props.selectedProjectName.includes(job.ProjectName)
      );
    }

    if (props.selectedStatusName.length > 0) {
      filteredJobs = filteredJobs.filter((job: { JobStatus: string }) =>
        props.selectedStatusName.includes(job.JobStatus)
      );
    }

    if (props.selectedAssigneesName.length > 0) {
      filteredJobs = filteredJobs.filter((job: { AssignedTo: string }) => {
        const assignedToArray = JSON.parse(job.AssignedTo);
        return assignedToArray.some((assignee: { id: number }) =>
          props.selectedAssigneesName.includes(assignee.id)
        );
      });
    }
    

    if (props.searchQuery.trim() !== '') {
      filteredJobs = filteredJobs.filter((job: any) => {
        return (
          job.JobName.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
          job.JobStatus.toLowerCase().includes(props.searchQuery.toLowerCase())
        );
      });
    }

    props.setFilteredJobs(filteredJobs);
  }, [props.selectedProjectName, props.selectedStatusName, props.projectsData,props.jobsData, props.searchQuery , props.selectedAssigneesName]);

  const padZero = (num:number) => {
    return num < 10 ? '0' + num : num;
  };
  
  const formatDate = (dateString: string | number) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = padZero(date.getMonth() + 1);
    const day = padZero(date.getDate());
    return `${year}-${month}-${day}`;
  };

  const handleEditIconClick = async (jobId: number) => {
    props.setMode('edit');
    props.setEditJobId(jobId);
    const job = props.jobsData.find(
      (jobs: any) => jobs.JobId === jobId
    );
    
    let jobAssignees = job.AssignedTo ? JSON.parse(job.AssignedTo) : [];
    let emails = jobAssignees.map((member: { email: string }) => member.email);
     props.setPeoplePickerDefaultTeam(emails.length > 0 ? emails : []);

    props.setCurrentData({
      jobName: job.JobName,
      projectName: job.ProjectName,
      startDate: job.StartDate ? formatDate(job.StartDate) : '',
      endDate: job.EndDate ? formatDate(job.EndDate) : '',
      description: job.Description,
      billableStatus: job.BillableStatus , 
      jobStatus: job.JobStatus === "In Progress" ? "InProgress" : job.JobStatus === "On Hold" ? "OnHold" : job.JobStatus === "Not Started" ? "NotStarted" : job.JobStatus === "Completed" ? "Completed" :"",
      JobAssigness: jobAssignees,
      attachment: job.Attachment,
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


  function createData(
    jobId: number,
    jobName: string,
    projectId: number,
    projectName:string,
    startDate:Date,
    endDate:Date,
    estimatedHours:number,
    loggedHours:number,
    status: string,
    assignedTo:any
  ) {
    return {
      jobId,
      jobName,
      projectId,
      projectName,
      startDate,
      endDate,
      estimatedHours,
      loggedHours,
      status,
      history: JSON.parse(assignedTo),
    };
  }

  return (
    <div style={{ overflowY: 'auto', height: "285px", marginTop: "-15px" }}>
      <Grid item xs={12}>
        <div style={{ height: "100%", overflow: "auto" }}>
          <TableContainer>
            <Table size="small" aria-label="collapsible table" sx={{fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
              <TableHead>
                <TableRow sx={{ height: "40px", background: "#f3f2f1" }}>
                  <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "20%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    }}
                  >
                      Project
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "20%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    }}
                  >
                      Job Name
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "14%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    }}
                    align="left"
                  >
                    Start Date
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "14%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                      //color:"#323130",
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    }}
                    align="left"
                  >
                   End Date
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "14%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                      //color:"#323130",
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    }}
                    align="left"
                  >
                   Estimated Hours
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "14%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                     // color:"#323130",
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                    }}
                    align="left"
                  >
                  Logged Hours
                  </TableCell>
              
                    <TableCell
                      sx={{
                        padding: "4px 16px",
                        fontWeight: "600",
                        width: "5%",
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#f3f2f1",
                        zIndex: 1,
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                     // color:"#323130"
                      }}
                      align="left"
                    >
                    Status
                    </TableCell>

                    <TableCell
                      sx={{
                        padding: "4px 16px",
                        fontWeight: "600",
                        width: "5%",
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#f3f2f1",
                        zIndex: 1,
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                     // color:"#323130"
                      }}
                      align="center"
                    >
                    Assignee(s)
                    </TableCell>
                    <TableCell
                      sx={{
                        padding: "4px 16px",
                        fontWeight: "600",
                        width: "5%",
                        position: "sticky",
                        top: 0,
                        backgroundColor: "#f3f2f1",
                        zIndex: 1,
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                     // color:"#323130"
                      }}
                      align="left"
                    >
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
                      row.LoggedHours,
                      row.JobStatus,
                      row.AssignedTo
                    );

                    return (
                      
                      <Row
                        key={rowData.jobId}
                        row={rowData}
                        projectProps={props.jobsProps}
                         handleDeleteIconClick={handleDeleteIconClick}
                         handleEditIconClick={handleEditIconClick}
                        // topNavigationMode={props.topNavigationMode}
                    
                      />
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Box sx={{ textAlign: "center",fontWeight: "600",   fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
                        No data found
                      </Box>
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