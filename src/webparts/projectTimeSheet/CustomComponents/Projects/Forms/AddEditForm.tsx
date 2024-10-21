import {
  React,
  useState,
  useEffect,
  FormEvent,
  Box,
  Drawer,
  CloseIcon,
  PeoplePicker,
  PrincipalType,
  IFormProps,
  IconButton,
  CustomFormData,
  ProjectManager,
  initialState,
  Stack,
  TextField,
  Dropdown,
  Label,
  IDropdownOption,
  Modal,
  DefaultButton,
  PrimaryButton,
} from "../../../../../index";

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
  const [statusSelectedOptionKey, setStatusSelectedOptionKey] =
    useState<any>("");
  const [formData, setFormData] = useState<CustomFormData>(
    initialState.formData
  );
  const [showCostFields, setShowCostFields] = useState(false);
  const [showCostFieldsForProjectTeam, setShowCostFieldsForProjectTeam] =
    useState(false);
  const options: IDropdownOption[] = [
    { key: "fixedCost", text: "Fixed Cost" },
    { key: "resourceBased", text: "Resource Based" },
  ];

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
    if (props.mode === "edit" && props.initialData) {
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
        cost:
          props.mode === "edit" &&
          props.initialData.projectType === "Resource Based"
            ? manager.cost
            : 0,
      }));
      setFormData((prevState) => ({
        ...prevState,
        projectManager: updatedProjectManagers,
      }));
    }

    if (!showCostFieldsForProjectTeam) {
      const updatedProjectTeam = formData.projectTeam.map((teamMember) => ({
        ...teamMember,
        cost:
          props.mode === "edit" &&
          props.initialData.projectType === "Resource Based"
            ? teamMember.cost
            : 0,
      }));
      setFormData((prevState) => ({
        ...prevState,
        projectTeam: updatedProjectTeam,
      }));
    }
  }, [showCostFields, showCostFieldsForProjectTeam]);

  const handleChange = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
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

  const handleChangeDropDown = (
    ev: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
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

  const handleChangeDepartmentDropDown = (
    ev: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    const selectedValue = option?.text as string;
    setSelectedDepartment(option?.key);

    setFormData({
      ...formData,
      department: selectedValue,
    });
  };

  const handleChangeStatusDropDown = (
    ev: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ) => {
    const selectedValue = option?.text as string;
    setStatusSelectedOptionKey(option?.key);
    setFormData({
      ...formData,
      projectStatus: selectedValue,
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onSubmit(formData);
  };

  const getPeoplePickerReportingManager = (items: any[]) => {
    if (items && items.length > 0) {
      setFormData({
        ...formData,
        ReportingManager: items[0],
        ReportingManagerPeoplePicker: items,
      });
    } else {
      setFormData({
        ...formData,
        ReportingManager: [],
        ReportingManagerPeoplePicker: [],
      });
    }
  };

  const getPeoplePickerProjectManager = (items: any[]) => {
    if (items && items.length > 0) {
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
    const selectedFile = target.files[0];
    setFormData({
      ...formData,
      attachment: selectedFile,
    });
  };

  const handleCancel = () => {
    setAddFormOpen(false);
    props.initialData({});
    setFormData( initialState.formData);
    setShowCostFields(false);
  };

  return (
    <Drawer
      sx={{ position: "relative" }}
      anchor="right"
      open={props.open}
      onClose={handleCancel}
    >
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
        <Label
          style={{ fontSize: "20px", fontWeight: "600", marginLeft: "13px", color:"#fff"}}
        >
          {props.mode === "edit" ? "Edit Project" : "Add Project"}
        </Label>
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{
            color: "white",
          }}
        >
          <CloseIcon />
        </IconButton>
      </div>

      <Box
        sx={{
          ...drawerStyle,
          overflowY: "auto",
          marginTop: "60px", // height of the fixed header
          marginBottom: "60px", // height of the fixed footer
        }}
      >
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "10px" }}>
            <TextField
              label="Project Name"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              required
              style={{ width: "320px" }}
            />
            <TextField
              label="Client Name"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              style={{ width: "320px" }}
              
            />
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <TextField
              label="Project Cost"
              type="number"
              name="projectCost"
              value={formData.projectCost?.toString()}
              onChange={handleChange}
              style={{ width: "320px" }}
            />
             <TextField
              label="Project Hours"
              type="number"
              name="projectHours"
              value={formData.projectHours?.toString()}
              onChange={handleChange}
              style={{ width: "320px" }}
            />
          
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
          <Dropdown
              label="Department"
              selectedKey={selectedDepartment}
              onChange={handleChangeDepartmentDropDown}
              options={departments}
              style={{ width: "320px" }}
            />
            <Dropdown
              label="Project Type"
              selectedKey={selectedOptionKey}
              onChange={handleChangeDropDown}
              options={options}
              style={{ width: "320px" }}
            />

          
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
          <Dropdown
              label="Project Status"
              selectedKey={statusSelectedOptionKey}
              options={projectStatus}
              onChange={handleChangeStatusDropDown}
              style={{ width: "322px" }}
            />
            <div style={{ width: "320px" }}>
              <Label style={{ fontWeight: "600" }}>
                Reporting Manager
              </Label>
              <PeoplePicker
                context={props.context as any}
                personSelectionLimit={1}
                required={true}
                disabled={false}
                showtooltip={true}
                ensureUser={true}
                defaultSelectedUsers={
                  props.mode === "edit"
                    ? [props.peoplePickerDefaultReportingManager]
                    : [""]
                }
                onChange={getPeoplePickerReportingManager}
                resolveDelay={300}
                principalTypes={[PrincipalType.User]}
                groupName=""
              />
            </div>
           
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
          <div style={{ width: "321px" }}>
              <Label style={{ fontWeight: "600" }}>
                Project Manager
              </Label>
              <PeoplePicker
                context={props.context as any}
                personSelectionLimit={1}
                required={true}
                disabled={false}
                showtooltip={true}
                ensureUser={true}
                defaultSelectedUsers={
                  props.mode === "edit"
                    ? [props.peoplePickerDefaultManager]
                    : [""]
                }
                onChange={getPeoplePickerProjectManager}
                resolveDelay={300}
                principalTypes={[PrincipalType.User]}
                groupName=""
              />
              {showCostFields &&
                formData?.projectManager?.map((manager, index) => (
                  <TextField
                    key={index}
                    label={`RPH for ${manager.name}`}
                    type="number"
                    value={manager.cost.toString()}
                    onChange={(e, newValue) =>
                      handleCostChange(index, newValue || "")
                    }
                  />
                ))}
            </div>
            <div>
              <div style={{ gap: "10px", width: "320px" }}>
                <Label style={{ fontWeight: "600" }}>
                  Project Team
                </Label>

                <PeoplePicker
                  context={props.context as any}
                  personSelectionLimit={100}
                  required={true}
                  disabled={false}
                  showtooltip={true}
                  ensureUser={true}
                  defaultSelectedUsers={
                    props.mode === "edit" ? props.peoplePickerDefaultTeam : ""
                  }
                  onChange={getPeoplePickerProjectTeam}
                  resolveDelay={300}
                  principalTypes={[PrincipalType.User]}
                  groupName=""
                />
              </div>
              {showCostFieldsForProjectTeam &&
                formData.projectTeam.map((manager, index) => (
                  <TextField
                    key={index}
                    label={`RPH for ${manager.name}`}
                    type="number"
                    value={manager.cost.toString()}
                    onChange={(e, newValue) =>
                      handleCostChangeForProjectTeam(index, newValue || "")
                    }
                    style={{ width: "320px" }}
                  />
                ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
          <TextField
              label="Description"
              multiline
              autoAdjustHeight={false}
              name="description"
              value={formData.description}
              onChange={handleChange}
              style={{ width: "320px", height: "20px" }}
              styles={{
                fieldGroup: {
                  height: "100%",
                  selectors: {
                    ".ms-TextField-field": {
                      height: "100%",
                      paddingTop: "8px",
                      paddingBottom: "8px",
                    },
                  },
                },
              }}
            />
            <div>
          <Label style={{ fontWeight: "600" }}>Attachment</Label>
          <input
            type="file"
            name="attachment"
            id="attachment"
            onChange={handleChangeAttachment}
            style={{ display: "block" , marginTop:"10px"}}
          />
          </div>
          </div>
          <div
            style={{
              padding: "5px",
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              position: "fixed",
              bottom: 0,
              zIndex: 999,
              gap: "10px",
            }}
          >
            <PrimaryButton
              type="submit"
              text={props.mode === "edit" ? "Update" : "Submit"}
              style={{
                backgroundColor: "#023E8A",
                color: "#fff",
                height: "35px",
                borderRadius: "5px",
                marginBottom: "5px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            />

            <DefaultButton
              onClick={handleCancel}
              text="Cancel"
              style={{
                color: "rgb(50, 49, 48)",
                backgroundColor: "white",
                height: "35px",
                border: "1px solid grey",
                borderRadius: "5px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                marginBottom: "5px",
              }}
            />
          </div>
        </form>
      </Box>
    </Drawer>
  );
};

export default FormComponent;
