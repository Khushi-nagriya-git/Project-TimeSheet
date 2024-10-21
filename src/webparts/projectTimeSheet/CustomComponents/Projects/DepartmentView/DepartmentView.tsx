import { departmentView,TableContainer, React, useEffect, TableRow , TableHead , TableCell , TableBody , Box , Table} from "../../../../..";

const DepartmentView = (props: { projectsData: any; projectProps: any; selectedProjectName: any;searchQuery: any; selectedStatusName: any; filteredProjects: any; selectedDepartmentName: any; setFilteredProjects: React.Dispatch<React.SetStateAction<any>>;}) => {
  
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
    <Box sx={{height: "calc(100vh - 300px)", marginTop: "-15px", overflow: "auto", }}>
      <TableContainer>
        <Table size="small" stickyHeader aria-label="sticky table">
          <TableHead className={departmentView.tableHeadcss}>
            <TableRow>
              <TableCell sx={{ fontWeight: "600",backgroundColor: "#023E8A", height: "20px",fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",  color:"#fff", }} > Project Name </TableCell>
              <TableCell sx={{  fontWeight: "600", backgroundColor: "#023E8A", height: "20px",fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",  color:"#fff", }} > Department </TableCell>
              <TableCell sx={{ fontWeight: "600", backgroundColor: "#023E8A", height: "20px", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",  color:"#fff", }}> Status </TableCell>
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
                    <TableCell align="left" sx={{ height: "10px" }}> <Box sx={{borderRadius: "20px", border: `2px solid ${borderColor}`, height: "22px", width: "100px", display: "flex",alignItems: "center",justifyContent: "center", fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",}} > {project.ProjectStatus}</Box> </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9}>
                  <Box sx={{ textAlign: "center", fontWeight: "600", fontFamily:  "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }} > No data found </Box>
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
