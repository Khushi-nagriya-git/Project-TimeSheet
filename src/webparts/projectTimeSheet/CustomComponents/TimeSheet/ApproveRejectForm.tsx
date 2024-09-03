import * as React from "react";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
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
  TableSortLabel,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Label } from "@fluentui/react/lib/Label";
import { Dropdown } from "@fluentui/react/lib/components/Dropdown";
import { TextField } from "@fluentui/react";
import { updateRecords } from "../TimeLogs/Services";
import { TimeLogsData } from "../TimeLogs/ITimeLogsStats";

const TimeSheetForm = ({
  open,
  onClose,
  selectedData,
  absoluteURL,
  spHttpClient,
  setUpdateStatus,
  updateStatus,
  TableType,
  handleTabChange,
}: {
  open: boolean;
  onClose: () => void;
  handleTabChange: (tab: string) => Promise<void>;
  selectedData: any[];
  absoluteURL: any;
  spHttpClient: any;
  setUpdateStatus: React.Dispatch<React.SetStateAction<any>>;
  updateStatus: any;
  TableType: any;
}) => {
  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  const TaskTypeOptions = ["Billable", "Non Billable"];
  const statusOptions = ["Pending", "Approved", "Rejected"];
  const [selected, setSelected] = React.useState<string[]>([]);
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<string>("ProjectName");

  if (!selectedData || selectedData.length === 0) return null;

  const convertMinutesToHoursAndMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} H ${mins} M`;
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
  const formatDate = (date?: Date): string => {
    if (date) {
      return date
        .toLocaleDateString("en-US", {
          weekday: "short",
          day: "2-digit",
          month: "numeric",
        })
        .replace(",", "");
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
          TimelogsId: log.TimelogsId,
        };
      }

      const logDateString = logDate.toLocaleDateString("en-US");
      acc[key].LoggedHoursByDay[logDateString] =
        (acc[key].LoggedHoursByDay[logDateString] || 0) + log.LoggedHours;
    }

    return acc;
  }, {});

  const groupedDataArray: TimeLogsData[] = Object.values(groupedData);

  const handleRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const sortedData = groupedDataArray.sort((a: any, b: any) => {
    if (orderBy === "Status" || orderBy === "TaskType") {
      if (a[orderBy] < b[orderBy]) return order === "asc" ? -1 : 1;
      if (a[orderBy] > b[orderBy]) return order === "asc" ? 1 : -1;
      return 0;
    }
    return order === "asc"
      ? a[orderBy].localeCompare(b[orderBy])
      : b[orderBy].localeCompare(a[orderBy]);
  });

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = sortedData.map((log: any) => log.TimelogsId);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const handleApproved = async () => {
    let updatedTimeLogsData: TimeLogsData[] = [];
    for (let i = 0; i < groupedDataArray.length; i++) {
      for (let j = 0; j < selected.length; j++) {
        if (groupedDataArray[i]?.TimelogsId === parseInt(selected[j])) {
          updatedTimeLogsData.push(groupedDataArray[i]);
        }
      }
    }
    updatedTimeLogsData = updatedTimeLogsData.map((timeLog) => ({
      ...timeLog,
      Status: "Approved",
    }));
    await updateRecords(
      spHttpClient,
      absoluteURL,
      "TimeLogforApproval",
      0,
      updatedTimeLogsData,
      0,
      setUpdateStatus
    );
    handleTabChange("TeamTimeSheet");
    onClose();
  };

  const handleReject = async () => {
    let updatedTimeLogsData: TimeLogsData[] = [];
    for (let i = 0; i < groupedDataArray.length; i++) {
      for (let j = 0; j < selected.length; j++) {
        if (groupedDataArray[i]?.TimelogsId === parseInt(selected[j])) {
          updatedTimeLogsData.push(groupedDataArray[i]);
        }
      }
    }
    updatedTimeLogsData = updatedTimeLogsData.map((timeLog) => ({
      ...timeLog,
      Status: "Rejected",
    }));
    await updateRecords(
      spHttpClient,
      absoluteURL,
      "TimeLogforRejection",
      0,
      updatedTimeLogsData,
      0,
      setUpdateStatus
    );
    handleTabChange("TeamTimeSheet");
    onClose();
  };

  const getTaskTypeColor = (status: string) => {
    switch (status) {
      case "Non Billable":
        return "#007bff";
      case "Billable":
        return "#65B741";
      default:
        return "#9D9D9D";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#9D9D9D";
      case "Not Submitted":
        return "#007bff";
      case "Rejected":
        return "#FFB6C1";
      case "Approved":
        return "#65B741";
      default:
        return "#9D9D9D";
    }
  };

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
            border: "1px solid grey",
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
                  placeholder="Select Task Type"
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

              {/* <Grid item sx={{ marginBottom: "33px" }}>
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
              </Grid> */}

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
                  {TableType === "TeamTimeSheet" && (
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        indeterminate={
                          selected.length > 0 &&
                          selected.length < sortedData.length
                        }
                        checked={
                          sortedData.length > 0 &&
                          selected.length === sortedData.length
                        }
                        onChange={handleSelectAllClick}
                      />
                    </TableCell>
                  )}

                  <TableCell
                    sx={{
                      width: "14%",
                      fontWeight: "600",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                    align="left"
                    sortDirection={orderBy === "ProjectName" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "ProjectName"}
                      direction={orderBy === "ProjectName" ? order : "asc"}
                      onClick={() => handleRequestSort("ProjectName")}
                    >
                      Project
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    align="left"
                    sx={{
                      width: "14%",
                      fontWeight: "600",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                    sortDirection={orderBy === "JobName" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "JobName"}
                      direction={orderBy === "JobName" ? order : "asc"}
                      onClick={() => handleRequestSort("JobName")}
                    >
                      Task
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    align="left"
                    sx={{
                      width: "8%",
                      fontWeight: "600",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                    sortDirection={orderBy === "Status" ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === "Status"}
                      direction={orderBy === "Status" ? order : "asc"}
                      onClick={() => handleRequestSort("Status")}
                    >
                      Status
                    </TableSortLabel>
                  </TableCell>

                  <TableCell
                    align="left"
                    sx={{
                      width: "8%",
                      fontWeight: "600",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    Task Type
                  </TableCell>
                  {weekDates.map((date) => (
                    <TableCell
                      key={date.toDateString()}
                      align="center"
                      sx={{
                        width: "8%",
                        fontWeight: "600",
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      {formatDate(date)}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {sortedData.length > 0 ? (
                  sortedData.map((log: any, index: number) => {
                    const isApproved = log.Status === "Approved";
                    const isItemSelected = isSelected(log.TimelogsId);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const borderColorforTaskType = getTaskTypeColor(
                      log.BillableStatus
                    );
                    const borderColorStatus = getStatusColor(log.Status);
                    const disabledStyle = {
                      opacity: 0.7,
                      pointerEvents: "none",
                    };

                    const isJobName = log.JobName.length > 20;
                    const isProjectName = log.ProjectName.length > 20;

                    return (
                      <TableRow
                        sx={{ ...(isApproved && disabledStyle) }}
                        key={log.TimelogsId}
                        hover={TableType === "TeamTimeSheet"}
                        onClick={
                          TableType === "TeamTimeSheet"
                            ? () => handleClick(log.TimelogsId)
                            : undefined
                        }
                        role={
                          TableType === "TeamTimeSheet" ? "checkbox" : undefined
                        }
                        aria-checked={
                          TableType === "TeamTimeSheet"
                            ? isItemSelected
                            : undefined
                        }
                        tabIndex={
                          TableType === "TeamTimeSheet" ? -1 : undefined
                        }
                        selected={
                          TableType === "TeamTimeSheet"
                            ? isItemSelected
                            : undefined
                        }
                      >
                        {TableType === "TeamTimeSheet" && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                        )}

                        <TableCell
                          sx={{
                            fontFamily:
                              "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                          }}
                        >
                          {isProjectName ? (
                            <Tooltip title={log.ProjectName}>
                              <span>{log.ProjectName.substring(0, 20)}...</span>
                            </Tooltip>
                          ) : (
                            log.ProjectName
                          )}
                        </TableCell>

                        <TableCell
                          sx={{
                            fontFamily:
                              "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                          }}
                        >
                          {isJobName ? (
                            <Tooltip title={log.JobName}>
                              <span>{log.JobName.substring(0, 20)}...</span>
                            </Tooltip>
                          ) : (
                            log.JobName
                          )}
                        </TableCell>

                        <TableCell
                          sx={{
                            fontFamily:
                              "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                          }}
                        >
                          <Box
                            sx={{
                              borderRadius: "20px",
                              border: `2px solid ${borderColorStatus}`,
                              height: "22px",
                              width: "95px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily:
                                "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            }}
                          >
                            {log.Status}
                          </Box>
                        </TableCell>

                        <TableCell
                          sx={{
                            fontFamily:
                              "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                          }}
                        >
                          <Box
                            sx={{
                              borderRadius: "20px",
                              border: `2px solid ${borderColorforTaskType}`,
                              height: "22px",
                              width: "95px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontFamily:
                                "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            }}
                          >
                            {log.BillableStatus}
                          </Box>
                        </TableCell>

                        {weekDates.map((date) => {
                          const loggedHours =
                            log.LoggedHoursByDay[
                              date.toLocaleDateString("en-US")
                            ] || 0;

                          return (
                            <TableCell
                              key={date.toDateString()}
                              align="center"
                              sx={{
                                fontFamily:
                                  "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                              }}
                            >
                              {loggedHours > 0
                                ? convertMinutesToHoursAndMinutes(loggedHours)
                                : ""}
                            </TableCell>
                          );
                        })}
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
      </DialogContent>
      {TableType === "TeamTimeSheet" && (
        <DialogActions
          sx={{
            justifyContent: "flex-start",
            padding: "8px 24px",
          }}
        >
          <Button
            onClick={handleApproved}
            sx={{
              backgroundColor: "#65b741",
              color: "#fff",
              height: "35px",
              borderRadius: "5px",
              marginBottom: "5px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#65b741",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              },
              width: "79px",
            }}
          >
            Approve
          </Button>

          <Button
            onClick={handleReject}
            sx={{
              backgroundColor: "#ff8a8a",
              color: "#fff",
              height: "35px",
              borderRadius: "5px",
              marginBottom: "5px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#ff8a8a",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              },
              width: "79px",
            }}
          >
            Reject
          </Button>

          <Button
            onClick={onClose}
            sx={{
              color: "rgb(50, 49, 48)",
              backgroundColor: "white",
              height: "35px",
              border: "1px solid grey",
              borderRadius: "5px",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              marginBottom: "5px",
              textTransform: "none",
              width: "79px",
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default TimeSheetForm;
