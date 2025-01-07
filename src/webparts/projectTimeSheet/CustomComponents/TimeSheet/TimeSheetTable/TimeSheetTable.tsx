import { React, Box, TableCell, TableBody, Table, TableContainer, TableRow, TableHead, useState, Avatar,  Alert,  useEffect, formStyle,} from "../../../../../index";
import TimeSheetForm from "../ApproveRejectForm";
import { ITimeSheetProps } from "../ITimeSheetProps";
import styles from "../TimeSheet.module.scss";
const TimeSheetTable = (props: {absoluteURL: any; spHttpClient: any; loggedInUserDetails: any;allTimeLogsData:any; timeLogsData: any; myDataActiveLink: any; TableType: any; updateStatus: any; TimeSheetProps: ITimeSheetProps; handleTabChange: (tab: string) => Promise<void>; setUpdateStatus: React.Dispatch<React.SetStateAction<any>>;projectsData:any}) => {
  const [selectedWeekData, setSelectedWeekData] = useState<any[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [alert, setAlert] = useState(false);
  const [rejectAlert, setRejectAlert] = useState(false);
  const [approvedAlert, setApprovedAlert] = useState(false);
  const [selected, setSelected] = React.useState<string[]>([]);
  const [startDateOfWeek, setStartDateOfWeek] = React.useState(new Date());

  const handleRowClick = (weekData: any[] , startDateOfWeek:any) => {
    setSelectedWeekData(weekData);
    setIsFormOpen(true);
    setStartDateOfWeek(startDateOfWeek);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedWeekData([]);
    setSelected([]);
  };

  const groupByWeekOrAuthor = (timeLogs: any[]) => {
    const groups: { [key: string]: { startDate?: Date; endDate?: Date; logs: any[] }; } = {};

    timeLogs.forEach((timeLog) => {
      let groupKey = "";
      let startOfWeek, endOfWeek;

      if (props.TableType === "TeamTimeSheet") {         
        groupKey = timeLog.Author.Title;
      } else if (props.TableType === "MyTimeSheet") {
        const logDate = new Date(timeLog.Created);
        const dayOfWeek = logDate.getDay();
        const diffToMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); 
        startOfWeek = new Date(logDate);
        startOfWeek.setDate(logDate.getDate() - diffToMonday);
        endOfWeek = new Date(startOfWeek); 
        endOfWeek.setDate(startOfWeek.getDate() + 5); 
  
        const adjustedEndOfWeek = new Date(endOfWeek);
        adjustedEndOfWeek.setDate(endOfWeek.getDate() + 1); 
  
        // Format the key to represent the full week range
        groupKey = `${startOfWeek.toISOString().split("T")[0]} - ${adjustedEndOfWeek.toISOString().split("T")[0]}`;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = {
          startDate: startOfWeek,
          endDate: endOfWeek,
          logs: [],
        };
      }
      groups[groupKey].logs.push(timeLog);
    });
    return groups;
  };

  const formatDateRange = (startDate: Date, endDate: Date) => {
    const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric", year: "numeric", };
    const start = startDate.toLocaleDateString("en-US", options);
    const end = endDate.toLocaleDateString("en-US", options);
    return `${start} - ${end}`;
  };

  const groupedTimeLogs = groupByWeekOrAuthor(props.timeLogsData);

  useEffect(() => {
    let timer: any;
    if ( rejectAlert || approvedAlert ) {
      timer = setTimeout(() => {
        setRejectAlert(false);
        setApprovedAlert(false);
        setAlert(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [approvedAlert, rejectAlert]);

  return (
    <>
      <Box sx={{ height: "calc(100vh - 250px)", marginTop: "10px", overflow: "auto" }}>
        <TableContainer>
          <Table size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {props.myDataActiveLink === "TeamTimeSheet" && (
                  <TableCell className={styles.timeSheetTableCell}>
                    Employee Name
                  </TableCell>
                )}

                {props.TableType === "MyTimeSheet" && (
                  <TableCell className={styles.timeSheetTableCell} >
                    Date Range  
                  </TableCell>  
                )}  

                <TableCell align="left" className={styles.timeSheetTableCell} >
                  Status
                </TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(groupedTimeLogs).length > 0 ? (
                Object.keys(groupedTimeLogs).map((groupKey) => (
                  <TableRow key={groupKey} onClick={() => handleRowClick(groupedTimeLogs[groupKey].logs , groupedTimeLogs[groupKey].startDate) } style={{ cursor: "pointer" ,  backgroundColor: "#fff"}} >
                    {props.myDataActiveLink === "TeamTimeSheet" && (
                      <TableCell>
                        <Box className={styles.AvatarBox}  >
                          <Avatar alt={groupKey} src={`${props.TimeSheetProps.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?accountname=${groupedTimeLogs[groupKey].logs[0].Author.EMail}&Size=S`} style={{ marginRight: 8, height: "30px", width: "30px",}} />
                          <Box sx={{ mt: 0.5 }}>{groupKey}</Box>
                        </Box>
                      </TableCell>
                    )}
                    {props.TableType === "MyTimeSheet" && (
                      <TableCell>
                        {props.TableType === "MyTimeSheet" &&
                        groupedTimeLogs[groupKey].startDate ? formatDateRange(groupedTimeLogs[groupKey].startDate!,  groupedTimeLogs[groupKey].endDate! )
                          : "N/A"}
                      </TableCell>
                    )}
                    <TableCell align="left" sx={{ height: "10px" }}>
                      <Box className={styles.timeSheetTableStatusCell} >
                        {groupedTimeLogs[groupKey].logs[0].Status}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={12}>
                    <Box className={styles.formNoDataText} >
                      No data found
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {alert && (
        <Alert severity={rejectAlert ? "warning" : "success"} onClose={function (): void { setRejectAlert(false); setApprovedAlert(false);}} className={styles.Alert} >
          {rejectAlert ? "Timesheet Rejected!" : approvedAlert ? "Timesheet approved!" : ""}
        </Alert>
      )}
      
      <TimeSheetForm open={isFormOpen} onClose={handleCloseForm} selectedData={selectedWeekData} allTimeLogsData = {props.allTimeLogsData} spHttpClient={props.spHttpClient} absoluteURL={props.absoluteURL} setUpdateStatus={props.setUpdateStatus} updateStatus={props.updateStatus} TableType={props.TableType} setApprovedAlert = {setApprovedAlert} setRejectAlert = {setRejectAlert} setAlert = {setAlert} selected = {selected} setSelected = {setSelected} handleTabChange={props.handleTabChange} startDateOfWeek = {startDateOfWeek} projectsData = {props.projectsData}/>
    </>
  );
};

export default TimeSheetTable;
