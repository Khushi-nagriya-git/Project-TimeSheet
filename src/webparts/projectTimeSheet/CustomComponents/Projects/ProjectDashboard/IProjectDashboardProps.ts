import { WebPartContext } from "@microsoft/sp-webpart-base";
export interface IProjectDashboardProps {
  projectId:number;
  isDashBoardOpen:boolean;
  handleClose:any;
}
