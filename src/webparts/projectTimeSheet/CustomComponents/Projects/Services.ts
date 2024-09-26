import {CustomFormData,initialState,SPHttpClient} from "../../../../index";

interface ISPHttpClientOptions {
  headers?: { [key: string]: string };
  body?: any;
}

export const getLoggedInUserData = async (spHttpClient: SPHttpClient, absoluteURL: string) => {
  try {
    const response = await spHttpClient.get(
        `${absoluteURL}/_api/web/currentuser?$select=Title,Email,Id&$expand=groups`,
        SPHttpClient.configurations.v1,
        {
            headers: {
                Accept: "application/json;odata=nometadata",
                "odata-version": "",
            },
        }
    );
    if (response.ok) {
        const responseJSON = await response.json();
        return responseJSON;
    } else {
        console.log("No data found");
        return null;
    }
} catch (error) {
    console.log("Error:", error);
    return null;
}
};

export const getDepartments = async (
  absoluteURL: string,
  spHttpClient: SPHttpClient,
  setDepartmentNames: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
      const response = await spHttpClient.get(
          `${absoluteURL}/_api/web/lists/GetByTitle('Departments')/items?$select=DepartmentName`,
          SPHttpClient.configurations.v1
      );
      if (response.ok) {
        const data = await response.json();
        if (data.value.length > 0) {
          setDepartmentNames(data.value);
        }
      } else {
          console.log("Please enter the correct name of the list in the property pane.");
      }
  } catch (error) {
      console.log("Error fetching data:", error);
  }
};

export const getProjectListData = async (
  absoluteURL: string,
  spHttpClient: SPHttpClient,
  setProjectsData: React.Dispatch<React.SetStateAction<any>>,
  loggedInUserDetails:any,
  isUserAdmin:any
) => {

  let filterQuery = "";
  if(isUserAdmin){
    filterQuery = ""; 
  }else{
  filterQuery = `ProjectManagerPeoplePicker/EMail eq '${loggedInUserDetails.Email}' or ProjectTeamPeoplePicker/EMail eq '${loggedInUserDetails.Email}'  or ReportingManagerPeoplePicker/EMail eq '${loggedInUserDetails.Email}'`;
  }
  try {
    const response = await spHttpClient.get(
      `${absoluteURL}/_api/web/lists/GetByTitle('Projects')/items?$select=ProjectName,ProjectId,ProjectType,ClientName,ProjectHours,ProjectCost,ReportingManager,ProjectManager,ProjectTeam,DepartmentsORTeam,Description,Attachments,ProjectStatus,ProjectManagerPeoplePicker/Title,ProjectManagerPeoplePicker/EMail,ProjectTeamPeoplePicker/Title,ProjectTeamPeoplePicker/EMail,ReportingManagerPeoplePicker/Title,ReportingManagerPeoplePicker/Id,ReportingManagerPeoplePicker/EMail&$expand=ProjectManagerPeoplePicker,ProjectTeamPeoplePicker,ReportingManagerPeoplePicker,AttachmentFiles&$filter=${filterQuery}`,
       SPHttpClient.configurations.v1
    );
      if (response.ok) {
        const data = await response.json();
        if (data.value.length > 0) {
          setProjectsData(data.value);
          return data.value;
        }
      } else {
          console.log("Please enter the correct name of the list in the property pane.");
      }
  } catch (error) {
      console.log("Error fetching data:", error);
  }
};

export const getLastItemId = async (absoluteURL: string, spHttpClient: SPHttpClient): Promise<number> => {
  const requestURL = `${absoluteURL}/_api/web/lists/getbytitle('Projects')/items?$orderby=ID desc&$top=1`;
  const response = await spHttpClient.get(requestURL, SPHttpClient.configurations.v1, {
    headers: {
      Accept: "application/json;odata=nometadata",
      "odata-version": "",
    },
  });
  if (!response.ok) {
    console.error("Error fetching the last item");
    return 0;
  }
  const data = await response.json();
  let id = 0;
  if (data.value.length > 0) {
    id = data.value[0].ProjectId + 1;
  } else {
    id = 101;
  }
  return id;
};

