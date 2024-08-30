import {
  React,
  Box,
  TableCell,
  TableBody,
  Table,
  TableContainer,
  TableRow,
  TableHead,
  useState,
} from "../../../../../index";
import TimeSheetForm from "../ApproveRejectForm";
const TimeSheetTable = (props: {
  absoluteURL: any;
  spHttpClient: any;
  loggedInUserDetails: any;
  timeLogsData: any;
  myDataActiveLink: any;
  TableType: any;
  updateStatus: any;
  setUpdateStatus:React.Dispatch<React.SetStateAction<any>>;
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

  const groupByWeekOrAuthor = (timeLogs: any[]) => {
    const groups: {
      [key: string]: { startDate?: Date; endDate?: Date; logs: any[] };
    } = {};

    timeLogs.forEach((timeLog) => {
      let groupKey = "";
      let startOfWeek, endOfWeek;

      if (props.TableType === "TeamTimeSheet") {
        groupKey = timeLog.Author.Title;
      } else if (props.TableType === "MyTimeSheet") {
        const logDate = new Date(timeLog.Created);
        startOfWeek = new Date(
          logDate.setDate(logDate.getDate() - logDate.getDay())
        );
        endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        groupKey = startOfWeek.toISOString().split("T")[0];
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
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    const start = startDate.toLocaleDateString("en-US", options);
    const end = endDate.toLocaleDateString("en-US", options);
    return `${start} - ${end}`;
  };

  const groupedTimeLogs = groupByWeekOrAuthor(props.timeLogsData);

  return (
    <>
      <Box sx={{ height: "285px", marginTop: "10px", overflow: "auto" }}>
        <TableContainer>
          <Table size="small" stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {props.myDataActiveLink === "TeamTimeSheet" && (
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      backgroundColor: "#f3f2f1",
                      height: "20px",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    Employee Name
                  </TableCell>
                )}
                {props.TableType === "MyTimeSheet" && (
                  <TableCell
                    sx={{
                      fontWeight: "600",
                      backgroundColor: "#f3f2f1",
                      height: "20px",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    Date Range
                  </TableCell>
                )}

                <TableCell
                  sx={{
                    fontWeight: "600",
                    backgroundColor: "#f3f2f1",
                    height: "20px",
                    fontFamily:
                      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  }}
                >
                  Status
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(groupedTimeLogs).map((groupKey) => (
                <TableRow
                  key={groupKey}
                  onClick={() => handleRowClick(groupedTimeLogs[groupKey].logs)}
                  style={{ cursor: "pointer" }}
                >
                  {props.myDataActiveLink === "TeamTimeSheet" && (
                    <TableCell>
                      <Box
                        display="flex"
                        alignItems="left"
                        justifyContent="left"
                      >
                        <Box sx={{ mt: 0.5 }}>{groupKey}</Box>
                      </Box>
                    </TableCell>
                  )}
                  {props.TableType === "MyTimeSheet" && (
                    <TableCell>
                      {props.TableType === "MyTimeSheet" &&
                      groupedTimeLogs[groupKey].startDate
                        ? formatDateRange(
                            groupedTimeLogs[groupKey].startDate!,
                            groupedTimeLogs[groupKey].endDate!
                          )
                        : "N/A"}
                    </TableCell>
                  )}

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
                      {groupedTimeLogs[groupKey].logs[0].Status}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <TimeSheetForm
        open={isFormOpen}
        onClose={handleCloseForm}
        selectedData={selectedWeekData}
        spHttpClient={props.spHttpClient}
        absoluteURL={props.absoluteURL}
        setUpdateStatus={props.setUpdateStatus}
        updateStatus={props.updateStatus}
      />
    </>
  );
};

export default TimeSheetTable;
