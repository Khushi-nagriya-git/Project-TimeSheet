import { React,useState,useEffect,FormComponent,initialState,CustomFormData,JobsData,ProjectStyle,jobsInitialState,DeleteDialogBoxProps,IProjectProps,addProjects,getProjectListData,deleteProject,updateUserRecords,getJobListData,ProjectsData,projectsInitialState,styled,TopNavigation,Button,Grid,ProjectHeader,ProjectTable,Alert,DepartmentView,MyTeam} from "../../../../index"
import { getDepartments,  } from "./Services";
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
 
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getDepartments(props.absoluteURL, props.spHttpClient, setDepartmentNames);
        await getProjectListData(props.absoluteURL, props.spHttpClient, setProjectsData, props.loggedInUserDetails,props.isUserAdmin);
      } catch (error) {
       // console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []); 
  
  useEffect(() => {
    if (projectsData.length > 0) {
      const fetchJobData = async () => {
        try {
          await getJobListData(props.absoluteURL, props.spHttpClient, setJobsData, props.loggedInUserDetails, projectsData,props.isUserAdmin);
        } catch (error) {
          //console.log("Error fetching job data:", error);
        }
      };
      fetchJobData();
    }
  }, [projectsData]); 

  useEffect(() => {
    let timer: any;
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
      await getProjectListData(props.absoluteURL, props.spHttpClient, setProjectsData ,props.loggedInUserDetails,props.isUserAdmin);
      setAddFormOpen(false);
      setAlert(true);
      setAddSuccessFullyAlert(true);
      await  getProjectListData(props.absoluteURL, props.spHttpClient, setProjectsData,props.loggedInUserDetails,props.isUserAdmin);
    } else if (mode === "edit") {
      await updateUserRecords(props.spHttpClient,props.absoluteURL,editProjectId,data,setProjectsData,setCurrentData)
      await getProjectListData(props.absoluteURL, props.spHttpClient, setProjectsData, props.loggedInUserDetails,props.isUserAdmin);
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
    await getProjectListData(props.absoluteURL, props.spHttpClient, setProjectsData, props.loggedInUserDetails,props.isUserAdmin);
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
                  {props.isUserAdmin && (
                        <ProjectStyle.NavLink
                        className={myDataActiveLink === "Department" ? "active" : ""}
                        onClick={() => handleTabChange("Department")}
                      >
                        Departments
                      </ProjectStyle.NavLink>
                  )}
              

                    <Grid item sx={{ marginLeft: "auto", marginBottom: "10px" }}>
                    {(props.isUserReportingManager || props.isUserAdmin) && (
                    <Button
                    variant="contained"
                    onClick={handleAddProject}
                    sx={{
                      backgroundColor: "#1565c0",
                      borderRadius: "5px",
                      width: "120px",
                      height: "35px",
                      fontSize: "12px",
                      textTransform: "none",
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
                      isUserReportingManager = {props.isUserReportingManager}
                      isUserProjectManager = {props.isUserProjectManager}
                      isUserAdmin = {props.isUserAdmin}
                      isUserProjectTeam ={props.isUserProjectTeam}
                      loggedInUserDetails = {props.loggedInUserDetails}
                      ></ProjectTable>
                  </>
                )}
                {myDataActiveLink === "ProjectMembers" && (
                  <MyTeam  absoluteURL = { props.absoluteURL} spHttpClient = { props.spHttpClient} projectProps={props} isUserAdmin = {props.isUserAdmin} isUserProjectManager={props.isUserProjectManager} isUserProjectTeam={props.isUserProjectTeam} isUserReportingManager={props.isUserReportingManager} loggedInUserDetails={props.loggedInUserDetails}/>
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
