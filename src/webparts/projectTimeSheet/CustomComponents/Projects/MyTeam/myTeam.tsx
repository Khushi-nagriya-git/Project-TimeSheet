import CircularProgress from "@mui/material/CircularProgress";
import {
  React,
  Dropdown,
  Box,
  IProjectProps,
  Avatar,
  IDropdownOption,
  Label,
  SearchBox,
  Grid,
  useState,
  useEffect,
  projectsInitialState,
  getProjectListData,
  getJobListData,
  jobsInitialState,
  JobsData,
} from "../../../../../index";

const MyTeam = (props: {
  spHttpClient: any;
  absoluteURL: any;
  projectProps: IProjectProps;
  isUserAdmin: any;
  isUserProjectManager: any;
  isUserProjectTeam: any;
  isUserReportingManager: any;
  loggedInUserDetails: any;
}) => {
  const [projectsData, setProjectsData] = useState<any[]>(
    projectsInitialState.projectsData
  );
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedProjectName, setSelectedProjectName] = useState<string>("");
  const [jobsData, setJobsData] = useState<JobsData[]>(
    jobsInitialState.jobsData
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredProjects, setFilteredProjects] = useState<any[]>(
    projectsInitialState.projectsData
  );
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
    try{
      getProjectListData(
        props.absoluteURL,
        props.spHttpClient,
        (data) => {
          setProjectsData(data);
  
          if (data.length > 0) {
            const firstProjectName = data[0].ProjectName;
            setSelectedProject(firstProjectName);
            setSelectedProjectName(firstProjectName);
          }
        },
        props.loggedInUserDetails,
        props.isUserAdmin
      );
      getJobListData(
        props.absoluteURL,
        props.spHttpClient,
        setJobsData,
        props.loggedInUserDetails,
        projectsData,
        props.isUserAdmin
      );
    }catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filteredProjects = projectsData;
    if (selectedProjectName) {
      filteredProjects = filteredProjects.filter(
        (project: { ProjectName: string }) =>
          project.ProjectName === selectedProjectName
      );
    }

    let finalData: any[] = [];

    filteredProjects.forEach((project) => {
      finalData.push({
        ReportingManager: [project.ReportingManager],
      });

      finalData.push({
        ProjectManager: [project.ProjectManager],
      });

      let team: any[] = [];

      try {
        team = project?.ProjectTeam ? JSON.parse(project.ProjectTeam) : [];
      } catch (error) {
        // console.error("Error parsing ProjectTeam JSON:", error);
        // Handle error, if necessary
      }

      if (Array.isArray(team)) {
        team.forEach((projectTeam) => {
          finalData.push({
            ProjectTeam: [projectTeam],
          });
        });
      }
    });

    if (searchQuery.trim() !== "") {
      finalData = finalData.filter((data: any) => {
        let name = "";
        if (data.ReportingManager) {
          try {
            const reportingManager = JSON.parse(data.ReportingManager);
            name = reportingManager[0].match(/text":"([^"]+)"/)[1];
          } catch (error) {
            // console.error("Error parsing ReportingManager JSON:", error);
          }
        } else if (data.ProjectManager) {
          try {
            const projectManager = JSON.parse(data.ProjectManager);
            name = projectManager[0].name;
          } catch (error) {
            //console.error("Error parsing ProjectManager JSON:", error);
          }
        } else if (data.ProjectTeam) {
          try {
            name = data.ProjectTeam[0].name;
          } catch (error) {
            // console.error("Error parsing ProjectTeam JSON:", error);
          }
        }

        return name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1;
      });
    }

    setFilteredProjects(finalData);
  }, [selectedProjectName, projectsData, searchQuery]);

  const onProjectFilterChange = (projectName: string) => {
    setSelectedProjectName(projectName);
  };

  const handleProjectChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    if (option) {
      const selectedValue = option.key as string;
      setSelectedProject(selectedValue);
      onProjectFilterChange(selectedValue);
    }
  };

  return (
    <React.Fragment>

{!loading && (
      <><Grid container spacing={1} alignItems="center">
          <Grid item>
            <Label style={{ fontWeight: "600" }}>Project Name</Label>
            <Dropdown
              placeholder="All"
              selectedKey={selectedProject}
              onChange={handleProjectChange}
              options={projectsData.map((project: any) => ({
                key: project.ProjectName,
                text: project.ProjectName,
                selected: selectedProject === project.ProjectName,
                checkbox: true,
              }))}
              styles={{
                root: {
                  width: 245,
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
              }} />
          </Grid>

          <Grid
            item
            sx={{
              marginLeft: "auto",
              display: "flex",
              alignItems: "center",
            }}
          >
            <SearchBox
              style={{ height: "30px" }}
              placeholder="Search by employee name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(
                (e as React.ChangeEvent<HTMLInputElement>).target.value
              )}
              onClear={() => setSearchQuery("")}
              styles={{
                root: {
                  width: 264,
                  height: 32,
                  margin: "13px 0 10px",
                  backgroundColor: "#ffffff",
                  padding: "0 5px",
                  marginBottom: "15px",
                },
                field: {
                  height: 32,
                  backgroundColor: "#ffffff",
                  padding: "0 6px",
                },
              }} />
          </Grid>
        </Grid><Box sx={{ height: "255px", overflowY: "scroll", marginTop: "-23px" }}>
            {filteredProjects.length === 0 ? (
              <Box sx={{ textAlign: "center", padding: "20px", fontWeight: "600" }}>
                No employee found
              </Box>
            ) : (
              <Grid container spacing={3}>
                {filteredProjects.map((row: any, index: number) => {
                  let title = "";
                  let name = "";
                  let cost = 0;
                  let employeeEmail = "-";

                  if (row.ReportingManager) {
                    let reportingManagerName = "-";
                    try {
                      const parsedData = typeof row.ReportingManager === "string"
                        ? JSON.parse(row.ReportingManager)
                        : row.ReportingManager;

                      if (parsedData && parsedData[0]) {
                        const match = parsedData[0].match(/text":"([^"]+)"/);
                        if (match) {
                          reportingManagerName = match[1];
                        }
                        const email = parsedData[0].match(
                          /secondaryText":"([^"]+)"/
                        );
                        if (email) {
                          employeeEmail = email[1];
                        }
                      }
                    } catch (error) {
                      // console.error("Error parsing ReportingManager JSON:", error);
                    }
                    if (reportingManagerName !== undefined &&
                      reportingManagerName !== "") {
                      title = "Reporting Manager ";
                      name = reportingManagerName;
                    }
                  } else if (row.ProjectManager) {
                    let projectManagerName = "-";
                    try {
                      const parsedData = JSON.parse(row.ProjectManager);
                      if (parsedData &&
                        parsedData[0] &&
                        parsedData[0].name !== undefined &&
                        parsedData[0].name !== "") {
                        projectManagerName = parsedData[0].name;
                        employeeEmail = parsedData[0].email;
                        cost = parsedData[0].cost;
                      }
                    } catch (error) {
                      //console.error("Error parsing ProjectManager JSON:", error);
                    }
                    if (projectManagerName !== undefined &&
                      projectManagerName !== "") {
                      title = "Project Manager";
                      name = projectManagerName;
                    }
                  } else if (row.ProjectTeam) {
                    let projectTeamName = "-";
                    try {
                      if (row.ProjectTeam &&
                        row.ProjectTeam[0] &&
                        row.ProjectTeam[0].name !== undefined &&
                        row.ProjectTeam[0].name !== "") {
                        projectTeamName = row.ProjectTeam[0].name;
                        employeeEmail = row.ProjectTeam[0].email;
                        cost = row.ProjectTeam[0].cost;
                      }
                    } catch (error) {
                      //console.error("Error parsing ProjectTeam JSON:", error);
                    }
                    if (projectTeamName !== undefined && projectTeamName !== "") {
                      title = "Project Team";
                      name = projectTeamName;
                    }
                  }

                  if (title !== "") {
                    return (
                      <Grid item key={index} xs={12} sm={6} md={3}>
                        <Box
                          sx={{
                            height: 100,
                            width: "90%",
                            backgroundColor: "#ffffff",
                            display: "flex",
                            flexDirection: "column",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            borderRadius: "5px",
                            marginTop: "0px",
                            marginLeft: "0%",
                            marginBottom: "-10px",
                            padding: "10px",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "flex-start",
                            }}
                          >
                            <Avatar
                              alt={row.projectManager}
                              src={`${props.projectProps.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?accountname=${employeeEmail}&Size=L`}
                              style={{
                                height: "60px",
                                width: "60px",
                                borderRadius: "5px",
                                marginRight: "10px",
                              }} />
                            <Box sx={{ display: "flex", flexDirection: "column" }}>
                              <Box sx={{ fontWeight: "600" }}>{name}</Box>
                              <Box>{title}</Box>
                            </Box>
                          </Box>
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                              marginTop: "15px",
                            }}
                          >
                            <Box sx={{ fontWeight: "600" }}>Rate per hour:</Box>
                            <Box sx={{ marginLeft: "5px" }}>{cost}</Box>
                          </Box>
                          {/* <Box
                            sx={{
                              display: "flex",
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Box sx={{ fontWeight: "600" }}>Weekly logged:</Box>
                            <Box sx={{ marginLeft: "5px" }}>00:00 hrs</Box>
                          </Box> */}
                        </Box>
                      </Grid>
                    );
                  } else {
                    return null; // Skip rendering if title is empty
                  }
                })}
              </Grid>
            )}
          </Box></>
        )}
     

      {loading && (
         <Box
                     sx={{
                       display: 'flex',
                       justifyContent: 'center',
                       alignItems: 'center',
                       height: '100%',
                     }}
                   >
                     <CircularProgress />
                   </Box>
      )}
     

    </React.Fragment>
  );
};

export default MyTeam;
