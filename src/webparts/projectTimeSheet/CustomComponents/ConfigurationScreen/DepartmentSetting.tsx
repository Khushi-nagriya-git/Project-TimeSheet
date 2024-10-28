import * as React from "react";
import { Box, TextField, useEffect, useState } from "../../../..";
import { Label } from "@fluentui/react-components";
import {Alert, Button,  CircularProgress, Table,  TableBody,  TableCell, TableContainer,  TableHead, TableRow,} from "@mui/material";
import { SPHttpClient } from "../../../../index";
import { getDepartments } from "../Projects/Services";
import { Switch } from "@mui/material";

const DepartmentSetting = (props: {
  absoluteURL: string;
  spHttpClient: SPHttpClient;
}) => {
  const [departmentName, setDepartment] = useState("");
  const [alert, setAlert] = useState(false);
  const [loading, setLoading] = useState(true);
  const [departmentListData, setDepartmentListData] = useState([]);
  let count = 0;

  useEffect(() => {
    let timer: any;
    if (alert) {
      timer = setTimeout(() => {
        setAlert(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [alert]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getDepartments(
          props.absoluteURL,
          props.spHttpClient,
          setDepartmentListData,
          "DepartmentScreen"
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (
    ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setDepartment(ev.target.value);
  };

  const addDepartment = async () => {
    const listItemData = {
      __metadata: { type: "SP.Data.DepartmentsListItem" },
      DepartmentName: departmentName,
      isActive: true
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
    } else {
      await getDepartments(
        props.absoluteURL,
        props.spHttpClient,
        setDepartmentListData,
        "DepartmentScreen"
      );
      setAlert(true);
      setDepartment("");
    }
  };

  const updateUserRecords = async (id: number, status: boolean) => {
    try {
      const response = await props.spHttpClient.get(
        `${props.absoluteURL}/_api/web/lists/getbytitle('Departments')/items?$filter=ID eq ${id}`,
        SPHttpClient.configurations.v1
      );
      if (response.ok) {
        const data = await response.json();
        if (data.value && data.value.length > 0) {
          const itemToUpdate = data.value[0];
          let listItemData = {
            __metadata: { type: "SP.Data.DepartmentsListItem" },
            isActive: status,
          };
          const updateEndpoint = `${props.absoluteURL}/_api/web/lists/getbytitle('Departments')/items(${itemToUpdate.ID})`;
          const updateResponse = await props.spHttpClient.post(
            updateEndpoint,
            SPHttpClient.configurations.v1,
            {
              headers: {
                Accept: "application/json;odata=verbose",
                "Content-type": "application/json;odata=verbose",
                "odata-version": "",
                "IF-MATCH": "*",
                "X-HTTP-Method": "MERGE",
              },
              body: JSON.stringify(listItemData),
            }
          );
          if (updateResponse.ok) {
            await getDepartments(
              props.absoluteURL,
              props.spHttpClient,
              setDepartmentListData,
              "DepartmentScreen"
            );
          } else {
            console.log("Error updating item:", updateResponse.statusText);
          }
        } else {
          console.log("No item found with the specified EmployeeID.");
        }
      } else {
        console.log("Error fetching item:", response.statusText);
      }
    } catch (error) {
      console.log("Error fetching item:", error);
    }
  };

  const handleToggle =
    (index: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const newStatus = event.target.checked;
      updateUserRecords(index, newStatus);
    };

  return (
    <React.Fragment>
      <Box
        sx={{
          height: "calc(100vh - 270px)",
          width: "100%",
          backgroundColor: "#fff",
        }}
      >
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
          <>
           <Box
          sx={{
            padding: "5px",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
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
              style={{ width: "765px" }}
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
              marginTop: "9px",
              marginRight: "5px",
              "&:hover": { backgroundColor: "#0096C7" },
            }}
            onClick={addDepartment}
          >
            Save
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
           <Box
            sx={{
              marginTop: "10px",
              height: "calc(100vh - 340px)",
              overflow: "auto",
            }}
          >
            <TableContainer>
              <Table size="small" stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        backgroundColor: "#023E8A",
                        height: "20px",
                        width: "15%",
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        color: "#fff",
                      }}
                    >
                      S.NO.
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        backgroundColor: "#023E8A",
                        height: "20px",
                        width: "60%",
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        color: "#fff",
                      }}
                    >
                      Department Name
                    </TableCell>
                    <TableCell
                      sx={{
                        fontWeight: "600",
                        backgroundColor: "#023E8A",
                        height: "20px",
                        width: "20%",
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        color: "#fff",
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {departmentListData.length > 0 ? (departmentListData.sort((a: any, b: any) => a.DepartmentName.localeCompare(b.DepartmentName)).map((Department: any) => {
                      count++;
                      return (
                        <TableRow>
                          <TableCell>{count}</TableCell>
                          <TableCell>{Department.DepartmentName}</TableCell>
                          <Switch
                            checked={Department.isActive}
                            onChange={handleToggle(Department.ID)}
                            inputProps={{
                              "aria-label": "Toggle Department Active Status",
                            }}
                          />
                          {Department.isActive ? "Active" : "In Active"}
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9}>
                        <Box
                          sx={{
                            textAlign: "center",
                            fontWeight: "600",
                            fontFamily:
                              "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                          }}
                        >
                          No data found
                        </Box>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
          </>
         
        )}
      </Box>
    </React.Fragment>
  );
};

export default DepartmentSetting;
