import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient } from "../../../..";


export const  fetchGroupUsers = async (groupTitles: string[] , absoluteURL: string) => {
    const users: { [key: string]: string[] } = {};
    const groupIds = await fetchGroupIds(groupTitles , absoluteURL );
  
    for (let i = 0; i < groupTitles.length; i++) {
      const groupId = groupIds[i];
      const groupTitle = groupTitles[i];
  
      if (groupId) {
        const usersURL = `${absoluteURL}/_api/web/sitegroups(${groupId})/users`;
        const usersResponse = await fetch(usersURL, {
          method: "GET",
          headers: {
            Accept: "application/json;odata=verbose",
          },
        });
  
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          users[groupTitle] = usersData.d.results.map(
            (user: { Email: string }) => user.Email
          );
        } else {
          console.error(
            `Error fetching users for group "${groupTitle}":`,
            usersResponse.statusText
          );
          users[groupTitle] = [];
        }
      } else {
        console.error(`Group ID not found for group: ${groupTitle}`);
        users[groupTitle] = [];
      }
    }
    return users;
  };

  export const fetchGroupIds = async (groupTitles: string[] , absoluteURL:string) => {
    const groupIds: (number | null)[] = [];
    for (const title of groupTitles) {
      const groupURL = `${absoluteURL}/_api/web/sitegroups?$filter=Title eq '${title}'`;
      const groupResponse = await fetch(groupURL, {
        method: "GET",
        headers: {
          Accept: "application/json;odata=verbose",
        },
      });
  
      if (groupResponse.ok) {
        const groupData = await groupResponse.json();
        groupIds.push(
          groupData.d.results.length ? groupData.d.results[0].Id : null
        );
      } else {
        console.error(
          `Error fetching group ID for "${title}"`,
          groupResponse.statusText
        );
        groupIds.push(null);
      }
    }
    return groupIds;
  };
  
  export const fetchRequestDigest = async (absoluteURL:string) => {
    const digestResponse = await fetch(`${absoluteURL}/_api/contextinfo`, {
      method: "POST",
      headers: {
        Accept: "application/json;odata=verbose",
      },
    });
  
    if (!digestResponse.ok) {
      throw new Error(`Failed to fetch request digest: ${digestResponse.statusText}`);
    }
  
    const digestData = await digestResponse.json();
    return digestData.d.GetContextWebInformation.FormDigestValue;
  };

  export const addUserToGroup = async (
    groupId: number,
    userLoginName: string,
    requestDigest: string,
    absoluteURL: string
  ) => {
    try {
      const requestURL = `${absoluteURL}/_api/web/sitegroups(${groupId})/users`;
      const response = await fetch(requestURL, {
        method: "POST",
        headers: {
          Accept: "application/json;odata=verbose",
          "Content-Type": "application/json;odata=verbose",
          "X-RequestDigest": requestDigest,
        },
        body: JSON.stringify({
          __metadata: { type: "SP.User" },
          LoginName: `i:0#.f|membership|${userLoginName}`,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `Failed to add user ${userLoginName}: ${errorData.error.message}`
        );
      }else{
        return true;
      }
  
    } catch (error) {
      console.error(`Error adding user ${userLoginName} to group ${groupId}:`, error.message);
    }
  };

  export const removeUserFromGroup = async (groupId: number, userLoginName: string, requestDigest: any, absoluteURL: string) => {
   
    const userLoginString = `i:0#.f|membership|${userLoginName}`;
    const encodedLoginName = encodeURIComponent(userLoginString);

    const requestURL = `${absoluteURL}/_api/web/sitegroups/getbyid(${groupId})/users/removeByLoginName('${encodedLoginName}')`;

    try {
        const response = await fetch(requestURL, {
            method: "POST",
            headers: {
                Accept: "application/json;odata=verbose",
                "Content-Type": "application/json;odata=verbose",
                "X-RequestDigest": requestDigest,
            },
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(`Error: ${errorMessage.error.message.value}`);
        }else{
          return true;
        }

        console.log("User removed from the group successfully.");
    } catch (error) {
        console.error("Failed to remove user from group:", error);
    }
};

export const createPeopleUserData = (siteUsers: any, context: WebPartContext) => {
  let userDataArr: any[] = [];
  for (let index = 0; index < siteUsers.value.length; index++) {
      const user = siteUsers.value[index];
      userDataArr.push({
          label: user.Title,
          value: user.Email,
          img: context.pageContext.web.absoluteUrl + "/_layouts/15/userphoto.aspx?size=" + 'L' + "&accountname=" + user.Email
      })
  }
  return userDataArr;
}

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
