import * as React from "react";
import { Box, TextField, useEffect, useState } from "../../../..";
import { Label } from "@fluentui/react-components";
import { Alert, Button } from "@mui/material";
import {SPHttpClient} from "../../../../index";


const DepartmentSetting = (props: { absoluteURL: string,
    spHttpClient: SPHttpClient}) => {
  const [departmentName, setDepartment] = useState("");
  const [alert , setAlert] = useState(false);

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
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDepartment(ev.target.value);
  };

  const addDepartment = async () => {
    const listItemData = {
      __metadata: { type: "SP.Data.DepartmentsListItem" },
      DepartmentName: departmentName
    };

    const requestURL = `${props.absoluteURL}/_api/web/lists/getbytitle('Departments')/items`;
    const response = await props.spHttpClient.post(
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
        setAlert(true);
        setDepartment('');
    }

  };

  return (
    <React.Fragment>
      
      <Box sx={{ height: "100%", width: "100%", backgroundColor: "#fff" }}>
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
              Department Name
            </Label>
            <TextField
              name="departmentName"
              value={departmentName}
              onChange={handleChange}
              style={{ width: "870px" }}
            />
          </div>

          <Button
            sx={{
              height: "40px",
              width: "120px",
              backgroundColor: "#023E8A",
              textTransform: "none",
              fontSize: "16px",
              fontWeight: "600",
              color: "#fff",
              marginTop: "250px",
              marginRight: "100px",
              "&:hover": { backgroundColor: "#0096C7" },
            }}
            onClick={addDepartment}
          >
            Submit
          </Button>

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
         Department has been successfully added!
        </Alert>
      )}
      
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default DepartmentSetting;
