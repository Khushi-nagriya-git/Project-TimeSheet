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
import {
  PeoplePicker,
  PrincipalType,
} from "@pnp/spfx-controls-react/lib/PeoplePicker";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box } from "@mui/material";
import Drawer from "@mui/material/Drawer";
import { IJobFormProps } from "./IJobFormProps";
import styles from "./JobForm.module.scss";
import { JobAssginees, JobFormData, initialState } from "./IJobFormStats";

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

  const Projects: IDropdownOption[] = props.projectsData.map(
    (project: any) => ({ key: project.ProjectId, text: project.ProjectName })
  );

  const projectTeamOptions: IDropdownOption[] =
    props.projectsData
      ?.filter((project: any) => project.ProjectId === formData.projectId)
      ?.flatMap((project: any) =>
        JSON.parse(project.ProjectTeam).map((member: any) => ({
          key: member.id,
          text: member.name,
        }))
      ) || [];

  const [showEstimatedHour, setShowEstimatedHour] = useState(false);

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
      if (formData.JobAssigness) {
        setShowEstimatedHour(true);
      }
    }
  }, [props.mode, props.initialData]);

  // const handlePeoplePickerChange = (items: any[]) => {
  //   if (items && items.length > 0) {
  //     const updateJobAssignees: JobAssginees[] = items.map((item) => ({
  //       name: item.text,
  //       email: item.loginName.split("|")[2],
  //       id: item.id,
  //       estimatedHours: estimatedHours[item.id] || 0,
  //       loggedHours: 0,
  //     }));

  //     setSelectedPeoplePicker(items);
  //     setShowEstimatedHour(true);
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       JobAssigness: updateJobAssignees,
  //       AssignedToPeoplePicker: items
  //     }));
  //   } else {
  //     setSelectedPeoplePicker([]);
  //     setShowEstimatedHour(false);
  //     setFormData((prevData) => ({
  //       ...prevData,
  //       JobAssigness: [],
  //       AssignedToPeoplePicker: [],
  //     }));
  //   }
  // };

  const [selectedMembers , setSelectedMembers] = useState([{}]);
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
        setSelectedMembers(prevItems =>{
          if( prevItems != null &&prevItems.length >0)
          {
              return  [...prevItems,projectTeam.filter(
                (member: any) => member.id === selectedId
              )]
          }
          else
          {
            return projectTeam.filter(
              (member: any) => member.id === selectedId   )
          }
        }) 
       
        const updatedJobAssignees = option.selected
          ? [
              ...(formData.JobAssigness || []),
              ...selectedMembers.map((member: any) => ({
                name: member.name,
                email: member.email,
                id: member.id,
                estimatedHours: estimatedHours[member.id] || 0,
                loggedHours: 0,
              })),
            ]
          : (formData.JobAssigness || []).filter(
              (assignee: any) => assignee.id !== selectedId
            );
  
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
    props.setMode("add");
    setFormData(props.initialData);
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
          backgroundColor: "#F3F2F1",
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
          style={{ fontSize: "20px", fontWeight: "bold", marginLeft: "13px" }}
        >
          {props.mode === "edit" ? "Edit Job" : "Add Job"}
        </Label>
        <IconButton
          aria-label="close"
          onClick={handleCancel}
          sx={{ color: "grey" }}
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
              label="Job Name"
              name="jobName"
              required
              style={{ width: "320px" }}
              value={formData.jobName}
              onChange={handleChange}
            />
            <Dropdown
              label="Project Name"
              selectedKey={formData.projectId}
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
              required
              style={{ width: "320px" }}
              value={formData.startDate}
              onChange={handleChange}
            />
            <TextField
              label="End Date"
              type="date"
              name="endDate"
              required
              style={{ width: "320px" }}
              value={formData.endDate}
              onChange={handleChange}
            />
          </Box>
          <Box style={{ display: "flex", gap: "10px" }}>
            <Dropdown
              label="Billable Status"
              selectedKey={formData.billableStatus}
              onChange={handleDropdownChange("billableStatus")}
              options={billableStatusOptions}
              style={{ width: "320px" }}
            />
            <Dropdown
              label="Job Status"
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
                label="Job Assignees"
                selectedKey={formData.JobAssigness?.[0]?.id}
                onChange={handleAssigneeChange}
                options={projectTeamOptions}
                style={{ width: "100%" }}
                multiSelect
              />

              {showEstimatedHour && formData?.JobAssigness  && (
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
                        value={user.estimatedHours.toString()}
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
                backgroundColor: "#1565C0",
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
