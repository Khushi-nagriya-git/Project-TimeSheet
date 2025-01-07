import { React, Box, Row, TableCell, TableBody, Table, TableContainer, TableRow, TableHead, useEffect, Grid,} from "../../../../../index";
import tableStyles from "./EmployeeView.module.scss";

const ProjectTable = (props: { projectsData: any; projectProps: any; jobsData: any; selectedProjectName: any; selectedStatusName: any; searchQuery: any; filteredProjects: any; topNavigationMode: any; selectedDepartmentName: any; isUserReportingManager: any;  isUserProjectManager: any; isUserAdmin: any; loggedInUserDetails: any; isUserProjectTeam: any; setIsJobAvailable: React.Dispatch<React.SetStateAction<any>>; setAddFormOpen: React.Dispatch<React.SetStateAction<any>>; setDeletedProjectId: React.Dispatch<React.SetStateAction<any>>; setIsOpen: React.Dispatch<React.SetStateAction<any>>; setMode: React.Dispatch<React.SetStateAction<any>>; setEditProjectId: React.Dispatch<React.SetStateAction<any>>; setDeleteAlert: React.Dispatch<React.SetStateAction<any>>; setCurrentData: React.Dispatch<React.SetStateAction<any>>; setPeoplePickerDefaultManager: React.Dispatch<React.SetStateAction<any>>; setPeoplePickerDefaultReportingManager: React.Dispatch< React.SetStateAction<any> >; setPeoplePickerDefaultTeam: React.Dispatch<React.SetStateAction<any>>;setFilteredProjects: React.Dispatch<React.SetStateAction<any>>;}) => {
 
  useEffect(() => {
    let filteredProjects = props.projectsData;
    if (props.selectedProjectName.length > 0) {
      filteredProjects = filteredProjects.filter(
        (project: { ProjectName: string }) =>
          props.selectedProjectName.includes(project.ProjectName)
      );
    }

    if (props.selectedStatusName.length > 0) {
      filteredProjects = filteredProjects.filter(
        (project: { ProjectStatus: string }) =>
          props.selectedStatusName.includes(project.ProjectStatus)
      );
    }

    if (props.selectedDepartmentName.length > 0) {
      filteredProjects = filteredProjects.filter(
        (project: { DepartmentsORTeam: string }) =>
          props.selectedDepartmentName.includes(project.DepartmentsORTeam)
      );
    }

    if (props.searchQuery.trim() !== "") {
      filteredProjects = filteredProjects.filter((project: any) => {
        return (
          project.ProjectName.toLowerCase().includes( props.searchQuery.toLowerCase() ) ||
          project.ProjectStatus.toLowerCase().includes( props.searchQuery.toLowerCase()) ||
          (project.ProjectManager && JSON.parse(project.ProjectManager).length > 0 && JSON.parse(project.ProjectManager)[0] .name.toLowerCase() .includes(props.searchQuery.toLowerCase()))
        );
      });
    }

    props.setFilteredProjects(filteredProjects);
  }, [ props.selectedProjectName, props.selectedStatusName, props.selectedDepartmentName, props.projectsData, props.searchQuery, ]);


  const handleDeleteIconClick = async (projectId: number) => {
    let jobCount = 0;
    const matchingJobs = [];
    for (let i = 0; i < props.jobsData.length; i++) {
      if (props.jobsData[i].ProjectId === projectId) {
        jobCount++;
        matchingJobs.push(props.jobsData[i]);
      }
    }
    if (jobCount > 0) {
      props.setDeleteAlert(true);
      props.setIsJobAvailable(true);
    } else {
      props.setIsOpen(true);
      props.setDeletedProjectId(projectId);
      props.setIsJobAvailable(false);
    }
  };

  const handleEditIconClick = async (projectId: number , mode:string) => {
    if(mode === "Edit"){
      props.setMode("edit");
    }else{
      props.setMode("View");
    }
    props.setEditProjectId(projectId);
    const project = props.projectsData.find( (proj: any) => proj.ProjectId === projectId );
    let projectManager = project.ProjectManager ? JSON.parse(project.ProjectManager) : [];
    let reportingManagerEmail =project.ReportingManagerPeoplePicker.EMail;
    let reportingManager = project.ReportingManager ? JSON.parse(project.ReportingManager): [];
    let projectTeam = project.ProjectTeam ? JSON.parse(project.ProjectTeam) : [];

    let emails = projectTeam.map((member: { email: string }) => member.email);
    props.setPeoplePickerDefaultManager( projectManager.length > 0 ? projectManager[0]?.email : "" );
    props.setPeoplePickerDefaultReportingManager(reportingManagerEmail);
    props.setPeoplePickerDefaultTeam(emails.length > 0 ? emails : []);

    props.setCurrentData({
      projectName: project.ProjectName,
      clientName: project.ClientName,
      projectType: project.ProjectType,
      projectHours: project.ProjectHours? project.ProjectHours : 0,
      department: project.DepartmentsORTeam,
      projectTeam: projectTeam,
      ReportingManager: reportingManager,
      projectManager: projectManager,
      projectStatus: project.ProjectStatus,
      projectCost: project.ProjectCost,
      attachment: project.AttachmentFiles && project.AttachmentFiles.length > 0 ? project.AttachmentFiles : null,
      description: project.Description,
    });
    props.setAddFormOpen(true);
  };

  function createData( projectId: number, projectName: string, projectManager: string, projectManagerEmail: string, status: string, ReportingManagerPeoplePicker: { EMail: string; Title: string }, ProjectManagerPeoplePicker: { EMail: string; Title: string } ) {
    let relevantJobs = [];
    const seenJobIds = new Set<number>(); // To track unique JobIds

    if (props.isUserAdmin) {
      for (const job of props.jobsData) {
        if (job.ProjectId === projectId && !seenJobIds.has(job.JobId)) {
          seenJobIds.add(job.JobId);
          relevantJobs.push(job);
        }
      }
    } else {
      if ( props.isUserProjectManager ||  ProjectManagerPeoplePicker?.EMail === props.loggedInUserDetails.Email ) {
        if ( ProjectManagerPeoplePicker?.EMail === props.loggedInUserDetails.Email ) {
          for (const job of props.jobsData) {
            if (job.ProjectId === projectId && !seenJobIds.has(job.JobId)) {
              seenJobIds.add(job.JobId);
              relevantJobs.push(job);
            }
          }
        }
      }

      if (props.isUserReportingManager || ReportingManagerPeoplePicker?.EMail === props.loggedInUserDetails.Email  ) {
        if ( ReportingManagerPeoplePicker?.EMail === props.loggedInUserDetails.Email ) {
          for (const job of props.jobsData) {
            if (job.ProjectId === projectId && !seenJobIds.has(job.JobId)) {
              seenJobIds.add(job.JobId);
              relevantJobs.push(job);
            }
          }
        }
      }

      // Filter jobs based on the user's email and ID in AssignedTo
      const projectTeamJobs = props.jobsData.filter(
        (job: { ProjectId: number; AssignedTo: string; JobId: number }) => {
          if (job.ProjectId !== projectId) return false;
          let jobDataFilter: { email: string; id: number }[] = [];
          try {
            jobDataFilter = JSON.parse(job.AssignedTo);
          } catch (error) {
           // console.error("Error parsing AssignedTo:", error);
            return false;
          }
          const isAssignedToUser = jobDataFilter.some((assigned) => assigned.email === props.loggedInUserDetails.Email && assigned.id === props.loggedInUserDetails.Id );
          return isAssignedToUser && !seenJobIds.has(job.JobId);
        }
      );

      // Add the relevant jobs to the set if the user is in the project team or if any relevant jobs were found
      if (props.isUserProjectTeam || projectTeamJobs.length > 0) {
        for (const job of projectTeamJobs) {
          seenJobIds.add(job.JobId);
          relevantJobs.push(job);
        }
      }
    }
    return { projectId, projectName, projectManager, projectManagerEmail, status, ReportingManagerPeoplePicker, history: relevantJobs, };
  }

  return (
    <div className={tableStyles.projectTableBox}>
      <Grid item xs={12}>
        <div className={tableStyles.ProjectTableInnerBox}>
          <TableContainer>
            <Table size="small" aria-label="collapsible table" className={tableStyles.fontFamily} >
              <TableHead>
                <TableRow className={tableStyles.ProjectTableRow}>
                  <TableCell/>
                  <TableCell className={tableStyles.ProjectTableCells} sx={{width: "13%" }} >
                      Project Id
                  </TableCell>

                  <TableCell className={tableStyles.ProjectTableCells} sx={{ width: "20%" }} align="left" >
                    Project Name
                  </TableCell>

                  <TableCell className={tableStyles.ProjectTableCells} sx={{ width: "23%" }} align="left">
                    Project Manager
                  </TableCell>

                  <TableCell className={tableStyles.ProjectTableCells} sx={{ width: "20%" }} align="left">
                    Status
                  </TableCell>

                  <TableCell className={tableStyles.ProjectTableCells} sx={{ width: "10%" }} align="left">
                    Tasks
                  </TableCell>

                  <TableCell className={tableStyles.ProjectTableCells} sx={{ width: "24%" }} align="left" >
                    {props.topNavigationMode === "Employee" &&(props.isUserAdmin || props.isUserReportingManager) &&"Actions"}
                  </TableCell>

                </TableRow>
              </TableHead>
              <TableBody>
                {props.filteredProjects.length > 0 && props.filteredProjects[0].ProjectName != '' ? (
                  props.filteredProjects.sort((a: any, b: any) => b.ProjectId - a.ProjectId).map((row: any) => {
                    let projectManagerName: any = "-";
                    let projectManagerEmail: any = "";
                    try {
                      const projectManager = row?.ProjectManager ? JSON.parse(row.ProjectManager) : [];
                      projectManagerName = projectManager.length > 0 ? projectManager[0].name : "-";
                      projectManagerEmail = projectManager.length > 0 ? projectManager[0].email : "";
                    } catch (error) {
                      projectManagerName = "-";
                    }
                    const rowData = createData(
                      row.ProjectId,
                      row.ProjectName,
                      projectManagerName,
                      projectManagerEmail,
                      row.ProjectStatus,
                      row.ReportingManagerPeoplePicker,
                      row.ProjectManagerPeoplePicker
                    );

                    return (
                      <Row key={rowData.projectId} row={rowData} projectProps={props.projectProps} handleDeleteIconClick={handleDeleteIconClick} handleEditIconClick={handleEditIconClick} topNavigationMode={props.topNavigationMode}isUserProjectManager={props.isUserProjectManager} isUserReportingManager={props.isUserReportingManager} isUserAdmin={props.isUserAdmin} isUserProjectTeam={props.isUserProjectTeam} loggedInUserDetails={props.loggedInUserDetails} />
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Box className={tableStyles.noDataMessage}>
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

export default ProjectTable;
