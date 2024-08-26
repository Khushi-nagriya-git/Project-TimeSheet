import {
    React,
    Box,
    TableCell,
    TableBody,
    Table,
    TableContainer,
    TableRow,
    TableHead,
    useEffect,
    Grid,
    Avatar,
    useState,
  } from "../../../../../index";
import TimeSheetForm from "../ApproveRejectForm";
  const TimeSheetTable = (props: {
    absoluteURL: any;
    spHttpClient: any;
    loggedInUserDetails: any;
    setTimeLogsData: any;
    timeLogsData: any;
  }) => {
    const [selectedWeekData, setSelectedWeekData] = useState<any[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
  
    const handleRowClick = (weekData: any[]) => {
      setSelectedWeekData(weekData);
      setIsFormOpen(true);
    };
  
    const handleCloseForm = () => {
      setIsFormOpen(false);
      setSelectedWeekData([]);
    };
  
    const groupByWeek = (timeLogs: any[]) => {
      const weeks: { [key: string]: { startDate: Date; endDate: Date; logs: any[] } } = {};
  
      timeLogs.forEach((timeLog) => {
        const logDate = new Date(timeLog.Created);
        const startOfWeek = new Date(
          logDate.setDate(logDate.getDate() - logDate.getDay())
        );
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
  
        const weekKey = startOfWeek.toISOString().split("T")[0];
  
        if (!weeks[weekKey]) {
          weeks[weekKey] = {
            startDate: startOfWeek,
            endDate: endOfWeek,
            logs: [],
          };
        }
  
        weeks[weekKey].logs.push(timeLog);
      });
  
      return weeks;
    };
  
    const formatDateRange = (startDate: Date, endDate: Date) => {
      const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
      const start = startDate.toLocaleDateString('en-US', options);
      const end = endDate.toLocaleDateString('en-US', options);
      return `${start} - ${end}`;
    };
  
    const groupedTimeLogs = groupByWeek(props.timeLogsData);
  
    return (
      <>
        <Box sx={{ height: "285px", marginTop: "10px", overflow: "auto" }}>
          <TableContainer>
            <Table size="small" stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      backgroundColor: "#f3f2f1",
                      height: "20px",
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    Employee Name
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      backgroundColor: "#f3f2f1",
                      height: "20px",
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    Date Range
                  </TableCell>
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      backgroundColor: "#f3f2f1",
                      height: "20px",
                      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    Status
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(groupedTimeLogs).map((weekKey) => (
                  <TableRow
                    key={weekKey}
                    onClick={() => handleRowClick(groupedTimeLogs[weekKey].logs)}
                    style={{ cursor: 'pointer' }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="left" justifyContent="left">
                        <Box sx={{ mt: 0.5 }}>
                          {groupedTimeLogs[weekKey].logs[0].Author.Title}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      {formatDateRange(
                        groupedTimeLogs[weekKey].startDate,
                        groupedTimeLogs[weekKey].endDate
                      )}
                    </TableCell>
                    <TableCell align="left" sx={{ height: "10px" }}>
                      <Box
                        sx={{
                          borderRadius: "20px",
                          borderColor: "red",
                          height: "30px",
                          width: "100px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontFamily:
                            "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        }}
                      >
                        {groupedTimeLogs[weekKey].logs[0].Status}
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
  
        <TimeSheetForm open={isFormOpen} onClose={handleCloseForm} selectedData={selectedWeekData} />
    
      </>
    );
  };
  
  export default TimeSheetTable;