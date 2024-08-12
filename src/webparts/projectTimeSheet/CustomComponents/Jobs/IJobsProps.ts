import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IJobsProps {
    spHttpClient: any;
    absoluteURL: any;
    context: WebPartContext;
    setModuleTab: React.Dispatch<React.SetStateAction<any>>;
    loggedInUserDetails:any;
    isUserProjectTeam:any;
    isUserAdmin:any;
    isUserProjectManager:any;
    isUserReportingManager:any;
}
