import * as React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Label } from "@fluentui/react/lib/Label";
import { Dropdown } from "@fluentui/react/lib/components/Dropdown";
import { TextField } from "@fluentui/react";

const TimeSheetForm = ({
  open,
  onClose,
  selectedData,
}: {
  open: boolean;
  onClose: () => void;
  selectedData: any[];
}) => {
  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  const TaskTypeOptions = ["Billable", "Non Billable"];
  const statusOptions = ["Pending", "Approved", "Rejected"];
  if (!selectedData || selectedData.length === 0) return null;

  const convertMinutesToHoursAndMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} Hrs ${mins} Mins`;
  };

  const getStartOfWeek = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const getWeekDates = (date: Date) => {
    const startOfWeek = getStartOfWeek(new Date(date));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  const handlePreviousWeek = () => {
    setCurrentWeek((prev) => {
      const prevWeek = new Date(prev);
      prevWeek.setDate(prevWeek.getDate() - 7);
      return prevWeek;
    });
  };

  const handleNextWeek = () => {
    setCurrentWeek((prev) => {
      const nextWeek = new Date(prev);
      nextWeek.setDate(nextWeek.getDate() + 7);
      return nextWeek;
    });
  };

  const weekDates = getWeekDates(currentWeek);

  const formatDate = (date?: Date) => {
    if (date) {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      });
    }
    return "N/A";
  };
  const groupedData = selectedData.reduce((acc: any, log: any) => {
    const logDate = new Date(log.Created);

    if (logDate >= weekDates[0] && logDate <= weekDates[6]) {
      const key = `${log.ProjectName}-${log.JobName}`;

      if (!acc[key]) {
        acc[key] = {
          ProjectName: log.ProjectName,
          JobName: log.JobName,
          Status: log.Status,
          BillableStatus: log.BillableStatus,
          LoggedHoursByDay: {},
        };
      }

      const logDateString = logDate.toLocaleDateString("en-US");
      acc[key].LoggedHoursByDay[logDateString] =
        (acc[key].LoggedHoursByDay[logDateString] || 0) + log.LoggedHours;
    }

    return acc;
  }, {});

  const groupedDataArray = Object.values(groupedData);

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>
        Time Sheet Details - {selectedData[0].Author.Title}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Label style={{ fontWeight: "600" }}>Projects</Label>
                <Dropdown
                  placeholder="Select project"
                  // selectedKey={props.selectedBillableStatus}
                  // onChange={handleBillableStatusChange}
                  // disabled={props.isRunning}
                  // errorMessage={props.statusError}
                  options={TaskTypeOptions.map((status) => ({
                    key: status,
                    text: status,
                  }))}
                  styles={{
                    root: {
                      width: 230,
                      height: 60,
                      marginBottom: 5,
                      borderWidth: 2,
                    },
                    title: {
                      textAlign: "left",
                      lineHeight: "25px",
                    },
                    dropdownItemsWrapper: {
                      maxHeight: 200,
                    },
                    dropdownItem: {
                      height: 35,
                      borderRadius: 5,
                      width: 230,
                      backgroundColor: "#ffffff",
                    },
                  }}
                />
              </Grid>

              <Grid item>
                <Label style={{ fontWeight: "600" }}>Status</Label>
                <Dropdown
                  placeholder="Select status"
                  // selectedKey={props.selectedBillableStatus}
                  // onChange={handleBillableStatusChange}
                  // disabled={props.isRunning}
                  // errorMessage={props.statusError}
                  options={statusOptions.map((status) => ({
                    key: status,
                    text: status,
                  }))}
                  styles={{
                    root: {
                      width: 230,
                      height: 60,
                      marginBottom: 5,
                      borderWidth: 2,
                    },
                    title: {
                      textAlign: "left",
                      lineHeight: "25px",
                    },
                    dropdownItemsWrapper: {
                      maxHeight: 200,
                    },
                    dropdownItem: {
                      height: 35,
                      borderRadius: 5,
                      width: 230,
                      backgroundColor: "#ffffff",
                    },
                  }}
                />
              </Grid>

              <Grid item>
                <Label style={{ fontWeight: "600" }}>Task Type</Label>
                <Dropdown
                  placeholder="Select billable status"
                  // selectedKey={props.selectedBillableStatus}
                  // onChange={handleBillableStatusChange}
                  // disabled={props.isRunning}
                  // errorMessage={props.statusError}
                  options={TaskTypeOptions.map((status) => ({
                    key: status,
                    text: status,
                  }))}
                  styles={{
                    root: {
                      width: 230,
                      height: 60,
                      marginBottom: 5,
                      borderWidth: 2,
                    },
                    title: {
                      textAlign: "left",
                      lineHeight: "25px",
                    },
                    dropdownItemsWrapper: {
                      maxHeight: 200,
                    },
                    dropdownItem: {
                      height: 35,
                      borderRadius: 5,
                      width: 230,
                      backgroundColor: "#ffffff",
                    },
                  }}
                />
              </Grid>

              <Grid item sx={{ marginBottom: "33px" }}>
                <Label style={{ fontWeight: "600" }}>Pending Count</Label>
                <TextField
                  type="number"
                  name="EstimatedHours"
                  disabled
                  // value={formatHours(
                  //   convertMinutesToHours(formData.EstimatedHours)
                  // )}
                  style={{ width: "230px" }}
                />
              </Grid>

              <Grid item>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "right",
                    alignItems: "center",
                    mb: 2,
                    fontFamily:
                      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    fontWeight: "600",
                  }}
                >
                  <IconButton onClick={handlePreviousWeek}>
                    <ChevronLeft />
                  </IconButton>
                  <img
                    src={require("../../assets/calendars.png")}
                    alt="Calendar"
                    style={{
                      width: "21px",
                      height: "21px",
                      marginLeft: "5px",
                    }}
                  />
                  <IconButton onClick={handleNextWeek}>
                    <ChevronRight />
                  </IconButton>
                  <span>
                    {formatDate(weekDates[0])} - {formatDate(weekDates[6])}
                  </span>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </div>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <TableContainer>
            <Table
              size="small"
              aria-label="collapsible table"
              sx={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              <TableHead>
                <TableRow
                  sx={{
                    backgroundColor: "#f3f2f1",
                    fontWeight: "600",
                    fontFamily:
                      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  }}
                >
                  <TableCell
                    align="left"
                    sx={{
                      width: "15%",
                      fontWeight: "600",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    Project
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      width: "15%",
                      fontWeight: "600",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    Task
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      width: "10%",
                      fontWeight: "600",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="left"
                    sx={{
                      width: "10%",
                      fontWeight: "600",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    Task Type
                  </TableCell>
                  {weekDates.map((date, index) => (
                    <TableCell key={index}  align="left"
                    sx={{
                      width: "8%",
                      fontWeight: "600",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}>
                      {date.toLocaleDateString("en-US")}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {groupedDataArray.map((log: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell
                      align="left"
                      sx={{
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      {log.ProjectName}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      {log.JobName}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      {log.Status}
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      {log.BillableStatus}
                    </TableCell>
                    {weekDates.map((date, dateIndex) => (
                      <TableCell
                        key={dateIndex}
                        align="left"
                        sx={{
                          fontFamily:
                            "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        }}
                      >
                        {log.LoggedHoursByDay[date.toLocaleDateString("en-US")]
                          ? convertMinutesToHoursAndMinutes(
                              log.LoggedHoursByDay[
                                date.toLocaleDateString("en-US")
                              ]
                            )
                          : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 2 }}>
            <Button onClick={onClose} variant="contained" color="primary">
              Close
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSheetForm;
