
export interface LoggedInUserDetails {
    Title: string;
    Id: any;
    Email: string;
    Groups:[{Title:string,Id:number}];
}

export interface ProjectManager {
    name: string;
    cost: number;
  }

export interface ProjectsData {
    ProjectName: string;
    ProjectId: number;
    ClientName: string;
    ProjectCost: number;
    ReportingManager: {};
    ProjectManager:ProjectManager[];
    ProjectTeam: ProjectManager[];
    Department: string;
    ProjectType: string;
    Description:string;
    Attachment:any;
    ProjectStatus:string;
}

export const initialLoggedInUserDetails: LoggedInUserDetails = {
    Title: "",
    Id: 0,
    Email: "",
    Groups: [{Title:'',Id:0}]
};

const initialProjectsData: ProjectsData = {
    ProjectName: "",
    ProjectId: 0,
    ClientName: "",
    ProjectCost: 0,
    ReportingManager: {},
    ProjectManager: [],
    ProjectTeam: [],
    Department: "",
    ProjectType: "",
    Description:"",
    Attachment:undefined,
    ProjectStatus:""
};

export const projectsInitialState = {
    projectsData: [initialProjectsData],
    loggedInUserDetails: initialLoggedInUserDetails,
};
