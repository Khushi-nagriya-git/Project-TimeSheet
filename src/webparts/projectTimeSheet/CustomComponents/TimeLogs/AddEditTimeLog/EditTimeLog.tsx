import { React, useState, useEffect, FormEvent, Box, Drawer, CloseIcon, IconButton, CustomFormData, initialState, TextField, Dropdown, Label, IDropdownOption, DefaultButton, PrimaryButton, JobsData, jobsInitialState,} from "../../../../../index";
import { TimeLogsData, timeLogsDataInitialState } from "../ITimeLogsStats";
import Styles from "../TimeLog.module.scss";

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

const EditTimeLog = (props: { setEditFormOpen: React.Dispatch<React.SetStateAction<any>>; setInitialFormData: React.Dispatch<React.SetStateAction<any>>; initialFormData: any; onSubmit: any; open: any; projectsData: any; jobsData: any; isUserProjectManager:any; loggedInUserDetails:any; isUserProjectTeam:any; isUserReportingManager:any;}) => {
  const [formData, setFormData] = useState<TimeLogsData>( timeLogsDataInitialState.timeLogsData );
  const [filterJobs, setFilteredJobs] = useState<JobsData[]>( jobsInitialState.jobsData);
  const [selectedJob, setSelectedJob] = useState<string>();
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [selectedBillableStatus, setSelectedBillableStatus] = useState<string>("");

  const options: IDropdownOption[] = [
    { key: "Billable", text: "Billable" },
    { key: "nonBillable", text: "Non Billable" },
  ];

  useEffect(() => {
    if (props.initialFormData) {
      setFormData(props.initialFormData);
      setSelectedProject(props.initialFormData.ProjectId);
      setSelectedJob(props.initialFormData.JobId);
      setSelectedBillableStatus(props.initialFormData.BillableStatus === "Non Billable" ? "nonBillable" : props.initialFormData.BillableStatus);
    }
  }, [props.initialFormData]);

  useEffect(() => {
    if (selectedProject) {
      const filtered = props.jobsData.filter( (job: any) => job.ProjectId === selectedProject );
      setFilteredJobs(filtered);
    } else {
      setFilteredJobs(props.jobsData);
    }
  }, [selectedProject, props.jobsData]);

  const handleProjectChangeDropDown = ( ev: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
    if (option) {
      const selectedValue = option.key as string;
      setSelectedProject(selectedValue);
      setFormData({
        ...formData,
        ProjectId: parseInt(selectedValue, 10),
        ProjectName: option.text,
      });
    }
  };

  const handleBillableStatusChange = ( event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption ) => {
    if (option) {
      const selectedValue = option.key as string;
      setSelectedBillableStatus(selectedValue);
      setFormData({ ...formData, BillableStatus: selectedValue });
    }
  };

  const handleJobChange = ( event: React.FormEvent<HTMLDivElement>, option?: IDropdownOption ) => {
    if (option) {
      const selectedValue = option.key as string;
      setSelectedJob(selectedValue);
      const data = filterJobs.filter( (index: any) => index.JobId ===  option.key );

      setFormData({
        ...formData,
        JobId: parseInt(selectedValue, 10),
        JobName: option.text,
        EstimatedHours: data[0].EstimatedHours

      });
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onSubmit(formData);
  };

  const handleCancel = () => {
    props.setEditFormOpen(false);
  };

  const handleChangeEstimatedHoursInput = (  e: React.ChangeEvent<HTMLInputElement> ) => {
    const { name, value } = e.currentTarget;
    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0)) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleChange = ( ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string ) => {
    const { name, value } = ev.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  const convertMinutesToHours = (minutes: number): number => {
    return minutes / 60;
  };

  const formatHours = (hours: number): string => {
    return hours.toString().replace(/(\.\d*?[1-9])0+$/, "$1");
  };

  return (
    <Drawer sx={{ position: "relative" }} anchor="right" open={props.open} onClose={handleCancel} >
      
      <div className={Styles.EditBox}>
        <Label style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "13px" }} > Edit Time Log Entry </Label>
        <IconButton aria-label="close" onClick={handleCancel} sx={{ color: "grey", }}>
          <CloseIcon />
        </IconButton>
      </div>

      <Box sx={{ ...drawerStyle, overflowY: "auto", marginTop: "60px", marginBottom: "60px", }} >
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", gap: "10px" }}>
            <Dropdown placeholder="Select Project" label="Project Name" selectedKey={selectedProject} onChange={handleProjectChangeDropDown}  style={{ width: "320px" }}
              options={props.projectsData.map(
                (project: { ProjectId: any; ProjectName: any }) => ({
                  key: project.ProjectId,
                  text: project.ProjectName,
                })
              )}
              
            />
            <Dropdown label="Task Name" placeholder="Select Task" selectedKey={selectedJob} onChange={handleJobChange}  style={{ width: "320px" }}
              options={filterJobs.map((job: { JobId: any; JobName: any }) => ({
                key: job.JobId,
                text: job.JobName,
              }))}
            />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <Dropdown label="Task Type" placeholder="Select Task Type" selectedKey={selectedBillableStatus} onChange={handleBillableStatusChange} options={options} disabled style={{ width: "320px" }} />
            <TextField label="Estimated Hours" type="number" name="EstimatedHours" disabled value={formatHours( convertMinutesToHours(formData.EstimatedHours) )} style={{ width: "320px" }} />
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <TextField type="number" name="LoggedHours"  value={formData.LoggedHours?.toString() || ''} onChange={handleChangeEstimatedHoursInput} style={{ width: "320px" }} label="Logged Mintues" />
            <TextField label="Description" name="Description" placeholder="What are you working on ?" style={{ width: "320px" }} onChange={handleChange} value={formData.Description} />
          </div>

          <div className={Styles.EditButtons} >
            <PrimaryButton type="submit" text="Update" className={Styles.submitButton} />
            <DefaultButton onClick={handleCancel} text="Cancel" className={Styles.CancelButton}/>
          </div>
        </form>
      </Box>
    </Drawer>
  );
};

export default EditTimeLog;
