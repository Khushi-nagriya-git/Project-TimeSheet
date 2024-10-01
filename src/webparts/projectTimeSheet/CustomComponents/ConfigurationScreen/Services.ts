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
        }

        console.log("User removed from the group successfully.");
    } catch (error) {
        console.error("Failed to remove user from group:", error);
    }
};


