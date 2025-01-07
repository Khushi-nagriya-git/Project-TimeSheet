import { SPHttpClient } from "../../..";

export const getAllSiteUsers = async (spHttpClient: SPHttpClient, absoluteURL: string) => {
    try {
      const response = await spHttpClient.get(
          `${absoluteURL}/_api/web/siteusers`,
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
         // console.log("No data found");
          return null;
      }
  } catch (error) {
     // console.log("Error:", error);
      return null;
  }
  };
  
  export const getConfigurationListData = async (spHttpClient: SPHttpClient, absoluteURL: string) => {
    try {
        const response = await spHttpClient.get(
            `${absoluteURL}/_api/web/lists/GetByTitle('Configurations')/items?$select=Permissions,Title,Attachments&$expand=AttachmentFiles`,
            SPHttpClient.configurations.v1
        );
        if (response.ok) {
          const data = await response.json();
          if (data.value.length > 0) {
            return data.value;
          }
        } else {
           // console.log("Please enter the correct name of the list in the property pane.");
        }
    } catch (error) {
       // console.log("Error fetching data:", error);
    }
  };
  