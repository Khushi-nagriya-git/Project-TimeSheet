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
import {
  fetchGroupUsers,
  fetchRequestDigest,
  fetchGroupIds,
  addUserToGroup,
  removeUserFromGroup,
} from "./Services";

const GeneralSettings = (props: {
  context: WebPartContext;
  absoluteURL: string;
  title: string;
}) => {
  const [formData, setFormData] = useState({
    Admin: [{ secondaryText: "" }],
    ReportingManager: [{ secondaryText: "" }],
    Title: props.title,
    ThemeColor: "",
  });

  let groupUsers: any = {};
  const [loading, setLoading] = useState(true);
  const [adminUsers, setAdminUsers] = useState([]);
  const [reportingManagerUsers, setReportingManagerUsers] = useState([]);


  useEffect(() => {
    const handleFetchGroupUsers = async () => {
      try {
        const groupTitles = ["ProjectTimeSheetAdmin", "PTReportingManager"];
        groupUsers = await fetchGroupUsers(groupTitles, props.absoluteURL);
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

  const handleSubmitSave = async () => {
    try {
      const { Title, Admin, ReportingManager } = formData;

      // Set the title from form data
      props.title = Title;

      const reportingManagerLoginNames = ReportingManager.map(
        (user) => user.secondaryText
      );
      const adminLoginNames = Admin.map((user) => user.secondaryText);

      if (
        reportingManagerLoginNames.length === 0 ||
        adminLoginNames.length === 0
      ) {
        console.error("One or more user login names are missing");
        return;
      }

      const groupTitles = ["PTReportingManager", "ProjectTimeSheetAdmin"];
      const groupIds = await fetchGroupIds(groupTitles, props.absoluteURL);

      const reportingManagerGroupId = groupIds[0];
      const adminGroupId = groupIds[1];

      if (!reportingManagerGroupId || !adminGroupId) {
        console.error("One or both group IDs are missing");
        return;
      }

      const requestDigest = await fetchRequestDigest(props.absoluteURL);

      // Handle adding new users

      for (const loginName of reportingManagerLoginNames) {
        if (!reportingManagerUsers?.some((user) => user === loginName)) {
          await addUserToGroup(
            reportingManagerGroupId,
            loginName,
            requestDigest,
            props.absoluteURL
          );
        }
      }

      for (const loginName of adminLoginNames) {
        if (!adminUsers.some((user) => user === loginName)) {
          await addUserToGroup(
            adminGroupId,
            loginName,
            requestDigest,
            props.absoluteURL
          );
        }
      }

      // Handle removing users only if changes have been made

      const usersToRemoveFromReportingManager: any[] = (
        reportingManagerUsers ?? []
      ).filter((user: any) => !reportingManagerLoginNames.includes(user));

      for (const user of usersToRemoveFromReportingManager) {
        await removeUserFromGroup(
          reportingManagerGroupId,
          user,
          requestDigest,
          props.absoluteURL
        );
      }

      const usersToRemoveFromAdmin: any[] = (adminUsers ?? []).filter(
        (user: any) => !adminLoginNames.includes(user)
      );

      for (const user of usersToRemoveFromAdmin) {
        await removeUserFromGroup(
          adminGroupId,
          user,
          requestDigest,
          props.absoluteURL
        );
      }
    } catch (error) {
      console.error("Error in handleSubmitSave:", error);
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
              height: "400px",
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

            <Button
              sx={{
                height: "35px",
                width: "100px",
                backgroundColor: "#023E8A",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "600",
                color: "#fff",
                marginTop: "135px",
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
