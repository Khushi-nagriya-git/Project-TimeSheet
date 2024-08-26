export interface TimeLogsData {
   TimelogsId:number;
   ProjectId:number;
   ProjectName:string;
   JobId:number;
   JobName:string;
   BillableStatus:string;
   Description:string;
   LoggedHours:number;
   EstimatedHours:number;
   Status:string;
   Created:'';
   CreatedBy:any;
}

export interface CurrentUserDetails {
   Title: string;
   Id: any;
   email: string;
   groups:[];
}

const initialUserData: CurrentUserDetails = {
   Title: '',
   Id: 0,
   email: '',
   groups:[]
}

const initialTimeLogsData: TimeLogsData = {
   TimelogsId:0,
   ProjectId:0,
   ProjectName:'',
   JobId:0,
   JobName:'',
   BillableStatus:'',
   Description:'',
   LoggedHours:0,
   EstimatedHours:0,
   Status:'',
   Created:'',
   CreatedBy:''
};

export const timeLogsDataInitialState = {
   timeLogsData: initialTimeLogsData,
   currentUserData : initialUserData
};
