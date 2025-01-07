import { WebPartContext } from "@microsoft/sp-webpart-base";
import { CustomFormData } from "./IFormStats";

export interface IFormProps {
  mode: "add" | "edit";
  initialData?: CustomFormData;
  onSubmit: (data: CustomFormData) => void;
  spHttpClient: any;
  absoluteURL: any;
  context: WebPartContext;
  open: boolean;
  setAddFormOpen: React.Dispatch<React.SetStateAction<boolean>>;
  peoplePickerDefaultManager: any;
  peoplePickerDefaultReportingManager: any;
  peoplePickerDefaultTeam: any;
  departmentNames: any;
}
