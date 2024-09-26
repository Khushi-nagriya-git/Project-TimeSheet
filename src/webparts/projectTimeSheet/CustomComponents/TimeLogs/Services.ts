import { filter } from "lodash";
import { SPHttpClient } from "../../../..";
import { TimeLogsData } from "./ITimeLogsStats";

export const getTimeLogsListData = async (
  absoluteURL: string,
  spHttpClient: SPHttpClient,
  setTimeLogsData: React.Dispatch<React.SetStateAction<any>>,
  loggedInUserDetails: { Email: string } | null,
  type: string,
  isUserAdmin: boolean,
  isUserReportingManager: boolean
) => {
  let filterQuery = "";
  if (loggedInUserDetails) {
    switch (type) {
      case "TimeLogs":
        filterQuery = `(Author/EMail eq '${loggedInUserDetails.Email}') and (Status eq 'Pending' or Status eq 'Not Submitted' or Status eq 'Rejected')`;
        break;

      case "TimeSheet":
        if (isUserAdmin || isUserReportingManager) {
          filterQuery = `Status eq 'Pending' or Status eq 'Approved' or Status eq 'Rejected'`;
        } else {
          filterQuery = `(Author/EMail eq '${loggedInUserDetails.Email}') and (Status eq 'Pending' or Status eq 'Approved' or Status eq 'Rejected')`;
        }
        break;

      case "MyTimeSheet":
        filterQuery = `(Author/EMail eq '${loggedInUserDetails.Email}') and (Status eq 'Pending' or Status eq 'Approved' or Status eq 'Rejected')`;
        break;

        case "dashBoard":
        filterQuery = ''
        break;  

      default:
        break;
    }
  }

  try {
    const response = await spHttpClient.get(
      `${absoluteURL}/_api/web/lists/GetByTitle('Time Logs')/items?$select=TimelogsId,Author/EMail,Author/Title,JobName,JobId,ProjectName,ProjectId,BillableStatus,Description,Status,LoggedHours,EstimatedHours,Modified,Created&$orderby=Created desc${
        filterQuery ? `&$filter=${filterQuery}` : ""
      }&$expand=Author`,
      SPHttpClient.configurations.v1
    );

    if (response.ok) {
      const data = await response.json();
      if (data.value.length > 0) {
        setTimeLogsData(data.value);
        return data.value;
      }
    } else {
      console.error(
        "Please enter the correct name of the list in the property pane."
      );
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const getLastItemId = async (
  absoluteURL: string,
  spHttpClient: SPHttpClient
): Promise<number> => {
  const requestURL = `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items?$orderby=ID desc&$top=1`;
  const response = await spHttpClient.get(
    requestURL,
    SPHttpClient.configurations.v1,
    {
      headers: {
        Accept: "application/json;odata=nometadata",
        "odata-version": "",
      },
    }
  );
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
  jobsData: any,
  setTimeLogsData: React.Dispatch<React.SetStateAction<any>>
) => {
  const newTimeLogId = await getLastItemId(absoluteURL, spHttpClient);
  localStorage.setItem("TimeLogId", newTimeLogId.toString());
  let estimatedTime = 0;
  for (let i = 0; i < jobsData.length; i++) {
    if (
      jobsData[i].ProjectId === data.ProjectId &&
      jobsData[i].JobId === data.JobId
    ) {
      estimatedTime = jobsData[i].EstimatedHours;
    }
  }
  const listItemData = {
    TimelogsId: newTimeLogId,
    ProjectId: data.ProjectId,
    ProjectName: data.ProjectName,
    JobId: data.JobId,
    JobName: data.JobName,
    BillableStatus: data.BillableStatus,
    Description: data.Description,
    LoggedHours: data.LoggedHours,
    EstimatedHours: estimatedTime,
  };

  const requestURL = `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items`;
  const response = await spHttpClient.post(
    requestURL,
    SPHttpClient.configurations.v1,
    {
      headers: {
        Accept: "application/json;odata=nometadata",
        "Content-type": "application/json;odata=nometadata",
        "odata-version": "",
      },
      body: JSON.stringify(listItemData),
    }
  );
  if (!response.ok) {
    console.error("Error adding Project records");
    return;
  } else {
    // getTimeLogsListData(absoluteURL, spHttpClient, setTimeLogsData );
  }
};

export async function updateRecords(
  spHttpClient: SPHttpClient,
  absoluteURL: string,
  updateType: string,
  LockedMinutes: number,
  updateddata: any, // This can be an array when updating multiple rows
  editTimeLogId: number,
  setUpdateStatus: React.Dispatch<React.SetStateAction<any>>
) {
  let timerTimeLogId;

  if (updateType === "timer") {
    timerTimeLogId = parseInt(localStorage.getItem("TimeLogId") || "0", 10);
  } else {
    timerTimeLogId = editTimeLogId;
  }

  try {
    // Handle multiple updates for updateTimeLogStatusforApproval
    if (updateType === "updateTimeLogStatusforApproval") {
      const updatePromises = updateddata.map(async (timeLog: any) => {
        const response = await spHttpClient.get(
          `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items?$filter=TimelogsId eq ${timeLog.TimelogsId}`,
          SPHttpClient.configurations.v1
        );
        if (response.ok) {
          const data = await response.json();
          if (data.value && data.value.length > 0) {
            const itemToUpdate = data.value[0];
            const itemId = itemToUpdate.ID;
            const listItemData = {
              Status: timeLog.Status,
            };
            const updateEndpoint = `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items(${itemId})`;
            const updateResponse = await spHttpClient.post(
              updateEndpoint,
              SPHttpClient.configurations.v1,
              {
                headers: {
                  Accept: "application/json;odata=nometadata",
                  "Content-type": "application/json;odata=nometadata",
                  "odata-version": "",
                  "IF-MATCH": "*",
                  "X-HTTP-Method": "MERGE",
                },
                body: JSON.stringify(listItemData),
              }
            );
            if (updateResponse.ok) {
              setUpdateStatus(true);
            }
            if (!updateResponse.ok) {
              console.log("Error updating item:", updateResponse.statusText);
            }
          } else {
            console.log("No item found with the specified TimelogsId.");
          }
        } else {
          console.log("Error fetching item:", response.statusText);
        }
      });

      await Promise.all(updatePromises);
    } else if (updateType === "TimeLogforApproval") {
      const updatePromises = updateddata.map(async (timeLog: any) => {
        // Fetch the existing item data for each time log
        const response = await spHttpClient.get(
          `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items?$filter=TimelogsId eq ${timeLog.TimelogsId}`,
          SPHttpClient.configurations.v1
        );

        if (response.ok) {
          const data = await response.json();
          if (data.value && data.value.length > 0) {
            const itemToUpdate = data.value[0];
            const itemId = itemToUpdate.ID;
            const listItemData = {
              Status: timeLog.Status,
            };
            const updateEndpoint = `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items(${itemId})`;
            const updateResponse = await spHttpClient.post(
              updateEndpoint,
              SPHttpClient.configurations.v1,
              {
                headers: {
                  Accept: "application/json;odata=nometadata",
                  "Content-type": "application/json;odata=nometadata",
                  "odata-version": "",
                  "IF-MATCH": "*",
                  "X-HTTP-Method": "MERGE",
                },
                body: JSON.stringify(listItemData),
              }
            );
            if (updateResponse.ok) {
              // alert("TimeSheet Approved");
              
              setUpdateStatus(true);
            }
            if (!updateResponse.ok) {
              console.log("Error updating item:", updateResponse.statusText);
            }
          } else {
            console.log("No item found with the specified TimelogsId.");
          }
        } else {
          console.log("Error fetching item:", response.statusText);
        }
      });

      await Promise.all(updatePromises);
    }
    if (updateType === "TimeLogforRejection") {
      const updatePromises = updateddata.map(async (timeLog: any) => {
        // Fetch the existing item data for each time log
        const response = await spHttpClient.get(
          `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items?$filter=TimelogsId eq ${timeLog.TimelogsId}`,
          SPHttpClient.configurations.v1
        );

        if (response.ok) {
          const data = await response.json();
          if (data.value && data.value.length > 0) {
            const itemToUpdate = data.value[0];
            const itemId = itemToUpdate.ID;
            const listItemData = {
              Status: timeLog.Status,
            };
            const updateEndpoint = `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items(${itemId})`;
            const updateResponse = await spHttpClient.post(
              updateEndpoint,
              SPHttpClient.configurations.v1,
              {
                headers: {
                  Accept: "application/json;odata=nometadata",
                  "Content-type": "application/json;odata=nometadata",
                  "odata-version": "",
                  "IF-MATCH": "*",
                  "X-HTTP-Method": "MERGE",
                },
                body: JSON.stringify(listItemData),
              }
            );
            if (updateResponse.ok) {
              // alert("TimeSheet Reject");
              setUpdateStatus(true);
            }
            if (!updateResponse.ok) {
              console.log("Error updating item:", updateResponse.statusText);
            }
          } else {
            console.log("No item found with the specified TimelogsId.");
          }
        } else {
          console.log("Error fetching item:", response.statusText);
        }
      });

      await Promise.all(updatePromises);
    } else {
      // Single item update for other types
      const response = await spHttpClient.get(
        `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items?$filter=TimelogsId eq ${timerTimeLogId}`,
        SPHttpClient.configurations.v1
      );

      if (response.ok) {
        const data = await response.json();
        if (data.value && data.value.length > 0) {
          const itemToUpdate = data.value[0];
          const itemId = itemToUpdate.ID;

          const listItemData =
            updateType === "timer"
              ? { LoggedHours: LockedMinutes }
              : {
                  ProjectId: updateddata.ProjectId,
                  ProjectName: updateddata.ProjectName,
                  JobId: updateddata.JobId,
                  JobName: updateddata.JobName,
                  BillableStatus: updateddata.BillableStatus,
                  Description: updateddata.Description,
                  LoggedHours: updateddata.LoggedHours,
                  EstimatedHours: updateddata.EstimatedHours,
                };

          const updateEndpoint = `${absoluteURL}/_api/web/lists/getbytitle('Time Logs')/items(${itemId})`;
          const updateResponse = await spHttpClient.post(
            updateEndpoint,
            SPHttpClient.configurations.v1,
            {
              headers: {
                Accept: "application/json;odata=nometadata",
                "Content-type": "application/json;odata=nometadata",
                "odata-version": "",
                "IF-MATCH": "*",
                "X-HTTP-Method": "MERGE",
              },
              body: JSON.stringify(listItemData),
            }
          );

          if (!updateResponse.ok) {
            console.log("Error updating item:", updateResponse.statusText);
          }
        } else {
          console.log("No item found with the specified TimelogsId.");
        }
      } else {
        console.log("Error fetching item:", response.statusText);
      }
    }
  } catch (error) {
    console.log("Error fetching item:", error);
  }
}

export const deleteTimelog = async (
  absoluteURL: string,
  spHttpClient: SPHttpClient,
  timelogId: number,
  setTimeLogsData: React.Dispatch<React.SetStateAction<any>>
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
        console.error(
          "Item does not exist. It may have been deleted by another user."
        );
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
            "IF-MATCH": "*",
          },
        }
      );
      if (deleteResponse.ok) {
      } else {
        console.error(
          "Failed to delete project. Status:",
          deleteResponse.status
        );
      }
    } else {
      console.error("Failed to fetch item. Status:", getResponse.status);
    }
  } catch (error) {
    console.error("Error deleting project:", error);
  }
};