export const addProjects = async (
  data: CustomFormData,
  absoluteURL: string,
  spHttpClient: SPHttpClient
) => {
  const newProjectId = await getLastItemId(absoluteURL, spHttpClient);

  const ProjectTeamPeoplePickerIds = 
  Array.isArray(data.ProjectTeamPeoplePicker) && data.ProjectTeamPeoplePicker.length > 0
    ? data.ProjectTeamPeoplePicker.map((person: { id: number }) => person?.id)
    : [];
  const ProjectManagerPeoplePickerId = data.ProjectManagerPeoplePicker?.[0]?.id;
  const ReportingManagerPeoplePickerId = data.ReportingManagerPeoplePicker?.[0]?.id;
  const listItemData = { '__metadata': { 'type': "SP.Data.ProjectsListItem" },
    ProjectName: data.projectName,
    ProjectId: newProjectId,
    ClientName: data.clientName,
    ProjectCost: data.projectCost,
    ProjectHours: data.projectHours,
    ReportingManager: JSON.stringify([data.ReportingManager]),
    ProjectManager: JSON.stringify(data.projectManager),
    ProjectTeam: JSON.stringify(data.projectTeam),
    ProjectTeamPeoplePickerId: {results: ProjectTeamPeoplePickerIds}, 
    ProjectManagerPeoplePickerId: ProjectManagerPeoplePickerId, 
    ReportingManagerPeoplePickerId:  ReportingManagerPeoplePickerId,
    DepartmentsORTeam: data.department,
    Description: data.description,
    ProjectType: data.projectType,
    ProjectStatus: data.projectStatus
  };

  const requestURL = `${absoluteURL}/_api/web/lists/getbytitle('Projects')/items`;
  const response = await spHttpClient.post(requestURL, SPHttpClient.configurations.v1, {
    headers: {
      Accept: "application/json;odata=verbose",
      "Content-type": "application/json;odata=verbose",
      "odata-version": "",
    },
    body: JSON.stringify(listItemData),
  });
  if (!response.ok) {
    console.error("Error adding Project records");
    return;
  }

  const item: any = await response.json();
  const itemId = item.d?.ID || item.ID;
  if (data.attachment) {
    const attachmentResponse = await handleUploadAttachment(itemId, data.attachment, absoluteURL, spHttpClient);
    if (!attachmentResponse.ok) {
      console.error("Error uploading attachment");
      return;
    }
  }

};

export const handleUploadAttachment = async (
  itemId: number,
  file: File,
  absoluteURL: string,
  spHttpClient: SPHttpClient
) => {
  const attachmentURL = `${absoluteURL}/_api/web/lists/getbytitle('Projects')/items(${itemId})/AttachmentFiles/add(FileName='${file.name}')`;
  const options: ISPHttpClientOptions = {
    body: file,
    headers: {
      Accept: "application/json;odata=nometadata",
      "Content-type": file.type,
      "odata-version": "",
    },
  };
  return spHttpClient.post(attachmentURL, SPHttpClient.configurations.v1, options);
};

export const deleteProject = async (
  absoluteURL: string,
  spHttpClient: SPHttpClient,
  projectId: number,
  setProjectsData: React.Dispatch<React.SetStateAction<any>>,
) => {
  
  try {
    // First, get the internal ID based on the ProjectId
    const getResponse = await spHttpClient.get(
      `${absoluteURL}/_api/web/lists/getbytitle('Projects')/items?$filter=ProjectId eq ${projectId}`,
      SPHttpClient.configurations.v1
    );

    if (getResponse.ok) {
      const data = await getResponse.json();
      const items = data.value;
      
      if (items.length === 0) {
        console.error("Item does not exist. It may have been deleted by another user.");
        return;
      }

      const internalId = items[0].ID;
      
      // Then, delete the item using the internal ID
      const deleteResponse = await spHttpClient.post(
        `${absoluteURL}/_api/web/lists/getbytitle('Projects')/items(${internalId})`,
        SPHttpClient.configurations.v1,
        {
          headers: {
            "X-HTTP-Method": "DELETE",
            "IF-MATCH": "*"
          }
        }
      );

      if (deleteResponse.ok) {
        // Refresh project data after deletion
      } else {
        console.error("Failed to delete project. Status:", deleteResponse.status);
      }
    } else {
      console.error("Failed to fetch item. Status:", getResponse.status);
    }
  } catch (error) {
    console.error("Error deleting project:", error);
  }
};

