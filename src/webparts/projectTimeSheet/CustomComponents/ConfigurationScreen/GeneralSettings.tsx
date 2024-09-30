import * as React from "react";
import {
  Box,
  PeoplePicker,
  PrincipalType,
  TextField,
  useEffect,
  useState,
} from "../../../..";
import { Label } from "@fluentui/react-components";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { Button, CircularProgress } from "@mui/material";

const GeneralSettings = (props: {
  context: WebPartContext;
  absoluteURL: string;
  title: string;
}) => {
  const [formData, setFormData] = useState({
    Admin: [{ secondaryText: "" }],
    ReportingManager: [{ secondaryText: "" }],
    Title: "",
    ThemeColor: "",
  });

  let groupUsers: any = {};
  const [loading, setLoading] = useState(true);
  const [adminUsers, setAdminUsers] = useState<string[]>([]);
  const [reportingManagerUsers, setReportingManagerUsers] = useState<string[]>();

useEffect(() => {
  const handleFetchGroupUsers = async () => {
    try {
      const groupTitles = ["ProjectTimeSheetAdmin", "PTReportingManager"];
      groupUsers = await fetchGroupUsers(groupTitles);
      setAdminUsers(groupUsers.ProjectTimeSheetAdmin || []);
      setReportingManagerUsers(groupUsers.PTReportingManager || []);
    
    } catch (error) {
      console.error("Error fetching group users", error);
    } finally {
      setLoading(false);
    }
  };
  handleFetchGroupUsers();
}, []);


const getPeoplePickerReportingManager = (items: any[]) => {
  setFormData({
    ...formData,
    ReportingManager: items.map((item) => ({
      secondaryText: item.secondaryText,
    })),
  });
};

const getPeoplePickerAdmin = (items: any[]) => {
  setFormData({
    ...formData,
    Admin: items.map((item) => ({
      secondaryText: item.secondaryText,
    })),
  });
};

const handleChange = (
  ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
  newValue?: string
) => {
  const { name, value } = ev.currentTarget;

  setFormData({
    ...formData,
    [name]: value,
  });
};


const fetchGroupUsers = async (groupTitles: string[]) => {
  const users: { [key: string]: string[] } = {};
  const groupIds = await fetchGroupIds(groupTitles);

  for (let i = 0; i < groupTitles.length; i++) {
    const groupId = groupIds[i];
    const groupTitle = groupTitles[i];

    if (groupId) {
      const usersURL = `${props.absoluteURL}/_api/web/sitegroups(${groupId})/users`;
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

const fetchGroupIds = async (groupTitles: string[]) => {
  const groupIds: (number | null)[] = [];
  for (const title of groupTitles) {
    const groupURL = `${props.absoluteURL}/_api/web/sitegroups?$filter=Title eq '${title}'`;
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


const handleSubmitSave = async () => {
  try {
    const { Title, Admin, ReportingManager } = formData;

    // Set the title from form data
    props.title = Title;

    const reportingManagerLoginNames = ReportingManager.map(
      (user) => user.secondaryText
    );
    const adminLoginNames = Admin.map((user) => user.secondaryText);

    if (reportingManagerLoginNames.length === 0 || adminLoginNames.length === 0) {
      console.error("One or more user login names are missing");
      return;
    }

    const groupTitles = ["PTReportingManager", "ProjectTimeSheetAdmin"];
    const groupIds = await fetchGroupIds(groupTitles);

    const reportingManagerGroupId = groupIds[0];
    const adminGroupId = groupIds[1];

    if (!reportingManagerGroupId || !adminGroupId) {
      console.error("One or both group IDs are missing");
      return;
    }

    const requestDigest = await fetchRequestDigest();

    for (const loginName of reportingManagerLoginNames) {
      await addUserToGroup(reportingManagerGroupId, loginName, requestDigest);
    }

    for (const loginName of adminLoginNames) {
      await addUserToGroup(adminGroupId, loginName, requestDigest);
    }

    console.log("Users successfully added to groups.");
  } catch (error) {
    console.error("Error in handleSubmitSave:", error);
  }
};

const fetchRequestDigest = async () => {
  const digestResponse = await fetch(`${props.absoluteURL}/_api/contextinfo`, {
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

const addUserToGroup = async (
  groupId: number,
  userLoginName: string,
  requestDigest: string
) => {
  try {
    const requestURL = `${props.absoluteURL}/_api/web/sitegroups(${groupId})/users`;
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

  return (
    <React.Fragment>
      <Box sx={{ height: "100%", width: "100%", backgroundColor: "#fff" }}>
        {loading && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        )}

        {!loading && (
          <Box sx={{ padding: "5px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "5px",
              }}
            >
              <Label
                style={{
                  fontWeight: "600",
                  marginRight: "10px",
                  width: "125px",
                  marginBottom: "5px",
                }}
              >
                Admin
              </Label>
              <div style={{ flexGrow: 1 }}>
                <PeoplePicker
                  context={props.context as any}
                  personSelectionLimit={100}
                  required={true}
                  disabled={false}
                  showtooltip={true}
                  ensureUser={true}
                  defaultSelectedUsers={adminUsers}
                  onChange={getPeoplePickerAdmin}
                  resolveDelay={300}
                  principalTypes={[PrincipalType.User]}
                  groupName=""
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
              }}
            >
              <Label
                style={{
                  fontWeight: "600",
                  marginRight: "10px",
                  width: "125px",
                  marginBottom: "5px",
                }}
              >
                Reporting Manager
              </Label>
              <div style={{ flexGrow: 1 }}>
                <PeoplePicker
                  context={props.context as any}
                  personSelectionLimit={100}
                  required={true}
                  disabled={false}
                  showtooltip={true}
                  ensureUser={true}
                  defaultSelectedUsers={reportingManagerUsers}
                  onChange={getPeoplePickerReportingManager}
                  resolveDelay={300}
                  principalTypes={[PrincipalType.User]}
                  groupName=""
                />
              </div>
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
              }}
            >
              <Label
                style={{
                  fontWeight: "600",
                  marginRight: "10px",
                  width: "125px",
                  marginBottom: "5px",
                }}
              >
                Application Title
              </Label>
              <TextField
                name="Title"
                value={formData.Title}
                onChange={handleChange}
                style={{ width: "870px" }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: "10px",
              }}
            >
              <Label
                style={{
                  fontWeight: "600",
                  marginRight: "10px",
                  width: "125px",
                  marginBottom: "5px",
                }}
              >
                Theme Color
              </Label>
              <TextField
                name="ThemeColor"
                value={formData.ThemeColor}
                onChange={handleChange}
                style={{ width: "870px" }}
              />
            </div>

            <Button
              sx={{
                height: "35px",
                width: "100px",
                backgroundColor: "#023E8A",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "600",
                color: "#fff",
                marginTop: "65px",
                marginRight: "100px",
                "&:hover": { backgroundColor: "#0077B6" },
              }}
              onClick={handleSubmitSave}
            >
              Submit
            </Button>
          </Box>
        )}
      </Box>
    </React.Fragment>
  );
};

export default GeneralSettings;
