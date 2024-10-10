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
import { Alert, Button, CircularProgress } from "@mui/material";
import { addData, updateData } from "./Services";
import { getConfigurationListData } from "../../components/Service";

interface FormData {
  Admin: string[];
  AdminGroup: string[];
  ReportingManager: string[];
  ReportingManagerGroups: string[];
  Title: string;
  Attachment: any;
}

const GeneralSettings = (props: {
  context: WebPartContext;
  absoluteURL: string;
  title: string;
  spHttpClient: any;
  configurationListDataLength: number;
  configurationListData: any;
}) => {
  const [formData, setFormData] = useState<FormData>({
    Admin: [],
    AdminGroup: [],
    ReportingManager: [],
    ReportingManagerGroups: [],
    Title: props.title,
    Attachment: "",
  });

  const [loading, setLoading] = useState(true);
  const [applicationTitle, setApplicationTitle] = useState<string>(
    props.configurationListData[0].Title
      ? props.configurationListData[0].Title
      : ""
  );
  const [adminUsers, setAdminUsers] = useState<string[]>([]);
  const [reportingManagerUsers, setReportingManagerUsers] =
    useState<string[]>();
  const [attachmentError, setAttachmentError] = useState("");
  const [defaultAttachment, setDefaultAttachment] = useState();
  const [alert , setAlert] = useState(false);
  let reportingManagerData: any[] = [];
  let adminData: any[] = [];

  useEffect(() => {
    const handleFetchGroupUsers = async () => {
      try {
        let data = JSON.parse(props.configurationListData[0].Permissions);

        for (let i = 0; i < data?.ReportingManagerGroups?.length; i++) {
          reportingManagerData.push(
            data.ReportingManagerGroups[i].split(",")[1]
          );
        }
        for (let i = 0; i < data?.ReportingManager?.length; i++) {
          reportingManagerData.push(data.ReportingManager[i]);
        }
        setReportingManagerUsers(reportingManagerData);

        for (let i = 0; i < data?.AdminGroup?.length; i++) {
          adminData.push(data.AdminGroup[i].split(",")[1]);
        }
        for (let i = 0; i < data?.Admin?.length; i++) {
          adminData.push(data.Admin[i]);
        }
        setAdminUsers(adminData);

        setFormData({
          ReportingManager: data.ReportingManager,
          ReportingManagerGroups: data.ReportingManagerGroups,
          AdminGroup: data.AdminGroup,
          Admin: data.Admin,
          Title: applicationTitle,
          Attachment: "",
        });

        setDefaultAttachment(
          props.configurationListData[0].AttachmentFiles[0].ServerRelativeUrl
        );
      } catch (error) {
        console.error("Error fetching group users", error);
      } finally {
        setLoading(false);
      }
    };
    handleFetchGroupUsers();
  }, []);

  useEffect(() => {
    let timer: any;
    if (
        alert
    ) {
      timer = setTimeout(() => {
        setAlert(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [alert]);


  const handleChange = (
    ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>,
    newValue?: string
  ) => {
    const { name, value } = ev.currentTarget;
    setApplicationTitle(value);
  };

  const handleSubmitSave = async () => {
    if (props.configurationListDataLength === 1) {
      let response = await updateData(
        formData,
        applicationTitle,
        props.absoluteURL,
        props.spHttpClient
      );
      if (response === true) {
        await getConfigurationListData(props.spHttpClient, props.absoluteURL);
        setAlert(true);
      }
    }
    if (props.configurationListDataLength === 0) {
      let response = await addData(
        formData,
        applicationTitle,
        props.absoluteURL,
        props.spHttpClient
      );
      if (response === true) {
        await getConfigurationListData(props.spHttpClient, props.absoluteURL);
        setAlert(true);
      }
    }
  };

  const getPeoplePickerReportingManager = async (items: any[]) => {
    let userEmails = new Set<string>();
    let groupsName = new Set<string>();
    for (const item of items) {
      const loginName = item.loginName;
      if (loginName.includes("membership") && loginName.includes("@")) {
        userEmails.add(item.secondaryText);
      } else {
        let groupNameAndId = item.id + "," + item.loginName;
        groupsName.add(groupNameAndId);
      }
    }
    setFormData({
      ...formData,
      ReportingManager: Array.from(userEmails),
      ReportingManagerGroups: Array.from(groupsName),
    });
  };

  const getPeoplePickerAdmin = async (items: any[]) => {
    let userEmails = new Set<string>();
    let groupsName = new Set<string>();
    for (const item of items) {
      const loginName = item.loginName;
      if (loginName.includes("membership") && loginName.includes("@")) {
        userEmails.add(item.secondaryText);
      } else {
        let groupNameAndId = item.id + "," + item.loginName;
        groupsName.add(groupNameAndId);
      }
    }
    setFormData({
      ...formData,
      Admin: Array.from(userEmails),
      AdminGroup: Array.from(groupsName),
    });
  };

  const handleChangeAttachment = (e: any) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split("/")[0];
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        if (
          fileType !== "image" ||
          img.width > 500 ||
          img.height > 500 ||
          img.width < 150 ||
          img.height < 150
        ) {
          setAttachmentError(
            "Please upload an image of size between 150px and 500px."
          );
        } else {
          setAttachmentError("");
          setFormData({
            ...formData,
            Attachment: file,
          });
        }
      };
      img.onerror = () => {
        setAttachmentError("Invalid image file. Please upload a valid image.");
      };
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
                value={applicationTitle ? applicationTitle : ""}
                onChange={handleChange}
                style={{ width: "870px" }}
              />
            </div>

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
                  principalTypes={[
                    PrincipalType.User,
                    PrincipalType.SecurityGroup,
                    PrincipalType.DistributionList,
                    PrincipalType.SharePointGroup,
                  ]}
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
                  resolveDelay={200}
                  principalTypes={[
                    PrincipalType.User,
                    PrincipalType.SecurityGroup,
                    PrincipalType.DistributionList,
                    PrincipalType.SharePointGroup,
                  ]}
                  groupName=""
                />
              </div>
            </div>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Label style={{ fontWeight: "600", marginTop: "0px" }}>
                Attachment
              </Label>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <input
                  type="file"
                  onChange={handleChangeAttachment}
                  accept="image/*"
                  style={{ margin: "5px 0" }}
                />
                {attachmentError && (
                  <Alert severity="error">{attachmentError}</Alert>
                )}
                {defaultAttachment && (
                  <img
                    src={defaultAttachment}
                    style={{ width: "100px", height: "auto", marginTop: "0px" }}
                  />
                )}
                {props.configurationListData[0].Attachment &&
                  !defaultAttachment && (
                    <div style={{ marginTop: "10px" }}>
                      <img
                        src={props.configurationListData[0].Attachment}
                        alt=""
                        style={{
                          width: "70px",
                          height: "auto",
                          marginTop: "5px",
                          border: "2px solid black",
                        }}
                      />
                    </div>
                  )}
              </div>
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
                marginTop: "20px",
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
      {alert && (
        <Alert
          severity={"success"}
          onClose={function (): void {
            setAlert(false);
          }}
          sx={{
            position: "fixed",
            top: "50px",
            right: "20px",
            zIndex: 9999,
          }}
        >
         Data has been successfully updated!
        </Alert>
      )}
    </React.Fragment>
  );
};

export default GeneralSettings;
