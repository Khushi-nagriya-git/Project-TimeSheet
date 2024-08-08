export interface ProjectManager {
    name: string;
    cost: number;
  }

export interface CustomFormData {
    projectName: string;
    projectId: number;
    clientName: string;
    projectCost: number;
    reportingManager: {};
    projectManager:ProjectManager[];
    projectTeam: ProjectManager[];
    department: string;
    projectType: string;
    description:string;
    attachment:any;
    projectStatus: string;
}

const initialFormData: CustomFormData = {
    projectName: "",
    projectId: 0,
    clientName: "",
    projectCost: 0,
    reportingManager: {},
    projectManager: [],
    projectTeam: [],
    department: "",
    projectType: "",
    description:"",
    attachment:undefined,
    projectStatus:"Not Started"
};

export const initialState = {
    formData: initialFormData
};
