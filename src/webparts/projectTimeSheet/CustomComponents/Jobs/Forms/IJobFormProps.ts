import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IJobFormProps {
    spHttpClient: any;
    absoluteURL: any;
    context: WebPartContext;
    projectsData:any;
    mode:any;
    setAddFormOpen:React.Dispatch<React.SetStateAction<any>>;
    drawerOpen:boolean;
    setDrawerOpen:React.Dispatch<React.SetStateAction<any>>;
    setMode:React.Dispatch<React.SetStateAction<any>>;
    onSubmit:any;
    initialData:any;
    peoplePickerDefaultTeam:any;
}
