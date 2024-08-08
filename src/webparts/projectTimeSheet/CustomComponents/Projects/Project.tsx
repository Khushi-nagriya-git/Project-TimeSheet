import { React,useState,useEffect,FormComponent,initialState,CustomFormData,JobsData,ProjectStyle,jobsInitialState,DeleteDialogBoxProps,IProjectProps,addProjects,getProjectListData,deleteProject,updateUserRecords,getJobListData,ProjectsData,projectsInitialState,styled,TopNavigation,Button,Grid,ProjectHeader,ProjectTable,Alert,DepartmentView,MyTeam} from "../../../../index"
import { LoggedInUserDetails } from "./IProjectStats";
import { getDepartments, getLoggedInUserData } from "./Services";
const Project: React.FC<IProjectProps> = (props: IProjectProps) => {
  const [mode, setMode] = useState<"add" | "edit">("add");
  const [myDataActiveLink, setMyDataActiveLink] = useState<string>("Employee");
  const [teamActiveLink, setTeamActiveLink] = useState<string>("Project");
  const [isOpen, setIsOpen] = useState(false);
  const [deleteAlert, setDeleteAlert] = useState(false);
  const [addFormOpen, setAddFormOpen] = useState(false);
  const [deletedProjectId, setDeletedProjectId] = useState<number>(0);
  const [editProjectId , setEditProjectId ]= useState<number>(0);
  const [currentData, setCurrentData] = useState<CustomFormData>(initialState.formData);
  const [projectsData, setProjectsData] = useState<ProjectsData[]>(projectsInitialState.projectsData);
  const [jobsData, setJobsData] = useState<JobsData[]>(jobsInitialState.jobsData);
  const [deleteSuccessfullyAlert, setDeleteSuccessfullyAlert] = useState(false);
  const [addSuccessFullyAlert, setAddSuccessFullyAlert] = useState(false);
  const [editSuccessFullyAlert, setEditSuccessFullyAlert] = useState(false);
  const [alert, setAlert] = useState(false);
  const [selectedProjectName, setSelectedProjectName] = useState<string[]>([]);
  const [selectedDepartmentName, setSelectedDepartmentName] = useState<string[]>([]);
  const [selectedStatusName, setSelectedStatusName] = useState<string[]>([]);
  const [peoplePickerDefaultManager, setPeoplePickerDefaultManager] = useState('');
  const [peoplePickerDefaultReportingManager, setPeoplePickerDefaultReportingManager] = useState('');
  const [peoplePickerDefaultTeam, setPeoplePickerDefaultTeam] = useState('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filteredProjects, setFilteredProjects] = useState<ProjectsData[]>(projectsInitialState.projectsData);
  const [topNavigationState, setTopNavigationState] = useState<string>("myData");
  const [topNavigationMode, setTopNavigationMode] = useState<string>("Employee");
  const [isJobAvailable, setIsJobAvailable] = useState<boolean>(false);
  const [departmentNames , setDepartmentNames] = useState();
  const [isUserReportingManager , setIsUserReportingManager] = useState<Boolean>(false);
  const [isUserProjectManager , setIsUserProjectManager] = useState<Boolean>(false);
  const [isUserAdmin , setUserAdmin] = useState<Boolean>(false);
  const [isUserProjectTeam , setIsUserProjectTeam] = useState<Boolean>(false);
  const [loggedInUserDetails ,setLoggedInUserDetails] = useState<LoggedInUserDetails>(projectsInitialState.loggedInUserDetails);

  useEffect(() => {
    const fetchData = async () => {
      await getDepartments(props.absoluteURL, props.spHttpClient, setDepartmentNames);
      let userData: LoggedInUserDetails = await getLoggedInUserData(props.spHttpClient, props.absoluteURL);
      setLoggedInUserDetails(userData || {});
      userData.Groups?.forEach((group: { Title: string }) => {
        switch (group.Title.trim()) {
          case "PTReportingManager":
            setIsUserReportingManager(true);
            break;
          case "PTProjectManager":
            setIsUserProjectManager(true);
            break;
          case "PTUsers":
            setIsUserProjectTeam(true);
            break;
            case " ProjectTimeSheetAdmin ":
              setUserAdmin(true);
            break;
          default:
            break;
        }
      });
      getProjectListData(
        props.absoluteURL,
        props.spHttpClient,
        setProjectsData,
        userData
      );
      getJobListData(props.absoluteURL, props.spHttpClient, setJobsData );
    };
  
    fetchData();
  }, []);
  

  useEffect(() => {
    let timer: number | undefined;
    if (deleteSuccessfullyAlert || addSuccessFullyAlert || editSuccessFullyAlert) {
      timer = setTimeout(() => {
        setDeleteSuccessfullyAlert(false);
        setAddSuccessFullyAlert(false);
        setEditSuccessFullyAlert(false);
        setAlert(false);
      }, 5000); 
    }
    return () => clearTimeout(timer);
  }, [deleteSuccessfullyAlert, addSuccessFullyAlert, editSuccessFullyAlert]);
  
  const handleSubmit = async (data: CustomFormData) => {
    if (mode === "add") {
      await addProjects(data, props.absoluteURL, props.spHttpClient);
      await getProjectListData(props.absoluteURL, props.spHttpClient, setProjectsData ,loggedInUserDetails);
      setAddFormOpen(false);
      setAlert(true);
      setAddSuccessFullyAlert(true);
      
      await  getProjectListData(props.absoluteURL, props.spHttpClient, setProjectsData,loggedInUserDetails);
    } else if (mode === "edit") {
      updateUserRecords(props.spHttpClient,props.absoluteURL,editProjectId,data,setProjectsData,setCurrentData)
      await getProjectListData(props.absoluteURL, props.spHttpClient, setProjectsData, loggedInUserDetails);
      setAddFormOpen(false);
      setAlert(true);
      setEditSuccessFullyAlert(true);
      setCurrentData(initialState.formData);
    }
    setMode("add");
    setCurrentData(initialState.formData);
  };

  const handleAddProject = () => {
    setAddFormOpen(true);
    setMode("add");
  };

  const handleDelete = async () => {
    await deleteProject(
      props.absoluteURL,
      props.spHttpClient,
      deletedProjectId,
      setProjectsData,
    );
    setIsOpen(false);
    setAlert(true);
    setDeleteSuccessfullyAlert(true);
  };

  const handleTabChange = (tab: string) => {
    setSelectedProjectName([]);
    setSelectedStatusName([]);
    setSelectedDepartmentName([]);
    setSearchQuery('');
    setMyDataActiveLink(tab);
    setTopNavigationMode(tab);
  };

  const onProjectFilterChange = (projectName: string[]) =>{
    setSelectedProjectName(projectName);
  };

  const onDepartmentFilterChange = (departmentName: string[]) =>{
    setSelectedDepartmentName(departmentName);
  };

  const onProjectStatusChange = (status: string[]) =>{
    setSelectedStatusName(status);
  };

  return (
    <div>
      <ProjectStyle.FullHeightGrid container>
        <ProjectStyle.FullHeightGrid
          item
          style={{ display: "flex", height: "100%", width: "100%" }}
        >
          <ProjectStyle.MainContainer>
            <TopNavigation setTopNavigationState={setTopNavigationState} setModuleTab={props.setModuleTab} setTopNavigationMode={setTopNavigationMode}/>
            {topNavigationState === "myData" && (
                <ProjectStyle.Content>
                <ProjectStyle.NavigationLinks>
                  <ProjectStyle.NavLink
                    className={myDataActiveLink === "Employee" ? "active" : ""}
                    onClick={() => handleTabChange("Employee")}
                  >
                    Projects
                  </ProjectStyle.NavLink>
                  <ProjectStyle.NavLink
                    className={myDataActiveLink === "ProjectMembers" ? "active" : ""}
                    onClick={() => handleTabChange("ProjectMembers")}
                  >
                    Project Members
                  </ProjectStyle.NavLink>
                  {isUserAdmin && (
                        <ProjectStyle.NavLink
                        className={myDataActiveLink === "Department" ? "active" : ""}
                        onClick={() => handleTabChange("Department")}
                      >
                        Departments
                      </ProjectStyle.NavLink>
                  )}
              

                    <Grid item sx={{ marginLeft: "auto", marginBottom: "10px" }}>
                    {isUserReportingManager && (
                    <Button
                    variant="contained"
                    onClick={handleAddProject}
                    sx={{
                      backgroundColor: "#1565c0",
                      borderRadius: "5px",
                      width: "120px",
                      height: "35px",
                      fontSize: "12px",
                    }}
                  >
                    Add Project
                  </Button>
                  )}
                   
                   </Grid>
                </ProjectStyle.NavigationLinks>
                {myDataActiveLink === "Employee" && (
                  <>
                    <ProjectHeader projectsData={projectsData} onProjectFilterChange = {onProjectFilterChange} onDepartmentFilterChange = {onDepartmentFilterChange}onProjectStatusChange = {onProjectStatusChange}  setSearchQuery={setSearchQuery} searchQuery={searchQuery} myDataActiveLink={myDataActiveLink}  setFilteredProjects = {setFilteredProjects} filteredProjects = {filteredProjects} departmentNames = {departmentNames}></ProjectHeader>
                    <ProjectTable
                      projectsData={projectsData}
                      selectedProjectName={selectedProjectName}
                      selectedDepartmentName={selectedDepartmentName}
                      selectedStatusName={selectedStatusName}
                      projectProps={props}
                      jobsData={jobsData}
                      setIsOpen={setIsOpen}
                      setDeletedProjectId={setDeletedProjectId}
                      setEditProjectId={setEditProjectId}
                      setDeleteAlert={setDeleteAlert}
                      setMode={setMode}
                      setAddFormOpen={setAddFormOpen}
                      setCurrentData={setCurrentData}
                      setPeoplePickerDefaultManager={setPeoplePickerDefaultManager}
                      setPeoplePickerDefaultReportingManager={setPeoplePickerDefaultReportingManager}
                      setPeoplePickerDefaultTeam={setPeoplePickerDefaultTeam}  
                      searchQuery={searchQuery}
                      setFilteredProjects = {setFilteredProjects}
                      filteredProjects = {filteredProjects}
                      topNavigationMode = {topNavigationMode}
                      setIsJobAvailable = {setIsJobAvailable}
                      isUserReportingManager = {isUserReportingManager}
                      isUserProjectManager = {isUserProjectManager}
                      isUserAdmin = {isUserAdmin}
                      isUserProjectTeam ={isUserProjectTeam}
                      loggedInUserDetails = {loggedInUserDetails}
                      ></ProjectTable>
                  </>
                )}
                {myDataActiveLink === "ProjectMembers" && (
                  <MyTeam  absoluteURL = { props.absoluteURL} spHttpClient = { props.spHttpClient} projectProps={props} isUserAdmin = {isUserAdmin} isUserProjectManager={isUserProjectManager} isUserProjectTeam={isUserProjectTeam} isUserReportingManager={isUserReportingManager} loggedInUserDetails={loggedInUserDetails}/>
                )}
                {myDataActiveLink === "Department" && (
                  <>
                    <ProjectHeader projectsData={projectsData} myDataActiveLink={myDataActiveLink} onDepartmentFilterChange = {onDepartmentFilterChange} onProjectFilterChange = {onProjectFilterChange}  onProjectStatusChange = {onProjectStatusChange}  setSearchQuery={setSearchQuery} searchQuery={searchQuery} setFilteredProjects = {setFilteredProjects} filteredProjects = {filteredProjects} departmentNames = {departmentNames}></ProjectHeader>
                    <DepartmentView projectsData={projectsData} projectProps={props} selectedProjectName={selectedProjectName} selectedDepartmentName={selectedDepartmentName} selectedStatusName={selectedStatusName}   searchQuery={searchQuery}   setFilteredProjects = {setFilteredProjects} filteredProjects = {filteredProjects}></DepartmentView>
                  </>
                )}
              </ProjectStyle.Content>
            ) }
          </ProjectStyle.MainContainer>
        </ProjectStyle.FullHeightGrid>
      </ProjectStyle.FullHeightGrid>
      {( isOpen || deleteAlert ) && (
        <DeleteDialogBoxProps
          open={isOpen || deleteAlert}
          handleClose={function (): void {
            setIsOpen(false);
            setDeleteAlert(false);
          }}
          isJobAvailable={isJobAvailable}
          handleDeleteAction={handleDelete}
        />
      )}

      {alert && (
         <Alert
         severity= {deleteSuccessfullyAlert ? "warning":"success"}
         onClose={function (): void {
          setDeleteSuccessfullyAlert(false)
          setEditSuccessFullyAlert(false)
          setAddSuccessFullyAlert(false)
        }}
         sx={{
           position: "fixed",
           top: "50px",
           right: "20px",
           zIndex: 9999, 
         }}
       >
        {deleteSuccessfullyAlert ?"Project has been successfully deleted!" : addSuccessFullyAlert ? "Project has been successfully added!" : editSuccessFullyAlert ? "Project has been successfully edited!" : ""}
       </Alert>
      )}
 
      {addFormOpen && (
        <FormComponent
          mode={mode}
          initialData={currentData ?? undefined}
          onSubmit={handleSubmit}
          spHttpClient={props.spHttpClient}
          absoluteURL={props.absoluteURL}
          context={props.context}
          open={addFormOpen}
          setAddFormOpen={setAddFormOpen}
          peoplePickerDefaultManager = {peoplePickerDefaultManager}
          peoplePickerDefaultReportingManager = {peoplePickerDefaultReportingManager}
          peoplePickerDefaultTeam = {peoplePickerDefaultTeam}
          departmentNames = {departmentNames}
        />
      )}
    </div>
  );
};

export default Project;
