import * as React from "react";
import { useState, useEffect, FormEvent } from "react";
import {
  TextField,
  Dropdown,
  Label,
  IDropdownOption,
  DefaultButton,
  PrimaryButton,
} from "@fluentui/react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { IJobFormProps } from "./IJobFormProps";
import { JobFormData, initialState } from "./IJobFormStats";

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

const JobForm: React.FC<IJobFormProps> = (props) => {
  const [open, setOpen] = useState(true);
  const [formData, setFormData] = useState<JobFormData>(
    initialState.jobFormData
  );
  const [selectedPeoplePicker, setSelectedPeoplePicker] = useState<any[]>([]);
  const [estimatedHours, setEstimatedHours] = useState<{
    [key: string]: number;
  }>({});
  const [showEstimatedHour, setShowEstimatedHour] = useState(false);

  const Projects: IDropdownOption[] = props.projectsData.map(
    (project: any) => ({ key: project.ProjectId, text: project.ProjectName })
  );

  const projectTeamOptions: IDropdownOption[] =
    props.projectsData
      ?.filter((project: any) => project.ProjectId === formData.projectId)
      ?.flatMap((project: any) => {
        // Use a Map to track unique options by key
        const optionsMap = new Map<string, IDropdownOption>();

        // Parse and map ProjectTeam data
        JSON.parse(project.ProjectTeam).forEach((member: any) => {
          if (!optionsMap.has(member.id)) {
            optionsMap.set(member.id, {
              key: member.id,
              text: member.name,
            });
          }
        });

        // Parse and map ReportingManager data
        const reportingManager = JSON.parse(project.ReportingManager)[0];
        if (!optionsMap.has(reportingManager?.id)) {
          optionsMap.set(reportingManager?.id, {
            key: reportingManager?.id,
            text: reportingManager?.text, // Ensure this is the correct property
          });
        }

        // Parse and map ProjectManager data
        const projectManager = JSON.parse(project.ProjectManager)[0];
        if (!optionsMap.has(projectManager.id)) {
          optionsMap.set(projectManager.id, {
            key: projectManager.id,
            text: projectManager.name,
          });
        }

        // Return an array of unique options
        return Array.from(optionsMap.values());
      }) || [];


  const billableStatusOptions: IDropdownOption[] = [
    { key: "billable", text: "Billable" },
    { key: "nonbillable", text: "Non Billable" },
  ];
  const jobStatus: IDropdownOption[] = [
    { key: "NotStarted", text: "Not Started" },
    { key: "InProgress", text: "In Progress" },
    { key: "Completed", text: "Completed" },
    { key: "OnHold", text: "On Hold" },
  ];

  useEffect(() => {
    if (props.mode === "edit" && props.initialData) {
      setFormData(props.initialData);
      formData.JobAssigness = props.initialData.JobAssigness;
      if (props.initialData.JobAssigness) {
        // Extract IDs from the JobAssigness array
        const memberIds = props.initialData.JobAssigness.map(
          (jobAssignee: any) => jobAssignee.id
        );

        // Set the selected team member IDs
        setSelectedTeamMemberIds(memberIds);
        if(props.initialData.billableStatus === "billable")setShowEstimatedHour(true);
      }
    }
  }, [props.mode, props.initialData]);

  const [selectedTeamMemberIds, setSelectedTeamMemberIds] = useState<string[]>(
    []
  );
  const selectedTeamMembers: any[] = [];

  const handleAssigneeChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    if (option) {
      const selectedId = option.key as string;
      const selectedProject = props.projectsData.find(
        (project: any) => project.ProjectId === formData.projectId
      );
  
      if (selectedProject) {
        const projectTeam = JSON.parse(selectedProject.ProjectTeam) as any[];
        const reportingManager = JSON.parse(selectedProject.ReportingManager)[0];
        const projectManager = JSON.parse(selectedProject.ProjectManager)[0];
  
        // Combine all potential assignees (team members, project manager, reporting manager)
        const allAssignees = [
          ...projectTeam,
          reportingManager,
          projectManager,
        ];
  
        // Find the selected member from the combined list
        const selectedMember = allAssignees.find(
          (member: any) => member.id === selectedId
        );
  
        let updatedSelectedTeamMemberIds = [...selectedTeamMemberIds];
        let updatedJobAssignees = [...(formData.JobAssigness || [])];
  
        if (option.selected) {
          // Add member to the selected list
          if (selectedMember) {
            selectedTeamMembers.push(selectedMember);
            updatedSelectedTeamMemberIds.push(selectedMember.id);
            updatedJobAssignees.push({
              name: selectedMember.name?selectedMember.name:selectedMember.text,
              email: selectedMember.email ? selectedMember.email : selectedMember.secondaryText,
              id: selectedMember.id,
              estimatedHours: estimatedHours[selectedMember.id] || 0,
              loggedHours: 0,
            });
          }
        } else {
          // Remove member from the selected list
          updatedSelectedTeamMemberIds = updatedSelectedTeamMemberIds.filter(
            (id) => id !== selectedId
          );
          updatedJobAssignees = updatedJobAssignees.filter(
            (assignee) => assignee.id !== selectedId
          );
        }
  
        setSelectedTeamMemberIds(updatedSelectedTeamMemberIds);
        setShowEstimatedHour(true);
        setFormData((prevData) => ({
          ...prevData,
          JobAssigness: updatedJobAssignees,
          
        }));
      }
    } else {
      setShowEstimatedHour(false);
      setFormData((prevData) => ({
        ...prevData,
        JobAssigness: [],
      }));
    }
  };
  

  const handleChangeEstimatedHours = (userId: string, hours: number) => {
    setEstimatedHours((prevState) => ({
      ...prevState,
      [userId]: hours,
    }));
    setFormData((prevData) => {
      const updatedAssignees = prevData.JobAssigness.map((assignee) =>
        assignee.id === userId
          ? { ...assignee, estimatedHours: hours }
          : assignee
      );
      return { ...prevData, JobAssigness: updatedAssignees };
    });
  };

  const handleChangeEstimatedHoursInput =
    (userId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const formattedValue = value.match(/^\d{0,3}(\.\d{0,2})?/)?.[0] || "0";
      const numericValue =
        formattedValue === "" ? 0 : parseFloat(formattedValue);
      handleChangeEstimatedHours(userId, numericValue);
    };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.onSubmit(formData);
  };

  const handleCancel = () => {
    setOpen(false);
    props.setDrawerOpen(false);
    setShowEstimatedHour(false);
    formData.JobAssigness=[];
    props.setMode("add");
    setFormData(initialState.jobFormData);
    setSelectedPeoplePicker([]);
  };

  const handleChangeAttachment = (ev: React.FormEvent<HTMLInputElement>) => {
    const target = ev.currentTarget as HTMLInputElement & { files: FileList };
    const selectedFile = target.files ? target.files[0] : null;
    setFormData((prevData) => ({
      ...prevData,
      attachment: selectedFile,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleDropdownChange =
    (name: string) =>
    (ev: React.FormEvent<HTMLDivElement>, option?: IDropdownOption) => {
      setFormData((prevData) => {
        const update: Partial<JobFormData> =
          name === "projectName"
            ? {
                projectId: option?.key,
                projectName: option?.text || "",
              }
            : {
                [name]: option?.key || option?.text,
              };
              if(name === "billableStatus"){
                if ((option?.key === "Billable" || option?.key === "billable") || 
                (option?.text === "Billable" || option?.text === "billable")) {
                setShowEstimatedHour(true);
                } else {
              setShowEstimatedHour(false);
              for(let i=0;i<formData.JobAssigness.length;i++){
                formData.JobAssigness[i].estimatedHours = 0;
              }
              }
              }     
        return {
          ...prevData,
          ...update,
        };
      });
    };

  return (
    <Drawer
      sx={{ position: "relative" }}
      anchor="right"
      open={props.drawerOpen}
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
          {props.mode === "edit" ? "Update Task" : "Add Task"}
        </Label>
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{ color: "white" }}
        >
          <CloseIcon />
        </IconButton>
      </div>
      <Box
        sx={{
          ...drawerStyle,
          overflowY: "auto",
          marginTop: "60px",
          marginBottom: "60px",
        }}
      >
        <form onSubmit={handleSubmit}>
          <Box style={{ display: "flex", gap: "10px" }}>
            <TextField
              label="Task Name"
              name="jobName"
              required
              disabled = {props.mode === "edit" && !(formData.Author === props.loggedInUserDetails.Email)}
              style={{ width: "320px" }}
              value={formData.jobName}
              onChange={handleChange}
            />
            <Dropdown
              label="Project Name"
              selectedKey={formData.projectId}
              disabled = {props.mode === "edit" && !(formData.Author === props.loggedInUserDetails.Email)}
              onChange={handleDropdownChange("projectName")}
              options={Projects}
              style={{ width: "320px" }}
            />
          </Box>
          <Box style={{ display: "flex", gap: "10px" }}>
            <TextField
              label="Start Date"
              type="date"
              name="startDate"
              disabled = {props.mode === "edit" && !(formData.Author === props.loggedInUserDetails.Email)}
              required
              style={{ width: "320px" }}
              value={formData.startDate}
              onChange={handleChange}
            />
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              disabled = {props.mode === "edit" && !(formData.Author === props.loggedInUserDetails.Email)}
              required
              style={{ width: "320px" }}
              value={formData.endDate}
              onChange={handleChange}
            />
          </Box>
          <Box style={{ display: "flex", gap: "10px" }}>
            <Dropdown
              label="Task Type"
              selectedKey={formData.billableStatus}
              onChange={handleDropdownChange("billableStatus")}
              options={billableStatusOptions}
              disabled = {props.mode === "edit" && !(formData.Author === props.loggedInUserDetails.Email)}
              style={{ width: "320px" }}
            />
            <Dropdown
              label="Task Status"
              selectedKey={formData.jobStatus}
              onChange={handleDropdownChange("jobStatus")}
              options={jobStatus}
              style={{ width: "322px" }}
            />
          </Box>
          <Box style={{ display: "flex", gap: "10px" }}>
            <TextField
              label="Description"
              multiline
              autoAdjustHeight={false}
              name="description"
              style={{ width: "650px" }}
              disabled = {props.mode === "edit" && !(formData.Author === props.loggedInUserDetails.Email)}
              value={formData.description}
              onChange={handleChange}
            />
          </Box>

          <Box style={{ display: "flex", gap: "10px" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "320px",
              }}
            >
              <Dropdown
                label="Task Assignees"
                selectedKeys={selectedTeamMemberIds}
                onChange={handleAssigneeChange}
                options={projectTeamOptions}
                disabled = {props.mode === "edit" && !(formData.Author === props.loggedInUserDetails.Email)}
                style={{ width: "100%" }}
                multiSelect
              />

              {showEstimatedHour && formData?.JobAssigness && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                    width: "100%",
                  }}
                >
                  <Label>.25 = 15Min, .5 = 30Min, .75 = 45Min, 1 = 1Hour</Label>
                  {formData?.JobAssigness?.map((user, index) => (
                    <Box
                      key={user.id}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        width: "100%",
                      }}
                    >
                      <TextField
                        key={index}
                        type="number"
                        disabled = {props.mode === "edit" && !(formData.Author === props.loggedInUserDetails.Email)}
                        value={user?.estimatedHours?.toString()}
                        onChange={handleChangeEstimatedHoursInput(user.id)}
                        styles={{ root: { width: "100%" } }}
                        label={`Estimated Hours for ${user.name}`}
                      />
                    </Box>
                  ))}
                </Box>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                width: "auto",
              }}
            >
              <Label style={{ fontWeight: "600", marginTop: "5px" }}>
                Attachment
              </Label>
              <input
                type="file"
                disabled = {props.mode === "edit" && !(formData.Author === props.loggedInUserDetails.Email)}
                name="attachment"
                id="attachment"
                onChange={handleChangeAttachment}
                style={{ display: "block" }}
              />
            </Box>
          </Box>

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

export default JobForm;
