import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IConfigurationScreenProps {
    spHttpClient: any;
    absoluteURL: any;
    context: WebPartContext;
    loggedInUserDetails:any;
    isUserProjectTeam:any;
    isUserAdmin:any;
    isUserProjectManager:any;
    isUserReportingManager:any;
    title:any;
    configurationListData:any;
    configurationListDataLength:number;
    setReload:React.Dispatch<React.SetStateAction<any>>;
}
