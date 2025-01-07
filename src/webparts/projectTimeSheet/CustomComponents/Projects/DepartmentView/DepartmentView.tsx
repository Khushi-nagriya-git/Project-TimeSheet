import { departmentView,TableContainer, React, useEffect, TableRow , TableHead , TableCell , TableBody , Box , Table} from "../../../../..";

const DepartmentView = (props: { projectsData: any; projectProps: any; selectedProjectName: any;searchQuery: any; selectedStatusName: any; filteredProjects: any; selectedDepartmentName: any; setFilteredProjects: React.Dispatch<React.SetStateAction<any>>;}) => {
  
  useEffect(() => {
    let filteredProjects = props.projectsData;
    if (props.selectedProjectName.length > 0) {
      filteredProjects = filteredProjects.filter((project: { ProjectName: string }) =>props.selectedProjectName.includes(project.ProjectName) );
    }

    if (props.selectedStatusName.length > 0) {
      filteredProjects = filteredProjects.filter( (project: { ProjectStatus: string }) => props.selectedStatusName.includes(project.ProjectStatus));
    }

    if (props.selectedDepartmentName.length > 0) {
      filteredProjects = filteredProjects.filter( (project: { DepartmentsORTeam: string }) => props.selectedDepartmentName.includes(project.DepartmentsORTeam) );
    }

    if (props.searchQuery.trim() !== "") {
      filteredProjects = filteredProjects.filter((project: any) => {
        return (
          project.ProjectName.toLowerCase().includes(props.searchQuery.toLowerCase()) || project.ProjectStatus.toLowerCase().includes( props.searchQuery.toLowerCase()) ||project.DepartmentsORTeam.toLowerCase().includes( props.searchQuery.toLowerCase()));
      });
    }

    props.setFilteredProjects(filteredProjects);
  }, [ props.selectedProjectName,props.selectedStatusName,props.selectedDepartmentName, props.projectsData, props.searchQuery ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "#F72585";
      case "In Progress":
        return "#0077B6";
      case "Completed":
        return "#52B788";
      default:
        return "#5C6B73";
    }
  };

  return (
    <Box className={departmentView.MainBox}>
      <TableContainer>
        <Table size="small" stickyHeader aria-label="sticky table">
          <TableHead className={departmentView.tableHeadcss}>
            <TableRow>
              <TableCell className={departmentView.HeaderCell}> Project Name </TableCell>
              <TableCell className={departmentView.HeaderCell}> Department </TableCell>
              <TableCell className={departmentView.HeaderCell}> Status </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.filteredProjects.length > 0 && props.filteredProjects[0].ProjectName != '' ? (
              props.filteredProjects.map((project: any) => {
                const borderColor = getStatusColor(project.ProjectStatus);

                return (
                  <TableRow key={project.ProjectId}>
                    <TableCell>{project.ProjectName}</TableCell>
                    <TableCell>{project.DepartmentsORTeam}</TableCell>
                    <TableCell align="left" sx={{ height: "10px" }}> <Box className={departmentView.StatusColumn} sx={{ border: `2px solid ${borderColor}`}} > {project.ProjectStatus}</Box> </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9}>
                  <Box className={departmentView.noDataFound}> No data found </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default DepartmentView;
