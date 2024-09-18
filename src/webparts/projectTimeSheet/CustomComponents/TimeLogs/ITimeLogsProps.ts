import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface ITimeLogsProps {
    spHttpClient: any;
    absoluteURL: any;
    context: WebPartContext;
    loggedInUserDetails:any;
    isUserProjectTeam:any;
    isUserAdmin:any;
    isUserProjectManager:any;
    isUserReportingManager:any;
}