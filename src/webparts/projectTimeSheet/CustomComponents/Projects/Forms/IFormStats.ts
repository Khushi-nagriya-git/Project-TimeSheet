export interface ProjectManager {
    id: any;
    name: string;
    cost: number;
  }

export interface CustomFormData {
    projectName: string;
    projectId: number;
    clientName: string;
    projectCost: number;
    ReportingManager: {};
    projectManager:ProjectManager[];
    projectTeam: ProjectManager[];
    department: string;
    projectType: string;
    description:string;
    attachment:any;
    projectStatus: string;
    ReportingManagerPeoplePicker:any;
    ProjectTeamPeoplePicker:any;
    ProjectManagerPeoplePicker:any;
}

const initialFormData: CustomFormData = {
    projectName: "",
    projectId: 0,
    clientName: "",
    projectCost: 0,
    ReportingManager: {},
    projectManager: [],
    projectTeam: [],
    department: "",
    projectType: "",
    description:"",
    attachment:undefined,
    projectStatus:"Not Started",
    ReportingManagerPeoplePicker:'',
    ProjectManagerPeoplePicker:'',
    ProjectTeamPeoplePicker:''
};

export const initialState = {
    formData: initialFormData
};
