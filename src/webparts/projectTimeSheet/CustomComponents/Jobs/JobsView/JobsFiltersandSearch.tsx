import {
  Dropdown,
  IDropdownOption,
  Label,
  SearchBox,
  IconButton,
} from "@fluentui/react";
import { Grid } from "@mui/material";
import * as React from "react";
import { useState, useEffect } from "react";

interface JobsHeaderProps {
  onJobFilterChange: (selectedValues: string[]) => void;
  onJobStatusChange: (selectedValues: string[]) => void;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setFilteredJobs: React.Dispatch<React.SetStateAction<any>>;
  filteredJobs: any;
  searchQuery: string;
  projectsData: any;
  jobsData: any;
  onJobsAssigneesChange: any;
  isUserAdmin:any;
  isUserProjectTeam:any;
  isUserReportingManager:any;
  isUserProjectManager:any
}

const JobsFiltersandSearch: React.FC<JobsHeaderProps> = ({
  projectsData,
  jobsData,
  onJobFilterChange,
  onJobStatusChange,
  setSearchQuery,
  isUserProjectTeam,
  isUserProjectManager,
  isUserReportingManager,isUserAdmin,
  searchQuery,
  setFilteredJobs,
  onJobsAssigneesChange,
}) => {
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);
  const statusOptions = ["Not Started", "In Progress", "Completed", "On Hold"];
  const [assignees, setAssignees] = useState<[]>([]);

  useEffect(() => {
    const filteredJobs = jobsData.filter((job: any) => job.AssignedTo);
    const parsedAssignees = filteredJobs.map((job: any) =>
      JSON.parse(job.AssignedTo)
    );
    const flattenedAssignees = parsedAssignees.flat();
    // Remove duplicates based on the 'id' field
    const uniqueAssignees = flattenedAssignees.filter(
      (
        assignee: { id: any },
        index: any,
        self: { findIndex: (arg0: (a: any) => boolean) => any }
      ) => index === self.findIndex((a) => a.id === assignee.id)
    );
    // Set the unique assignees to the state if any exist
    if (uniqueAssignees.length > 0) {
      setAssignees(uniqueAssignees);
    }
  }, [jobsData]);

  const handleJobsChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    if (option) {
      const selectedValues = option.selected
        ? [...selectedProjects, option.key as string]
        : selectedProjects.filter((key) => key !== (option.key as string));
      setSelectedProjects(selectedValues);
      onJobFilterChange(selectedValues);
    }
  };

  const handleStatusChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    if (option) {
      const selectedValues = option.selected
        ? [...selectedStatus, option.key as string]
        : selectedStatus.filter((key) => key !== (option.key as string));
      setSelectedStatus(selectedValues);
      onJobStatusChange(selectedValues);
    }
  };
  
  const handleAssigneesChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    if (option) {
      const selectedValues = option.selected
        ? [...selectedAssignees, option.key as string]
        : selectedAssignees.filter((key) => key !== (option.key as string));
      setSelectedAssignees(selectedValues);
      onJobsAssigneesChange(selectedValues);
    }
  };

  const resetFilters = () => {
    setFilteredJobs(jobsData);
    setSelectedStatus([]);
    setSelectedProjects([]);
    setSelectedAssignees([]);
    setSearchQuery("");
  };

  return (
    <div>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <Label style={{ fontWeight: "600" }}>Projects</Label>
          <Dropdown
            placeholder="All"
            selectedKeys={selectedProjects}
            onChange={handleJobsChange}
            multiSelect
            options={projectsData
              .sort((a: any, b: any) => a.ProjectName.localeCompare(b.ProjectName)) // Sort alphabetically by ProjectName
              .map((project: any) => ({
                key: project.ProjectName,
                text: project.ProjectName,
                selected: selectedProjects.indexOf(project.ProjectName) > -1,
                checkbox: true,
              }))}            
            styles={{
              root: {
                width: 200,
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
            }}
          />
        </Grid>

        <Grid item>
          <Label style={{ fontWeight: "600" }}>Status</Label>
          <Dropdown
            placeholder="All"
            selectedKeys={selectedStatus}
            onChange={handleStatusChange}
            multiSelect
            options={statusOptions.sort((a, b) => a.localeCompare(b)).map((status) => ({
              key: status,
              text: status,
              selected: selectedStatus.indexOf(status) > -1,
              checkbox: true,
            }))}
            styles={{
              root: {
                width: 200,
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
            }}
          />
        </Grid>

       
          {(isUserAdmin || isUserReportingManager || isUserProjectManager) && (
             <Grid item>
              <Label style={{ fontWeight: "600" }}>Assignees</Label>
              <Dropdown
                placeholder="All"
                selectedKeys={selectedAssignees}
                onChange={handleAssigneesChange}
                multiSelect
                options={assignees.sort((a: any, b: any) => a.name.localeCompare(b.name)).map((assignee: any) => ({
                  key: assignee.id,
                  text: assignee.name,
                  selected: selectedAssignees.indexOf(assignee.name) > -1,
                }))}
                styles={{
                  root: {
                    width: 200,
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
                }}
              />
                 </Grid>
          )}
   

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
            placeholder="Search by jobs and status"
            value={searchQuery}
            onChange={(e) =>
              setSearchQuery(
                (e as React.ChangeEvent<HTMLInputElement>).target.value
              )
            }
            onClear={() => setSearchQuery("")}
            styles={{
              root: {
                width: 300,
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
            }}
          />

          <IconButton
            iconProps={{ iconName: "ArrowUpRightMirrored8" }}
            onClick={resetFilters}
            styles={{
              root: {
                height: 31,
                width: 31, // Adjusted width for the IconButton
                marginLeft: 10,
                border: "1px solid rgba(0, 0, 0, 0.4)",
                backgroundColor: "#ffffff",
                marginBottom: 10,
                marginTop: 8,
              },
            }}
          />
        </Grid>
      </Grid>
    </div>
  );
};

export default JobsFiltersandSearch;
