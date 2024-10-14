import {
  React,
  useState,
  Grid,
  Dropdown,
  IDropdownOption,
  SearchBox,
  Label,
} from "../../../../../index";
import { IconButton } from "@fluentui/react";

interface ProjectFiltersProps {
  onProjectFilterChange: (selectedValues: string[]) => void;
  onProjectStatusChange: (selectedValues: string[]) => void;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  setFilteredProjects: React.Dispatch<React.SetStateAction<any>>;
  filteredProjects: any;
  myDataActiveLink: any;
  searchQuery: string;
  projectsData: any;
  departmentNames: any;
  onDepartmentFilterChange: any;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  projectsData,
  myDataActiveLink,
  departmentNames,
  onDepartmentFilterChange,
  onProjectFilterChange,
  onProjectStatusChange,
  setSearchQuery,
  searchQuery,
  setFilteredProjects,
}) => {
  const [selectedProject, setSelectedProject] = useState<string[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const statusOptions = ["Not Started", "In Progress", "Completed", "On Hold"];

  const handleProjectChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    if (option) {
      const selectedValues = option.selected
        ? [...selectedProject, option.key as string]
        : selectedProject.filter((key) => key !== (option.key as string));
      setSelectedProject(selectedValues);
      onProjectFilterChange(selectedValues);
    }
  };

  const handleDepartmentChange = (
    event: React.FormEvent<HTMLDivElement>,
    option?: IDropdownOption
  ): void => {
    if (option) {
      const selectedValues = option.selected
        ? [...selectedDepartment, option.key as string]
        : selectedDepartment.filter((key) => key !== (option.key as string));
      setSelectedDepartment(selectedValues);
      onDepartmentFilterChange(selectedValues);
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
      onProjectStatusChange(selectedValues);
    }
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedStatus([]);
    setSelectedProject([]);
    setSelectedDepartment([]);
    setFilteredProjects(projectsData);
  };

  return (
    <div>
      <Grid container spacing={1} alignItems="center">
        <Grid item>
          <Label style={{ fontWeight: "600" }}>Project Name</Label>
          <Dropdown
            placeholder="All"
            selectedKeys={selectedProject}
            onChange={handleProjectChange}
            multiSelect
            options={projectsData
              .sort((a: any, b: any) =>
                a.ProjectName.localeCompare(b.ProjectName)
              )
              .map((project: any) => ({
                key: project.ProjectName,
                text: project.ProjectName,
                selected: selectedProject.indexOf(project.ProjectName) > -1,
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
            options={statusOptions
              .sort((a, b) => a.localeCompare(b))
              .map((status) => ({
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

        {myDataActiveLink === "Department" && (
          <Grid item>
            <Label style={{ fontWeight: "600" }}>Department</Label>
            <Dropdown
              placeholder="All"
              selectedKeys={selectedDepartment}
              onChange={handleDepartmentChange}
              multiSelect
              options={departmentNames?.map((departments: any) => ({
                key: departments.DepartmentName,
                text: departments.DepartmentName,
                selected: selectedDepartment.indexOf(status) > -1,
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
            placeholder={
              myDataActiveLink === "Department"
                ? "Search by project, status and department"
                : "Search by project, status and reporting manager"
            }
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
                margin: "13px -2px 10px",
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

          <IconButton aria-label="Reset" onClick={resetFilters}   styles={{
              root: {
                height: 31,
                width: 31, 
                marginLeft: 10,
                border: '1px solid rgba(0, 0, 0, 0.4)',
                backgroundColor: '#ffffff',
                marginBottom: 10,
                marginTop:8
              },
            }}>
            <img
              src={require("../../../assets/return.png")}
              alt="Tasks"
              style={{ width: "22px", height: "22px", cursor: "pointer" }}
            />
          </IconButton>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProjectFilters;
