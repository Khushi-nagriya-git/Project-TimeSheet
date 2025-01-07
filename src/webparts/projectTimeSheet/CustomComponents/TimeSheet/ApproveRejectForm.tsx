import * as React from "react";
import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Table,TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Tooltip,} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Label } from "@fluentui/react/lib/Label";
import { Dropdown } from "@fluentui/react/lib/components/Dropdown";
import { updateRecords } from "../TimeLogs/Services";
import { TimeLogsData } from "../TimeLogs/ITimeLogsStats";
import formStyle from "./TimeSheet.module.scss";
import styles from "./TimeSheet.module.scss";

const TimeSheetForm = ({ open, onClose, selectedData, absoluteURL, spHttpClient, setUpdateStatus, updateStatus, TableType, handleTabChange, setApprovedAlert,setAlert, setRejectAlert, setSelected, selected,allTimeLogsData, startDateOfWeek, projectsData}: { open: boolean;  onClose: () => void; handleTabChange: (tab: string) => Promise<void>; selectedData: any[]; absoluteURL: any; spHttpClient: any; selected: any; projectsData:any; setSelected: React.Dispatch<React.SetStateAction<any>>; setUpdateStatus: React.Dispatch<React.SetStateAction<any>>; setApprovedAlert: React.Dispatch<React.SetStateAction<any>>;allTimeLogsData:any; setRejectAlert: React.Dispatch<React.SetStateAction<any>>; setAlert: React.Dispatch<React.SetStateAction<any>>; updateStatus: any; TableType: any; startDateOfWeek:any}) => {
 
  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  const TaskTypeOptions = ["Billable", "Non Billable"];
  const statusOptions = ["Pending", "Approved", "Rejected"];
  const [order, setOrder] = React.useState<"asc" | "desc">("asc");
  const [orderBy, setOrderBy] = React.useState<string>("ProjectName");
  const [projectFilter, setProjectFilter] = React.useState<string | undefined>( undefined  );
  const [statusFilter, setStatusFilter] = React.useState<string | undefined>(  undefined );
  const [taskTypeFilter, setTaskTypeFilter] = React.useState<   string | undefined >(undefined);
  let weekDates: any[] = [];
  let weekColumns: any[] = [];
  let groupedData;

  if (!selectedData || selectedData.length === 0) return null;

  const getStartOfWeek = (date: Date) => {
    const day = date.getDay(); 
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); 
    const startOfWeek = new Date(date);
    startOfWeek.setDate(diff);  
    return startOfWeek; 
  };
  
  const getWeekColumns = (startDate: any) => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startDate);
      d.setDate(startDate.getDate() + i); 
      return d;
    });
  };
  
  const getWeekDates = (date: Date) => {
    const startOfWeek = getStartOfWeek(new Date(date));
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(d.getDate() + i);
      return d;
    });
  };

  if(TableType === "TeamTimeSheet"){
    weekDates = getWeekDates(currentWeek);  
  }else{
    weekColumns = getWeekColumns(startDateOfWeek);
  }

  if(TableType === "TeamTimeSheet"){
    weekDates = getWeekDates(currentWeek);  
    groupedData = selectedData.reduce((acc: any, log: any) => {
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
        acc[key].LoggedHoursByDay[logDateString] = (acc[key].LoggedHoursByDay[logDateString] || 0) + log.LoggedHours;
      }
  
      return acc;   
    }, {});
  }else{
    groupedData = selectedData.reduce((acc: any, log: any) => {
      const logDate = new Date(log.Created);
  
      if (logDate >= weekColumns[0] && logDate <= weekColumns[6]) {
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
        acc[key].LoggedHoursByDay[logDateString] = (acc[key].LoggedHoursByDay[logDateString] || 0) + log.LoggedHours;
      }
      return acc;   
    }, {});
  }

  const groupedDataArray: TimeLogsData[] = Object.values(groupedData);
  const formatDate = (date?: Date): string => {
    if (date) {
      return date.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "numeric", }) .replace(",", "");
    }
    return "N/A";
  };

  const convertMinutesToHoursAndMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} H ${mins} M`;
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
    updatedTimeLogsData = updatedTimeLogsData.map((timeLog) => ({ ...timeLog, Status: "Approved",}));
    await updateRecords(spHttpClient, absoluteURL, "TimeLogforApproval", 0, updatedTimeLogsData, 0, setUpdateStatus, allTimeLogsData);
    handleTabChange("TeamTimeSheet");
    onClose();
    setSelected([]);
    setAlert(true);
    setApprovedAlert(true);
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
    updatedTimeLogsData = updatedTimeLogsData.map((timeLog) => ({ ...timeLog,Status: "Rejected", }));
    await updateRecords( spHttpClient, absoluteURL, "TimeLogforRejection", 0, updatedTimeLogsData,  0, setUpdateStatus , allTimeLogsData );
    handleTabChange("TeamTimeSheet");
    onClose();
    setSelected([]);
    setAlert(true);
    setRejectAlert(true);
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
        return "#0077B6";
      case "Not Submitted":
        return "#007bff";
      case "Rejected":
        return "#F72585";
      case "Approved":
        return "#41856A";
      default:
        return "#5C6B73";
    }
  };

  const handleProjectFilterChange = ( event: React.FormEvent<HTMLDivElement>, option?: any ) => {
    setProjectFilter(option?.key);
  };

  const handleStatusFilterChange = (  event: React.FormEvent<HTMLDivElement>,  option?: any ) => {
    setStatusFilter(option?.key);
  };

  const handleTaskTypeFilterChange = (event: React.FormEvent<HTMLDivElement>, option?: any ) => {
    setTaskTypeFilter(option?.key);
  };

  const filteredData = sortedData.filter((log: any) => {
    const matchesProject = projectFilter ? log.ProjectName === projectFilter: true;
    const matchesStatus = statusFilter ? log.Status === statusFilter : true;
    const matchesTaskType = taskTypeFilter ? log.BillableStatus === taskTypeFilter : true;
    return matchesProject && matchesStatus && matchesTaskType;
  });

  const resetFilters = () => {
    setTaskTypeFilter("");
    setStatusFilter("");
    setProjectFilter("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle sx={{ backgroundColor: "#0077B6", color: "white" }}>
        Time Sheet Details - {selectedData[0].Author.Title}
        <IconButton aria-label="close" onClick={onClose} sx={{ position: "absolute", right: 8, top: 8, color: (theme) => "#fff" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <div>
          <Box className={formStyle.FilterBox} >
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <Label style={{ fontWeight: "600" }}>Projects</Label>
                <Dropdown
                  placeholder="Select project"
                  selectedKey={projectFilter}
                  onChange={handleProjectFilterChange}
                  options={projectsData.sort((a:any, b:any) => a.ProjectName.localeCompare(b.ProjectName)).map((project:any) => ({
                    key: project.ProjectId,
                    text: project.ProjectName,
                  }))}
                  styles={{
                    root: { width: 230, height: 60, marginBottom: 5, borderWidth: 2},
                    title: { textAlign: "left", lineHeight: "25px"},
                    dropdownItemsWrapper: { maxHeight: 200 },
                    dropdownItem: { height: 35, borderRadius: 5, width: 230, backgroundColor: "#ffffff", },
                  }}
                />
              </Grid>

              <Grid item>
                <Label style={{ fontWeight: "600" }}>Status</Label>
                <Dropdown placeholder="Select status" selectedKey={statusFilter}  onChange={handleStatusFilterChange} options={statusOptions.map((status) => ({  key: status,  text: status, }))}
                  styles={{
                    root: { width: 230, height: 60, marginBottom: 5, borderWidth: 2 },
                    title: { textAlign: "left", lineHeight: "25px" },
                    dropdownItemsWrapper: { maxHeight: 200 },
                    dropdownItem: { height: 35, borderRadius: 5, width: 230, backgroundColor: "#ffffff" },
                  }}
                />
              </Grid>

              <Grid item>
                <Label style={{ fontWeight: "600" }}>Task Type</Label>
                <Dropdown  placeholder="Select Task Type" selectedKey={taskTypeFilter} onChange={handleTaskTypeFilterChange}  options={TaskTypeOptions.map((status) => ({  key: status,  text: status,  }))}
                  styles={{
                    root: { width: 230, height: 60, marginBottom: 5, borderWidth: 2},
                    title: { textAlign: "left", lineHeight: "25px" },
                    dropdownItemsWrapper: { maxHeight: 200 },
                    dropdownItem: { height: 35, borderRadius: 5, width: 230, backgroundColor: "#ffffff" },
                  }}
                />
              </Grid>

              <Grid item>
                <IconButton  aria-label="Reset" onClick={resetFilters} style={{  height: 31,  width: 31, marginLeft: 5,  border: "1px solid rgba(0, 0, 0, 0.4)", borderRadius:"0px", backgroundColor: "#ffffff",  marginBottom: 10,  marginTop: 5, }}  >
                  <img  src={require("../../assets/return.png")} alt="return" className={formStyle.ResetIcon} />
                </IconButton>
              </Grid>

              {TableType === "TeamTimeSheet" && (
                 <Grid item>
                 <Box className={formStyle.CalenderBox} >
                   <IconButton onClick={handlePreviousWeek}>  <ChevronLeft /></IconButton>
                   <img src={require("../../assets/calendars.png")} alt="Calendar" className={formStyle.calendarsIcon}  />
                   <IconButton onClick={handleNextWeek}> <ChevronRight /> </IconButton>
                   <span>  {formatDate(weekDates[0])} - {formatDate(weekDates[6])} </span>
                 </Box>
               </Grid>
              )}
             
            </Grid>
          </Box>
        </div>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <TableContainer>
            <Table  size="small" aria-label="collapsible table" className={styles.fontFamily} >
              <TableHead>
                <TableRow className={formStyle.TableRow}  >
                  {TableType === "TeamTimeSheet" && (
                    <TableCell padding="checkbox">
                      <Checkbox color="primary" indeterminate={  selected.length > 0 &&  selected.length < sortedData.length} checked={ sortedData.length > 0 &&selected.length === sortedData.length }  onChange={handleSelectAllClick} />
                    </TableCell>
                  )}

                  <TableCell sx={{  width: "14%", }} className={formStyle.FormCell} align="left"sortDirection={orderBy === "ProjectName" ? order : false} >
                    <TableSortLabel active={orderBy === "ProjectName"} sx={{color: "#fff" }} direction={orderBy === "ProjectName" ? order : "asc"} onClick={() => handleRequestSort("ProjectName")} >
                      Project
                    </TableSortLabel>
                  </TableCell>

                  <TableCell className={formStyle.FormCell} align="left" sx={{ width: "14%"}} sortDirection={orderBy === "JobName" ? order : false}  >
                    <TableSortLabel active={orderBy === "JobName"} direction={orderBy === "JobName" ? order : "asc"} onClick={() => handleRequestSort("JobName")} sx={{ color: "#fff",  }} >
                      Task
                    </TableSortLabel>
                  </TableCell>

                  <TableCell className={formStyle.FormCell} align="left" sx={{ width: "8%", }} sortDirection={orderBy === "Status" ? order : false} >
                    <TableSortLabel active={orderBy === "Status"}  direction={orderBy === "Status" ? order : "asc"} onClick={() => handleRequestSort("Status")} sx={{ color: "#fff" }} >
                      Status
                    </TableSortLabel>
                  </TableCell>

                  <TableCell className={formStyle.FormCell} align="left" sx={{ width: "8%" }} >
                    Task Type
                  </TableCell>
               
                  {
                    TableType === "TeamTimeSheet"
                      ? weekDates.map((date) => (
                          <TableCell className={formStyle.FormCell} key={date.toDateString()} align="center" sx={{ width: "8%" }}>
                            {formatDate(date)}
                          </TableCell>
                        ))
                      : TableType === "MyTimeSheet" && weekColumns.map((column) => (
                         <TableCell className={formStyle.FormCell}  align="center" sx={{ width: "8%" }}>
                            {formatDate(column)}
                              </TableCell>
                        ))
                  }


                </TableRow>
              </TableHead>
             
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((log: any, index: number) => {
                    const isApproved = log.Status === "Approved";
                    const isItemSelected = isSelected(log.TimelogsId);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    const borderColorforTaskType = getTaskTypeColor( log.BillableStatus );
                    const borderColorStatus = getStatusColor(log.Status);
                    const disabledStyle = { opacity: 0.7, pointerEvents: "none", };
                    const isJobName = log.JobName.length > 20;
                    const isProjectName = log.ProjectName.length > 20;

                    return (
                      <TableRow
                        // sx={{ ...(isApproved && disabledStyle) }}
                        key={log.TimelogsId}
                        hover={TableType === "TeamTimeSheet"}
                        onClick={TableType === "TeamTimeSheet" ? () => handleClick(log.TimelogsId) : undefined }
                        role={ TableType === "TeamTimeSheet" ? "checkbox" : undefined }
                        aria-checked={ TableType === "TeamTimeSheet" ? isItemSelected : undefined }
                        tabIndex={ TableType === "TeamTimeSheet" ? -1 : undefined }
                        selected={ TableType === "TeamTimeSheet" ? isItemSelected : undefined }
                      >
                        {TableType === "TeamTimeSheet" && !isApproved &&(
                          <TableCell padding="checkbox">
                            <Checkbox color="primary" checked={isItemSelected} inputProps={{  "aria-labelledby": labelId, }} />
                          </TableCell>
                        )}
                        
                        {TableType === "TeamTimeSheet" && isApproved && (
                          <TableCell/>
                        )}
                        
                        <TableCell className={styles.fontFamily}>
                          {isProjectName ? (
                            <Tooltip title={log.ProjectName}>
                              <span>{log.ProjectName.substring(0, 20)}...</span>
                            </Tooltip>
                          ) : (
                            log.ProjectName
                          )}
                        </TableCell>

                        <TableCell className={styles.fontFamily}>
                          {isJobName ? (
                            <Tooltip title={log.JobName}>
                              <span>{log.JobName.substring(0, 20)}...</span>
                            </Tooltip>
                          ) : (
                            log.JobName
                          )}
                        </TableCell>

                        <TableCell className={styles.fontFamily}>
                          <Box sx={{border: `2px solid ${borderColorStatus}`}} className={formStyle.statusBox}>
                            {log.Status}
                          </Box>
                        </TableCell>

                        <TableCell className={styles.fontFamily}>
                          <Box sx={{ border: `2px solid ${borderColorforTaskType}` }} className={formStyle.statusBox}>
                            {log.BillableStatus}
                          </Box>
                        </TableCell>
                        {TableType === "TeamTimeSheet" && (
                            weekDates.map((date) => {
                              const loggedHours = log.LoggedHoursByDay[date.toLocaleDateString("en-US")] || 0;
                              return (
                                <TableCell key={date.toDateString()} align="center" className={styles.fontFamily}>
                                  {loggedHours > 0 ? convertMinutesToHoursAndMinutes(loggedHours) : "-"}
                                </TableCell>
                              );
                            })
                        )}

                        {TableType === "MyTimeSheet" && (
                           weekColumns.map((date) => {
                            const loggedHours = log.LoggedHoursByDay[date.toLocaleDateString("en-US")] || 0;
                            return (
                              <TableCell key={date.toDateString()} align="center" className={styles.fontFamily}>
                                {loggedHours > 0 ? convertMinutesToHoursAndMinutes(loggedHours) : "-"}
                              </TableCell>
                            );
                          })
                        )}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={12}>
                      <Box className={formStyle.formNoDataText}>
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
        <DialogActions className={formStyle.dialogBox} >
          <Button onClick={handleApproved}  className={formStyle.ApprovedButton} >   Approve</Button>
          <Button onClick={handleReject} className={formStyle.RejectButton} > Reject</Button>
          <Button onClick={onClose}className={formStyle.CancelButton} > Cancel </Button>
        </DialogActions>
      )}

    </Dialog>
  );
};

export default TimeSheetForm;
