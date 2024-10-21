import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "../../../..";



const getId =async ( absoluteURL:any ,  spHttpClient:any ) => {
  try {
    const response = await spHttpClient.get(
        `${absoluteURL}/_api/web/lists/GetByTitle('Configurations')/items`,
        SPHttpClient.configurations.v1
    );
    if (response.ok) {
      const data = await response.json();
      if (data.value.length > 0) {
        return data.value[0].ID;
      }
    } else {
        console.log("Please enter the correct name of the list in the property pane.");
    }
} catch (error) {
    console.log("Error fetching data:", error);
}
}

export const updateData = async (formData: any, applicationTitle: string, absoluteURL: string, spHttpClient: any) => {
  let itemId = await getId(absoluteURL, spHttpClient);

  const listItemData = {
      __metadata: { type: "SP.Data.ConfigurationsListItem" },
      Permissions: JSON.stringify(formData),
      Title: applicationTitle,
  };

  const updateEndpoint = `${absoluteURL}/_api/web/lists/getbytitle('Configurations')/items(${itemId})`;
  const updateResponse = await spHttpClient.post(updateEndpoint, SPHttpClient.configurations.v1, {
      headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "odata-version": "",
          "IF-MATCH": "*",
          "X-HTTP-Method": "MERGE",
      },
      body: JSON.stringify(listItemData),
  });

  if (updateResponse.ok) {
      if (formData.Attachment) {
          const imageUploadResponse = await handleUploadAttachment(itemId,formData.Attachment, absoluteURL, spHttpClient);
          if (imageUploadResponse) {
              console.log("Image uploaded successfully.");
          } else {
              console.error("Failed to upload image.");
          }
      }
      return true;
  } else {
      console.error("Failed to update item:", updateResponse.statusText);
      return false;
  }
};

export const handleUploadAttachment = async (
  itemId: number,
  file: File,
  absoluteURL: string,
  spHttpClient: SPHttpClient
) => {
  await deleteAllAttachments( absoluteURL , itemId  , spHttpClient)
  const encodedFileName = encodeURIComponent(file.name);
  const uploadEndpoint = `${absoluteURL}/_api/web/lists/getbytitle('Configurations')/items(${itemId})/AttachmentFiles/add(FileName='${encodedFileName}')`;
  const response = await spHttpClient.post(uploadEndpoint, SPHttpClient.configurations.v1, {
      headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": file.type,  
      },
      body: file, 
  });

  const responseBody = await response.json();  

  if (response.ok) {
      return true;  
  } else {
   
      //console.error("Image upload failed:", response.statusText, responseBody);
      return false;  
  }
};
const getAttachments = async (absoluteURL: string, itemId: number, spHttpClient: any) => {
  const getAttachmentsEndpoint = `${absoluteURL}/_api/web/lists/getbytitle('Configurations')/items(${itemId})/AttachmentFiles`;
  
  try {
      const response = await spHttpClient.get(getAttachmentsEndpoint, SPHttpClient.configurations.v1);
      if (!response.ok) {
          throw new Error(`Failed to fetch attachments: ${response.statusText}`);
      }
      const data = await response.json();
      return data.value; // Return the list of attachments
  } catch (error) {
      //console.error("Error fetching attachments:", error);
      return []; // Return empty array on error
  }
};
const deleteAllAttachments = async (absoluteURL: string, itemId: number, spHttpClient: any) => {
  const attachments = await getAttachments(absoluteURL, itemId, spHttpClient);

  // Iterate over all attachments and delete them
  for (const attachment of attachments) {
      const deleteEndpoint = `${absoluteURL}/_api/web/lists/getbytitle('Configurations')/items(${itemId})/AttachmentFiles('${encodeURIComponent(attachment.FileName)}')`;

      try {
          const response = await spHttpClient.post(deleteEndpoint, SPHttpClient.configurations.v1, {
              headers: {
                  Accept: "application/json;odata=verbose",
                  "X-HTTP-Method": "DELETE",
                  "IF-MATCH": "*", // Match any version for deletion
              }
          });

          if (!response.ok) {
              throw new Error(`Failed to delete attachment ${attachment.FileName}: ${response.statusText}`);
          }
      } catch (error) {
          console.error(error); // Log individual attachment deletion errors
          return false; // Return false on the first failure
      }
  }
  //console.log("All attachments deleted.");
  return true;
};


export const addData = async (formData:any , applicationTitle:string , absoluteURL:any ,  spHttpClient:any  ) => {

  const listItemData = {
    __metadata: { type: "SP.Data.ConfigurationsListItem" },
    Permissions: JSON.stringify(formData),
    Title: applicationTitle
  };

  const requestURL = `${absoluteURL}/_api/web/lists/getbytitle('Configurations')/items`;
  const response = await spHttpClient.post(
    requestURL,
    SPHttpClient.configurations.v1,
    {
      headers: {
        Accept: "application/json;odata=verbose",
        "Content-type": "application/json;odata=verbose",
        "odata-version": "",
      },
      body: JSON.stringify(listItemData),
    }
  );
  if (!response.ok) {
    console.error("Error adding Department records");
    return;
  }else{
    return true;
  }

}