export async function updateUserRecords(
  spHttpClient: SPHttpClient,
  absoluteURL: string,
  projectId: number,
  updateformData: CustomFormData,
  setProjectsData: React.Dispatch<React.SetStateAction<any>>,
  setCurrentData:  React.Dispatch<React.SetStateAction<any>>,
) {
  
  try {
      const response = await spHttpClient.get(
          `${absoluteURL}/_api/web/lists/getbytitle('Projects')/items?$filter=ProjectId eq ${projectId}`,
          SPHttpClient.configurations.v1
      );
      if (response.ok) {
          const data = await response.json(); 
          if (data.value && data.value.length > 0) {

              const itemToUpdate = data.value[0];
              if(updateformData.projectManager.length === 0 ) {
                updateformData.projectManager = JSON.parse(data.value[0].ProjectManager);
              }
              if(updateformData.projectTeam.length === 0){
                updateformData.projectTeam = JSON.parse(data.value[0].ProjectTeam);
              }
            
              const ProjectManagerPeoplePickerId = updateformData.projectManager?.[0]?.id;
              let ReportingManagerPeoplePickerId =  updateformData.ReportingManagerPeoplePicker?.[0]?.id;
              if(updateformData.ReportingManagerPeoplePicker){
                ReportingManagerPeoplePickerId=ReportingManagerPeoplePickerId
              }else{
                ReportingManagerPeoplePickerId = ReportingManagerPeoplePickerId;
              }
              const ProjectTeamPeoplePickerIds = 
              Array.isArray(updateformData.projectTeam) && updateformData?.projectTeam.length > 0
                ? updateformData?.projectTeam?.map((person: { id: number }) => person?.id)
                : [];
              let listItemData = {'__metadata': { 'type': "SP.Data.ProjectsListItem" },
                ProjectName: updateformData.projectName,
                ClientName: updateformData.clientName,
                ProjectCost: updateformData.projectCost, 
                ProjectHours: updateformData.projectHours,
                ReportingManager: JSON.stringify(updateformData.ReportingManager),
                ProjectManager: JSON.stringify(updateformData.projectManager),
                ProjectTeam: JSON.stringify(updateformData.projectTeam),
                ProjectTeamPeoplePickerId: {results: ProjectTeamPeoplePickerIds}, 
                ProjectManagerPeoplePickerId: ProjectManagerPeoplePickerId,
                ReportingManagerPeoplePickerId:  ReportingManagerPeoplePickerId,
                DepartmentsORTeam: updateformData.department,
                Description: updateformData.description,
                ProjectType: updateformData.projectType,
                ProjectStatus: updateformData.projectStatus
              };
              const itemId = itemToUpdate.ID;
              const updateEndpoint = `${absoluteURL}/_api/web/lists/getbytitle('Projects')/items(${itemId})`;
              const updateResponse = await spHttpClient.post(updateEndpoint, SPHttpClient.configurations.v1, {
                  headers: {
                      Accept: "application/json;odata=verbose",
                      "Content-type": "application/json;odata=verbose",
                      "odata-version": "",
                      "IF-MATCH": "*",
                      "X-HTTP-Method": "MERGE",
                  },
                  body: JSON.stringify(listItemData),
              });
              if (updateResponse.ok) {
                setCurrentData(initialState.formData);
              } else {
                  console.log("Error updating item:", updateResponse.statusText);
              }
          } else {
              console.log("No item found with the specified EmployeeID.");
          }
      } else {
          console.log("Error fetching item:", response.statusText);
      }
  } catch (error) {
      console.log("Error fetching item:", error);
  }
}