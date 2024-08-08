import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IProjectProps {
    spHttpClient: any;
    absoluteURL: any;
    context: WebPartContext;
    setModuleTab :React.Dispatch<React.SetStateAction<any>>;
   
}
