import Tooltip from "@mui/material/Tooltip";
import { React, useState,  useEffect,  FormEvent,  Box,  Drawer,  CloseIcon,  PeoplePicker, PrincipalType, IFormProps, IconButton, CustomFormData, ProjectManager, initialState, TextField, Dropdown, Label, IDropdownOption, DefaultButton,  PrimaryButton,} from "../../../../../index";
import formStyles from "./Form.module.scss";

const drawerStyle = {
  width: "700px",
  height: "auto",
  display: "flex",
  flexDirection: "column" as "column",
  justifyContent: "flex-start",
  alignItems: "center",
  backgroundColor: "white",
  borderRadius: "8px",
  margin: "60px 0 0 0",
};

const FormComponent: React.FC<IFormProps> = (props: any) => {
  const { setAddFormOpen } = props;
  const [selectedOptionKey, setSelectedOptionKey] = useState<any>("");
  const [selectedDepartment, setSelectedDepartment] = useState<any>("");
  const [statusSelectedOptionKey, setStatusSelectedOptionKey] = useState<any>("notStarted");
  const [formData, setFormData] = useState<CustomFormData>( initialState.formData);
  const [reportingManagerRequiredMessageShow , setReportingManagerRequiredMessageShow] = useState<boolean>(false);
  const [projectManagerRequiredMessageShow , setProjectManagerRequiredMessageShow] = useState<boolean>(false);
  const [projectTeamMessageShow , setProjectTeamMessageShow] = useState<boolean>(false);
  const [showCostFields, setShowCostFields] = useState(false);
  const [attachments, setAttachments] = useState(props.initialData.attachment || []);
  const [showCostFieldsForProjectTeam, setShowCostFieldsForProjectTeam] =useState(false);
  const options: IDropdownOption[] = [ { key: "fixedCost", text: "Fixed Cost" }, { key: "resourceBased", text: "Resource Based" },];

  const projectStatus: IDropdownOption[] = [
    { key: "notStarted", text: "Not Started" },
    { key: "inProgress", text: "In Progress" },
    { key: "completed", text: "Completed" },
    { key: "onHold", text: "On Hold" },
  ];

  const departments: IDropdownOption[] = props.departmentNames?.map(
    (department: any) => ({
      key: department.DepartmentName,
      text: department.DepartmentName,
    })
  );

  useEffect(() => {
    if (props.mode === "edit" || props.mode === "View" && props.initialData) {
      setFormData(props.initialData);
      formData.projectTeam = props.initialData.projectTeam;
      formData.projectManager = props.initialData.projectManager;
      if (props.initialData.projectType === "Fixed Cost") {
        setSelectedOptionKey("fixedCost");
      }
      if (props.initialData.projectType === "Resource Based") {
        setSelectedOptionKey("resourceBased");
        setShowCostFieldsForProjectTeam(true);
        setShowCostFields(true);
      }
      if (props.initialData.projectStatus === "Not Started") {
        setStatusSelectedOptionKey("notStarted");
      }
      if (props.initialData.projectStatus === "In Progress") {
        setStatusSelectedOptionKey("inProgress");
      }
      if (props.initialData.projectStatus === "Completed") {
        setStatusSelectedOptionKey("completed");
      }
      if (props.initialData.projectStatus === "On Hold") {
        setStatusSelectedOptionKey("onHold");
      }
      setSelectedDepartment(props.initialData.department);
    }
  }, [props.mode, props.initialData]);

  useEffect(() => {
    if (!showCostFields) {
      const updatedProjectManagers = formData.projectManager.map((manager) => ({
        ...manager,
        cost:  props.mode === "edit" || props.mode === "View" && props.initialData.projectType === "Resource Based" ? manager.cost : 0,
      }));
      setFormData((prevState) => ({
        ...prevState,
        projectManager: updatedProjectManagers,
      }));
    }

    if (!showCostFieldsForProjectTeam) {
      const updatedProjectTeam = formData.projectTeam.map((teamMember) => ({
        ...teamMember,
        cost: props.mode === "edit" || props.mode === "View" && props.initialData.projectType === "Resource Based" ? teamMember.cost : 0,
      }));
      setFormData((prevState) => ({
        ...prevState,
        projectTeam: updatedProjectTeam,
      }));
    }
  }, [showCostFields, showCostFieldsForProjectTeam]);

  const handleChange = ( ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    const { name, value } = ev.currentTarget;
    if (name === "projectHours" && Number(value) < 0) {
      return;
    }
    if (name === "projectCost" && Number(value) < 0) {
      return;
    }
    
    setFormData({
      ...formData,
      [name]: name === "projectCost" || name === "projectHours" ? Number(value) : value,
    });
  };

  const handleChangeDropDown = (   ev: React.FormEvent<HTMLDivElement>,   option?: IDropdownOption ) => {
    const selectedValue = option?.text as string;
    setSelectedOptionKey(option?.key);
    if (selectedValue === "Resource Based") {
      setShowCostFields(true);
      setShowCostFieldsForProjectTeam(true);
    } else {
      setShowCostFields(false);
      setShowCostFieldsForProjectTeam(false);
    }

    setFormData({
      ...formData,
      projectType: selectedValue,
      projectStatus: "Not Started",
    });
  };

  const handleChangeDepartmentDropDown = (  ev: React.FormEvent<HTMLDivElement>,  option?: IDropdownOption ) => {
    const selectedValue = option?.text as string;
    setSelectedDepartment(option?.key);

    setFormData({
      ...formData,
      department: selectedValue,
    });
  };

  const handleChangeStatusDropDown = ( ev: React.FormEvent<HTMLDivElement>, option?: IDropdownOption ) => {
    const selectedValue = option?.text as string;
    setStatusSelectedOptionKey(option?.key);
    setFormData({
      ...formData,
      projectStatus: selectedValue,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => { e.preventDefault();
    if (!formData.ReportingManager || formData.ReportingManagerPeoplePicker === '') {
      setReportingManagerRequiredMessageShow(true); 
      return; 
    }
    if (!formData.projectManager || formData.ProjectManagerPeoplePicker === '') {
      setProjectManagerRequiredMessageShow(true); 
      return; 
    }
    if(!formData.projectTeam || formData.ProjectTeamPeoplePicker === ''){
      setProjectTeamMessageShow(true);
      return;
    }
    props.onSubmit(formData);
    setAttachments([]);
  };

  const getPeoplePickerReportingManager = (items: any[]) => {
    if (items && items.length > 0) {
      setReportingManagerRequiredMessageShow(false);
      setFormData({
        ...formData,
        ReportingManager: items[0],
        ReportingManagerPeoplePicker: items,
      });
    } else {
      setReportingManagerRequiredMessageShow(true);
      setFormData({
        ...formData,
        ReportingManager: [],
        ReportingManagerPeoplePicker: [],
      });
    }
  };

  const getPeoplePickerProjectManager = (items: any[]) => {
    if (items && items.length > 0) {
      setProjectManagerRequiredMessageShow(false);
      const updatedProjectManagers: ProjectManager[] = items.map((item) => ({
        name: item.text,
        email: item.loginName.split("|")[2],
        id: item.id,
        cost: 0,
      }));
      setFormData({
        ...formData,
        projectManager: updatedProjectManagers,
        ProjectManagerPeoplePicker: items,
      });
    } else {
      setProjectManagerRequiredMessageShow(true);
      setFormData({
        ...formData,
        projectManager: [],
        ProjectManagerPeoplePicker: [],
      });
      setShowCostFields(false);
    }
  };

  const getPeoplePickerProjectTeam = (items: any[]) => {
    if (items && items.length > 0) {
      setProjectTeamMessageShow(false);
      const updatedProjectTeam: ProjectManager[] = items.map((item) => ({
        name: item.text,
        cost: 0,
        email: item.loginName.split("|")[2],
        id: item.id,
      }));
      setFormData({
        ...formData,
        projectTeam: updatedProjectTeam,
        ProjectTeamPeoplePicker: items,
      });
    } else {
      setProjectTeamMessageShow(true);
      setFormData({
        ...formData,
        projectTeam: [],
        ProjectTeamPeoplePicker: [],
      });

      setShowCostFieldsForProjectTeam(false);
    }
  };

  const handleCostChange = (index: number, value: string) => {
    if (Number(value) < 0) return;
    const updatedProjectManagers = [...formData.projectManager];
    updatedProjectManagers[index].cost = showCostFields ? Number(value) : 0;
    setFormData({
      ...formData,
      projectManager: updatedProjectManagers,
    });
  };

  const handleCostChangeForProjectTeam = (index: number, value: string) => {
    if (Number(value) < 0) return;
    const updatedProjectTeam = [...formData.projectTeam];
    updatedProjectTeam[index].cost = showCostFieldsForProjectTeam
      ? Number(value)
      : 0;
    setFormData({
      ...formData,
      projectTeam: updatedProjectTeam,
    });
  };

  const handleChangeAttachment = (ev: React.FormEvent<HTMLInputElement>) => {
    const target = ev.currentTarget as HTMLInputElement & { files: FileList };
    const filesArray = Array.from(target.files || []);
    const updatedAttachments = [...attachments, ...filesArray];
    setAttachments(updatedAttachments);
    setFormData({
      ...formData,
      attachment: updatedAttachments,
    });
  };
  

  // Handle removing an attachment
  const handleDeleteAttachment = (index: number) => {
    const updatedAttachments = attachments.filter((_: any, i: number) => i !== index);
    setAttachments(updatedAttachments);
    setFormData({
      ...formData,
      attachment: updatedAttachments,
    });
  };

  const handleCancel = () => {
    setAddFormOpen(false);
    setAttachments([])
    props.initialData({});
    setFormData(initialState.formData);
    setShowCostFields(false);
  };

  return (
    <Drawer sx={{ position: "relative" }} anchor="right"  open={props.open}  onClose={handleCancel}  >
      <div
        style={{
          backgroundColor: "#023E8A",
          padding: "5px",
          marginBottom: "10px",
          width: "-webkit-fill-available",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          position: "fixed",
          zIndex: 999,
          
        }}
      >
        <Label style={{ fontSize: "20px", fontWeight: "600", marginLeft: "13px", color:"#fff"}} >
          {props.mode === "edit" ? "Edit Project" : props.mode === "View" ? "View Project details" : "Add Project"}
        </Label>
        <IconButton aria-label="close" onClick={handleCancel} sx={{ color: "white", }} >
          <CloseIcon />
        </IconButton>
      </div>

      <Box
        sx={{ ...drawerStyle,  overflowY: "auto", marginTop: "60px",  marginBottom: "60px",  }} >
        <form onSubmit={handleSubmit}>
        
          <div className={formStyles.fields} style={{ pointerEvents: props.mode === "View" ? "none" : "auto", }}>
            <TextField label="Project Name" name="projectName" value={formData.projectName} onChange={handleChange} required className={formStyles.fieldsWidth} />
            <TextField label="Client Name" name="clientName" value={formData.clientName} onChange={handleChange} className={formStyles.fieldsWidth}/>
          </div>

          <div className={formStyles.fields} style={{pointerEvents: props.mode === "View" ? "none" : "auto",  }}>
            <TextField label="Project Cost($)" type="number" name="projectCost" value={formData.projectCost?.toString()}  onChange={handleChange} className={formStyles.fieldsWidth} />
            <TextField label="Project Hours"type="number"name="projectHours" value={formData.projectHours?.toString()} onChange={handleChange} className={formStyles.fieldsWidth} />
          </div>

          <div className={formStyles.fields} style={{ pointerEvents: props.mode === "View" ? "none" : "auto", }}>
          <Dropdown label="Department" selectedKey={selectedDepartment} onChange={handleChangeDepartmentDropDown} options={departments} className={formStyles.fieldsWidth}/>
          <Dropdown label="Project Type" selectedKey={selectedOptionKey} onChange={handleChangeDropDown} options={options} className={formStyles.fieldsWidth} />
          </div>

          <div className={formStyles.fields} style={{ pointerEvents: props.mode === "View" ? "none" : "auto" }}>
          <Dropdown label="Project Status" selectedKey={statusSelectedOptionKey} options={projectStatus} onChange={handleChangeStatusDropDown}style={{ width: "322px" }} />
           
            <div className={formStyles.fieldsWidth}>
              <Label className={formStyles.fontWeight}> Reporting Manager </Label>
              <PeoplePicker context={props.context as any} personSelectionLimit={1} required={true} disabled={false} showtooltip={true} ensureUser={true} defaultSelectedUsers={  props.mode === "edit" || props.mode === "View"   ? [props.peoplePickerDefaultReportingManager] : [""] } onChange={getPeoplePickerReportingManager}resolveDelay={300} principalTypes={[PrincipalType.User]} groupName="" />
                {reportingManagerRequiredMessageShow && ( <span style={{ color: "red", fontSize: "12px" }}> Reporting Manager is required. </span> )}
            </div>

          </div>

          <div className={formStyles.fields} style={{pointerEvents: props.mode === "View" ? "none" : "auto", }}>
          
          <div style={{ width: "321px" }}>
            <Label className={formStyles.fontWeight}> Project Manager </Label>
            <PeoplePicker context={props.context as any} personSelectionLimit={1} required={true} disabled={false} showtooltip={true} ensureUser={true} defaultSelectedUsers={ props.mode === "edit" || props.mode === "View"  ? [props.peoplePickerDefaultManager]: [""] } onChange={getPeoplePickerProjectManager} resolveDelay={300} principalTypes={[PrincipalType.User]} groupName="" />
              {projectManagerRequiredMessageShow && ( <span style={{ color: "red", fontSize: "12px" }}> Project Manager is required. </span> )}
              {showCostFields && formData?.projectManager?.map((manager, index) => (
                <TextField key={index} label={`RPH for ${manager.name} ($)`} type="number"  value={manager.cost.toString()} onChange={(e, newValue) => handleCostChange(index, newValue || "") } />
              ))}
          </div>

            <div>
              <div style={{ gap: "10px", width: "320px" }}>
                <Label className={formStyles.fontWeight}> Project Team</Label>
                <PeoplePicker context={props.context as any} personSelectionLimit={100} required={true} disabled={false} showtooltip={true} ensureUser={true} defaultSelectedUsers={ props.mode === "edit" || props.mode === "View"  ? props.peoplePickerDefaultTeam : "" } onChange={getPeoplePickerProjectTeam} resolveDelay={300} principalTypes={[PrincipalType.User]} groupName=""/>
              </div>

              {projectTeamMessageShow && ( <span style={{ color: "red", fontSize: "12px" }}> Project Team is required.</span> )}
              
              {showCostFieldsForProjectTeam && formData.projectTeam.map((manager, index) => (
                <TextField key={index} label={`RPH for ${manager.name}($)`} type="number" value={manager.cost.toString()} onChange={(e, newValue) => handleCostChangeForProjectTeam(index, newValue || "") } style={{ width: "320px" }} />
              ))}
            </div>
          </div>

          <div className={formStyles.fields}>
            <TextField label="Description" multiline autoAdjustHeight={false} name="description" value={formData.description} onChange={handleChange} style={{ width: "320px", height: "20px" , pointerEvents: props.mode === "View" ? "none" : "auto", }}
              styles={{fieldGroup: { height: "100%", selectors: { ".ms-TextField-field": { height: "100%", paddingTop: "8px", paddingBottom: "8px", }, },}, }}
            />
          <div>

            <Label className={formStyles.fontWeight}>Attachment</Label>
            {props.mode !== "View" && (
            <input type="file" name="attachment" multiple id="attachment" onChange={handleChangeAttachment} style={{ display: 'block', marginTop: '10px',pointerEvents: props.mode === "View" ? "none" : "auto", }} />
            )}
             
            <ul>
              {attachments && attachments.length > 0 ? (
                attachments.map((file: { ServerRelativeUrl?: string; FileName?: string; name?: string }, index: number) => {
                
                  const fileName = file.FileName || file.name || 'Unnamed file';
                  const truncatedFileName = fileName.length > 30 ? fileName.slice(0, 30) + '...' : fileName;
                
                  return (
                    <li key={index} style={{ display: 'flex', alignItems: 'center' }}>
                    
                      <Tooltip title={file.FileName} arrow>
                        <a href={file.ServerRelativeUrl} target="_blank" rel="noopener noreferrer" style={{ cursor: 'pointer', marginRight: '10px' }} >
                          {truncatedFileName}
                        </a>
                      </Tooltip>
                      
                      {props.mode !== "View" && (
                        <IconButton style={{ marginLeft: '5px' }} onClick={() => handleDeleteAttachment(index)} aria-label="delete" size="small">
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      )}
                    </li>
                  );
                })
              ) : (
                <li>No attachments available</li>
              )}
            </ul>
          </div>
          </div>
          {props.mode !== "View" &&  (
             <div className={formStyles.buttonBox}>
             <PrimaryButton type="submit" text={props.mode === "edit" ? "Update" : "Submit"} className={formStyles.submitButton}/>
             <DefaultButton onClick={handleCancel} text="Cancel" className={formStyles.cancelButton}/>
           </div>
          )}
        </form>
      </Box>
    </Drawer>
  );
};

export default FormComponent;
