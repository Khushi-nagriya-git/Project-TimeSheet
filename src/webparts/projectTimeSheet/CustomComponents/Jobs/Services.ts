import { SPHttpClient } from "@microsoft/sp-http";
import { JobFormData, initialState } from "../Jobs/Forms/IJobFormStats";

interface ISPHttpClientOptions {
  headers?: { [key: string]: string };
  body?: any;
}

export const getJobListData = async ( absoluteURL: string, spHttpClient: SPHttpClient, setJobsData: React.Dispatch<React.SetStateAction<any>>, loggedInUserDetails: any, projectsData: any, isUserAdmin: any) => {
  try {
    let response: any;
    if (isUserAdmin) {
      response = await spHttpClient.get( `${absoluteURL}/_api/web/lists/GetByTitle('Tasks')/items?$select=JobName,JobId,ProjectName,ProjectId,AssignedTo,Author/EMail,Author/Title,AssignedToPeoplePicker/Title,AssignedToPeoplePicker/EMail,StartDate,EndDate,Description,JobStatus,BillableStatus,Attachments,EstimatedHours,loggedHours&$expand=AssignedToPeoplePicker,AttachmentFiles,Author`, SPHttpClient.configurations.v1 );
    } else {
      const projectIds = projectsData?.map((project: any) => project.ProjectId);
      const projectFilterQuery = projectIds  ?.map((id: string) => `ProjectId eq '${id}'`)  .join(" or ");
      response = await spHttpClient.get(`${absoluteURL}/_api/web/lists/GetByTitle('Tasks')/items?$select=JobName,JobId,ProjectName,ProjectId,AssignedTo,AssignedToPeoplePicker/Title,AssignedToPeoplePicker/EMail,StartDate,EndDate,Description,JobStatus,BillableStatus,Attachments,EstimatedHours,Author/EMail,Author/Title,loggedHours&$expand=AssignedToPeoplePicker,AttachmentFiles,Author&$filter=${projectFilterQuery}`, SPHttpClient.configurations.v1  );
    }
    if (response.ok) {
      const data = await response.json();
      if (data.value.length > 0) {
        setJobsData(data.value);
      }
    } else {
     // console.log( "Please enter the correct name of the list in the property pane." );
    }
  } catch (error) {
   // console.log("Error fetching data:", error);
  }
};

export const getLastJobId = async (absoluteURL: string,spHttpClient: SPHttpClient): Promise<number> => {
  const requestURL = `${absoluteURL}/_api/web/lists/getbytitle('Tasks')/items?$orderby=ID desc&$top=1`;
  const response = await spHttpClient.get( requestURL, SPHttpClient.configurations.v1, { headers: {  Accept: "application/json;odata=nometadata", "odata-version": "", }, } );
  if (!response.ok) {
     //console.error("Error fetching the last item"); 
     return 0;
  }
  const data = await response.json();
  let id = 0;
  if (data.value.length > 0) {
    id = data.value[0].JobId + 1;
  } else {
    id = 101;
  }
  return id;
};

export const convertToMinutes = (value: number): number => {
  const hours = Math.floor(value);
  const decimals = value - hours;
  let minutesFromDecimals = 0;
  if (decimals === 0.25) {
    minutesFromDecimals = 15;
  } else if (decimals === 0.5) {
    minutesFromDecimals = 30;
  } else if (decimals === 0.75) {
    minutesFromDecimals = 45;
  }
  return hours * 60 + minutesFromDecimals;
};

export const addJobs = async ( data: JobFormData, absoluteURL: string, spHttpClient: SPHttpClient) => {
  const newJobId = await getLastJobId(absoluteURL, spHttpClient);
  let final = 0;
  data.JobAssigness.map((index) => {  final += convertToMinutes(index.estimatedHours);});
  let status =  data.jobStatus === "NotStarted"  ? "Not Started"  : data.jobStatus === "InProgress"  ? "In Progress"  : data.jobStatus === "OnHold"  ? "On Hold"  : data.jobStatus === "" ? "Not Started" : "";
  const assignedToPeoplePickerIds = data.JobAssigness.map( (person: { id: number }) => person.id );
  const listItemData = {
    __metadata: { type: "SP.Data.TasksListItem" },
    JobName: data.jobName,
    JobId: newJobId,
    ProjectName: data.projectName,
    ProjectId: data.projectId,
    StartDate: data.startDate,
    EndDate: data.endDate,
    AssignedTo: JSON.stringify(data.JobAssigness),
    AssignedToPeoplePickerId: { results: assignedToPeoplePickerIds },
    Description: data.description,
    BillableStatus: data.billableStatus ? data.billableStatus : "nonbillable",
    JobStatus: status,
    EstimatedHours: final,
    loggedHours: data.loggedHours,
  };

  const requestURL = `${absoluteURL}/_api/web/lists/getbytitle('Tasks')/items`;
  const response = await spHttpClient.post( requestURL, SPHttpClient.configurations.v1, { headers: { Accept: "application/json;odata=verbose", "Content-type": "application/json;odata=verbose", "odata-version": "", }, body: JSON.stringify(listItemData), });
  if (!response.ok) {
    //console.error("Error adding jobs records");
    return;
  }
  const item: any = await response.json();
  const itemId = item.d?.ID || item.ID;
  if (data.attachment) {
    for(let i=0;i<data.attachment.length;i++){
      const attachmentResponse = await handleUploadAttachment(itemId, data.attachment[i], absoluteURL, spHttpClient);
      if (!attachmentResponse.ok) {
       // console.error("Error uploading attachment");
        return;
      }
    }
  }
};

