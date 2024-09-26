import * as React from "react";
import { Label } from "@fluentui/react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  Avatar,
  TableContainer,
} from "../../../../..";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import Paper from "@mui/material/Paper";

const TeamMemberTaskStatus = (props: {
  data: any;
  columnName: any;
  context: WebPartContext;
}) => {
  return (
    <Box
      sx={{
        height: "300px",
        backgroundColor: "#fff",
        marginTop: "13px",
        width: "100%",
        borderRadius: "10px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Label
        style={{ fontSize: "18px", marginTop: "10px", marginLeft: "10px" }}
      >
        Team Member - Task Status
      </Label>
      {/* TableContainer handles scrolling */}
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: "280px",
          overflowY: "auto",
          overflowX: "hidden",
          backgroundColor: "#ffffff",
        }}
      >
        <Table
          size="small"
          aria-label="purchases"
          sx={{ marginTop: "10px", tableLayout: "fixed" }}
        >
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: "#023E8A",
                fontWeight: "600",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              {props.columnName.map((columnName: string, index: any) => {
                const width = columnName === "Team Member" ? "20%" : "13%";
                const alignment = columnName === "Team Member" ? "left" : "center"
                return (
                  <TableCell
                    key={index}
                    align = {alignment}
                    sx={{
                      width: width, // Use the calculated width directly
                      fontWeight: 600,
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      color: "white",
                    }}
                  >
                    {columnName}
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((data: any) => {
              return (
                <TableRow key={data.JobName}>
                  <TableCell
                    align="left"
                    sx={{
                      height: "10px",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    <Box display="flex" alignItems="left" justifyContent="left">
                      <Avatar
                        alt={data.Title}
                        src={`${props.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?accountname=${data.Email}&Size=M`}
                        style={{
                          marginRight: 8,
                          height: "30px",
                          width: "30px",
                          borderRadius: "5px",
                        }}
                      />
                      <Box sx={{ mt: 0.5 }}>{data.Name}</Box>
                    </Box>
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    {data.TotalTask}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    {data.NotStarted}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    {data.InProgress}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    {data.Completed}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    {data.Hold}
                  </TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    {data.OverDueJobs}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeamMemberTaskStatus;
