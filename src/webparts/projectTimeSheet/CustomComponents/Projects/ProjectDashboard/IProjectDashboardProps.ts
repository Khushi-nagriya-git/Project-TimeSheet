import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IProjectDashboardProps {
    spHttpClient: any;
    absoluteURL: any;
    context: WebPartContext;
    isUserAdmin:any;
    loggedInUserDetails:any;

}