export const handleUploadAttachment = async ( itemId: number, file: any, absoluteURL: string, spHttpClient: SPHttpClient) => {
  let name = file.name? file.name : file.FileName;
  name = file.FileName? file.FileName : file.name
  const attachmentURL = `${absoluteURL}/_api/web/lists/getbytitle('Tasks')/items(${itemId})/AttachmentFiles/add(FileName='${name}')`;
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

const getAttachments = async (absoluteURL: string, itemId: number, spHttpClient: any) => {
  const getAttachmentsEndpoint = `${absoluteURL}/_api/web/lists/getbytitle('Tasks')/items(${itemId})/AttachmentFiles`;
  try {
      const response = await spHttpClient.get(getAttachmentsEndpoint, SPHttpClient.configurations.v1);
      if (!response.ok) {
          throw new Error(`Failed to fetch attachments: ${response.statusText}`);
      }
      const data = await response.json();
      return data.value; 
  } catch (error) {
    //  console.error('Error fetching attachments:', error); // Log error for debugging
      return []; // Return empty array in case of error
  }
};

const deleteAllAttachments = async (absoluteURL: string, itemId: number, spHttpClient: any) => {
  try {
    const attachments = await getAttachments(absoluteURL, itemId, spHttpClient);
    if (attachments.length === 0) {
     // console.warn(`No attachments found for item ID: ${itemId}`);
      return true; 
    }

    for (let i=0;i<attachments.length;i++) {
      const deleteEndpoint = `${absoluteURL}/_api/web/lists/getbytitle('Tasks')/items(${itemId})/AttachmentFiles('${encodeURIComponent(attachments[i].FileName)}')`;
      try {
        const response = await spHttpClient.fetch(deleteEndpoint, SPHttpClient.configurations.v1, {
          method: "POST", // Required to trigger SharePoint's POST-based DELETE
          headers: {
            "Accept": "application/json;odata=verbose",
            "X-HTTP-Method": "DELETE", // Using SharePoint-specific header for deletion
            "IF-MATCH": "*", // Match any etag
          },
        });

        if (response.ok) {
          throw new Error(`Failed to delete attachment ${attachments[i].FileName}: ${response.statusText}`);
        }

       // console.log(`Successfully deleted attachment: ${attachments[i].FileName}`); // Log successful deletion
      } catch (error) {
       // console.error(`Error deleting attachment ${attachments[i].FileName}:`, error); // Log error for debugging
        return false; // Return false if any attachment fails to delete
      }
    }

    return true; // Return true if all attachments are deleted successfully
  } catch (error) {
   // console.error(`Error fetching or deleting attachments for item ${itemId}:`, error);
    return false;
  }
};

export const deleteJobs = async ( absoluteURL: string, spHttpClient: SPHttpClient, jobId: number, setJobsData: React.Dispatch<React.SetStateAction<any>>) => {
  try {
    const getResponse = await spHttpClient.get(`${absoluteURL}/_api/web/lists/getbytitle('Tasks')/items?$filter=JobId eq ${jobId}`, SPHttpClient.configurations.v1);
    if (getResponse.ok) {
      const data = await getResponse.json();
      const items = data.value;
      if (items.length === 0) {
       // console.error( "Item does not exist. It may have been deleted by another user." );
        return;
      }
      const internalId = items[0].ID;
      const deleteResponse = await spHttpClient.post( `${absoluteURL}/_api/web/lists/getbytitle('Tasks')/items(${internalId})`,SPHttpClient.configurations.v1, { headers: {"X-HTTP-Method": "DELETE","IF-MATCH": "*", },} );
      if (deleteResponse.ok) {
        //getJobListData(absoluteURL, spHttpClient, setJobsData);
      } else {
       // console.error("Failed to delete job. Status:", deleteResponse.status);
      }
    } else {
     // console.error("Failed to fetch item. Status:", getResponse.status);
    }
  } catch (error) {
   // console.error("Error deleting project:", error);
  }
};

export async function updateJobRecords( spHttpClient: SPHttpClient, absoluteURL: string, jobId: number, updateformData: any, type: string, setJobsData: React.Dispatch<React.SetStateAction<any>>, setCurrentData: React.Dispatch<React.SetStateAction<any>>, loggedInUserDetails: any) {
  let totalLockedTime = 0;
  let status = updateformData.jobStatus === "NotStarted" ? "Not Started" : updateformData.jobStatus === "InProgress" ? "In Progress" : updateformData.jobStatus === "OnHold" ? "On Hold" : updateformData.jobStatus;
  let listItemData;
  const assignedToPeoplePickerIds = updateformData?.JobAssigness?.map( (person: { id: number }) => person.id);
  let updatedJobAssgineesLoggedHours;
  try {
    const response = await spHttpClient.get( `${absoluteURL}/_api/web/lists/getbytitle('Tasks')/items?$filter=JobId eq ${jobId}`, SPHttpClient.configurations.v1 );
    if (response.ok) {
      const data = await response.json();
      if (data.value && data.value.length > 0) {
        const itemToUpdate = data.value[0];
        if (type === "loggedTimeUpdate") {
          const JobAssginees = JSON.parse(data.value[0].AssignedTo);
          if (JobAssginees && JobAssginees.length >= 0) {
            updatedJobAssgineesLoggedHours = JobAssginees.map(
              (assignee: any) => {
                if (assignee.email === loggedInUserDetails.Email) {
                  totalLockedTime += parseInt(updateformData);
                  return { ...assignee, loggedHours: updateformData };
                }
                totalLockedTime += assignee.loggedHours;
                return assignee;
              }
            );
          }
        }
        if (updateformData.JobAssigness?.length === 0) {
          const jobAssignees = data.value[0]?.JobAssginees;
          if (jobAssignees) {
            updateformData.JobAssigness = JSON.parse(jobAssignees);
          }
        }
        let final = 0;
        updateformData.JobAssigness?.map(
          (index: { estimatedHours: number }) => {
            final += convertToMinutes(index.estimatedHours);
          }
        );
        if (type === "loggedTimeUpdate") {
          listItemData = {
            __metadata: { type: "SP.Data.TasksListItem" },
            loggedHours: totalLockedTime,
            AssignedTo: JSON.stringify(updatedJobAssgineesLoggedHours),
          };
        } else {
          listItemData = {
            __metadata: { type: "SP.Data.TasksListItem" },
            JobName: updateformData.jobName,
            ProjectName: updateformData.projectName,
            StartDate: updateformData.startDate,
            EndDate: updateformData.endDate,
            AssignedTo: JSON.stringify(updateformData.JobAssigness),
            AssignedToPeoplePickerId: { results: assignedToPeoplePickerIds },
            Description: updateformData.description,
            BillableStatus: updateformData.billableStatus,
            JobStatus: status,
            EstimatedHours: final,
          };
        }
        const itemId = itemToUpdate.ID;
        const updateEndpoint = `${absoluteURL}/_api/web/lists/getbytitle('Tasks')/items(${itemId})`;
        const updateResponse = await spHttpClient.post( updateEndpoint, SPHttpClient.configurations.v1, { headers: { Accept: "application/json;odata=verbose", "Content-type": "application/json;odata=verbose","odata-version": "", "IF-MATCH": "*", "X-HTTP-Method": "MERGE",}, body: JSON.stringify(listItemData),} );
        if (updateResponse.ok) {
          //await  getJobListData(absoluteURL, spHttpClient, setJobsData);
          let reponse = await deleteAllAttachments(absoluteURL, itemId, spHttpClient)
          if (updateformData.attachment) {
            for(let i=0;i<updateformData.attachment.length;i++){
              const attachmentResponse = await handleUploadAttachment(itemId, updateformData.attachment[i], absoluteURL, spHttpClient);
              if (!attachmentResponse.ok) {
               // console.error("Error uploading attachment");
                return;
              }
            }
          }
          setCurrentData(initialState.jobFormData);
        } else {
         // console.log("Error updating item:", updateResponse.statusText);
        }
      } else {
       // console.log("No item found with the specified EmployeeID.");
      }
    } else {
     // console.log("Error fetching item:", response.statusText);
    }
  } catch (error) {
   // console.log("Error fetching item:", error);
  }
}
