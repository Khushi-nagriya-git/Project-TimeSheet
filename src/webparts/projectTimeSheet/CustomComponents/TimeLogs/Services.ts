import { SPHttpClient } from "../../../..";
import { TimeLogsData } from "./ITimeLogsStats";

export const getTimeLogsListData = async (
  absoluteURL: string,
  spHttpClient: SPHttpClient,
  setTimeLogsData: React.Dispatch<React.SetStateAction<any>>
) => {
  try {
    const response = await spHttpClient.get(
      `${absoluteURL}/_api/web/lists/GetByTitle('Time Logs')/items?$select=TimelogsId,JobName,JobId,ProjectName,ProjectId,BillableStatus,Description,LoggedHours,EstimatedHours,Modified,Created,User&$orderby=Created desc`,
      SPHttpClient.configurations.v1
    );
    if (response.ok) {
      const data = await response.json();
      if (data.value.length > 0) {
        setTimeLogsData(data.value);
      }
    } else {
      console.log("Please enter the correct name of the list in the property pane.");
    }
  } catch (error) {
    console.log("Error fetching data:", error);
  }
};


export const getLastItemId = async (absoluteURL: string, spHttpClient: SPHttpClient): Promise<number> => {
  const requestURL = `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items?$orderby=ID desc&$top=1`;
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
    id = data.value[0].TimelogsId + 1;
  } else {
    id = 101;
  }
  return id;
};

export const addTimeLogs = async (
  data: TimeLogsData,
  absoluteURL: string,
  spHttpClient: SPHttpClient,
  jobsData:any,
  setTimeLogsData:React.Dispatch<React.SetStateAction<any>>
) => {
  const newTimeLogId = await getLastItemId(absoluteURL, spHttpClient);
  localStorage.setItem("TimeLogId", newTimeLogId.toString());
  let estimatedTime = 0 ;
  for (let i = 0; i < jobsData.length; i++) {
    if (jobsData[i].ProjectId === data.ProjectId && jobsData[i].JobId === data.JobId) {
      estimatedTime = jobsData[i].EstimatedHours
    }
  }
  const listItemData = {
    TimelogsId: newTimeLogId,
    ProjectId:data.ProjectId,
    ProjectName:data.ProjectName,
    JobId:data.JobId,
    JobName:data.JobName,
    BillableStatus:data.BillableStatus,
    Description:data.Description,
    LoggedHours:data.LoggedHours,
    EstimatedHours:estimatedTime,
    DetailLogs:JSON.stringify(data.DetailLogs)
    };

  const requestURL = `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items`;
  const response = await spHttpClient.post(requestURL, SPHttpClient.configurations.v1, {
    headers: {
      Accept: "application/json;odata=nometadata",
      "Content-type": "application/json;odata=nometadata",
      "odata-version": "",
    },
    body: JSON.stringify(listItemData),
  });
  if (!response.ok) {
    console.error("Error adding Project records");
    return;
  }else{
    getTimeLogsListData(absoluteURL, spHttpClient, setTimeLogsData);
  }
};

export async function updateRecords(
  spHttpClient: SPHttpClient,
  absoluteURL: string,
  updateType:string,
  LockedMinutes:number,
  setTimeLogsData: React.Dispatch<React.SetStateAction<any>>,
  updateddata : any,
  editTimeLogId : number
) {
  let timerTimeLogId;
  if(updateType === "timer"){
    timerTimeLogId = parseInt(localStorage.getItem("TimeLogId") || "0", 10);
  }else{
    timerTimeLogId = editTimeLogId
  }
  let listItemData;
  try {
      const response = await spHttpClient.get(
          `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items?$filter=TimelogsId eq ${timerTimeLogId}`,
          SPHttpClient.configurations.v1
      );
      if (response.ok) {
          const data = await response.json(); 
          if (data.value && data.value.length > 0) {
              const itemToUpdate = data.value[0];
              if(updateType === 'timer'){
              listItemData = {
                LoggedHours: LockedMinutes
              };
            }else{
              listItemData = {
                ProjectId:updateddata.ProjectId,
                ProjectName:updateddata.ProjectName,
                JobId:updateddata.JobId,
                JobName:updateddata.JobName,
                BillableStatus:updateddata.BillableStatus,
                Description:updateddata.Description,
                LoggedHours:updateddata.LoggedHours,
                EstimatedHours:updateddata.EstimatedHours,
                DetailLogs:JSON.stringify(data.DetailLogs)
              };
            }
              const itemId = itemToUpdate.ID;
              const updateEndpoint = `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items(${itemId})`;
              const updateResponse = await spHttpClient.post(updateEndpoint, SPHttpClient.configurations.v1, {
                  headers: {
                      Accept: "application/json;odata=nometadata",
                      "Content-type": "application/json;odata=nometadata",
                      "odata-version": "",
                      "IF-MATCH": "*",
                      "X-HTTP-Method": "MERGE",
                  },
                  body: JSON.stringify(listItemData),
              });
              if (updateResponse.ok) {
                await getTimeLogsListData(absoluteURL, spHttpClient, setTimeLogsData);
                
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

export const deleteTimelog = async (
  absoluteURL: string,
  spHttpClient: SPHttpClient,
  timelogId: number,
  setTimeLogsData: React.Dispatch<React.SetStateAction<any>>,
) => {
  
  try {
    // First, get the internal ID based on the ProjectId
    const getResponse = await spHttpClient.get(
      `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items?$filter=TimelogsId eq ${timelogId}`,
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
        `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items(${internalId})`,
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
        getTimeLogsListData(absoluteURL, spHttpClient, setTimeLogsData);
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