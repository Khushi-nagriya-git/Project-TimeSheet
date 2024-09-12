export interface JobAssginees {
    name: string;
    cost: number;
    estimatedHours:number;
  }

export interface JobsData {
    JobName: string;
    JobId: number;
    ProjectName: string;
    ProjectId: any;
    StartDate: any;
    EndDate: any;
    JobAssginees:JobAssginees[];
    Description:string;
    BillableStatus:string;
    JobStatus: string;
    EstimatedHours:number;
    loggedHours:number;
    Attachment:any;
    AssignedToPeoplePicker:[{EMail:string , Title :string}];
    Author:{EMail:string,Title:string}
}

export const initialJobsData: JobsData = {
    JobName: "",
    JobId: 0,
    ProjectName: "",
    ProjectId: null ,
    StartDate: null,
    EndDate: null,
    JobAssginees:[],
    Description: "",
    BillableStatus:"",
    JobStatus: "",
    EstimatedHours:0,
    loggedHours:0,
    Attachment:undefined,
    AssignedToPeoplePicker:[{EMail:'' , Title :''}],
    Author:{EMail:'',Title:""}

};


export const jobsInitialState = {
    jobsData: [initialJobsData]
};
