export interface JobAssginees {
    name: string;
    email:string;
    id:any;
    estimatedHours:number;
    loggedHours:number;
  }

export interface JobFormData {
    jobName: string;
    jobId: number;
    projectName: string;
    projectId: string | number | undefined;
    startDate: any;
    endDate: any;
    JobAssigness:JobAssginees[];
    description:string;
    billableStatus:string;
    jobStatus: string;
    estimatedHours:number;
    loggedHours:number;
    attachment:any;
    AssignedToPeoplePicker:any;
}

const initialJobFormData: JobFormData = {
    jobName: "",
    jobId: 0,
    projectName: "",
    projectId: 0,
    startDate: null,
    endDate: null,
    JobAssigness:[],
    description: "",
    billableStatus:"",
    jobStatus: "",
    estimatedHours:0,
    loggedHours:0,
    attachment:undefined,
    AssignedToPeoplePicker:''
};

export const initialState = {
    jobFormData: initialJobFormData
};
