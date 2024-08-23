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
} from "../../../../../index";
import { getTimeLogsListData } from "../Services";
import TimeLogRows from "./TimeLogRows";

const TimeLogTable = (props: { absoluteURL: any; spHttpClient: any; loggedInUserDetails:any; timelogProps:any ;filteredTimeLogsData:any; currentUserDetails:any ; isRunning:any ; elapsedTime:any ; setTimeLogsData:React.Dispatch<React.SetStateAction<any>> ; timeLogsData:any ; jobResumeTimer:any;handleStartStop:any ; setDeletedTimelogId:React.Dispatch<React.SetStateAction<any>> ; setIsOpen:React.Dispatch<React.SetStateAction<any>>;setIsRunning: React.Dispatch<React.SetStateAction<any>>; setEditTimeLogId: React.Dispatch<React.SetStateAction<any>> ; setInitialFormData:React.Dispatch<React.SetStateAction<any>>; setEditFormOpen:React.Dispatch<React.SetStateAction<any>>}) => {

  useEffect(() => {
    getTimeLogsListData(props.absoluteURL, props.spHttpClient, props.setTimeLogsData,props.loggedInUserDetails);
    props.setTimeLogsData(props.filteredTimeLogsData);
  }, []);

 

  const handleDeleteIconClick = async (timelogId: number) => {
    props.setIsOpen(true);
    props.setDeletedTimelogId(timelogId)
  };

  const handleEditIconClick = async (timelogId: number) => {
    props.setEditTimeLogId(timelogId);
  
    const timelog = props.timeLogsData.find(
      (row: any) => row.TimelogsId === timelogId
    );
  
    if (!timelog) {
      console.error(`Timelog with ID ${timelogId} not found.`);
      return;
    }
  
    props.setInitialFormData({
      TimeLogsId: timelogId,
      ProjectId: timelog.ProjectId,
      ProjectName: timelog.ProjectName,
      JobId: timelog.JobId,
      JobName: timelog.JobName,
      BillableStatus: timelog.BillableStatus,
      Description: timelog.Description,
      LoggedHours: timelog.LoggedHours,
      EstimatedHours: timelog.EstimatedHours,
      
      
    });
  
    props.setEditFormOpen(true);
  };
  
  function createData(
    TimeLogsId: number,
    ProjectId: number,
    ProjectName: string,
    JobId: number,
    JobName: string,
    BillableStatus: string,
    Description: string,
    LoggedTime: string,
    EstimatedHours: number,
    
    Created:'',  
  ) {
    return {
      TimeLogsId,
      ProjectId,
      ProjectName,
      JobId,
      JobName,
      BillableStatus,
      Description,
      LoggedTime,
      EstimatedHours,
      history:[] ,
      Created,  
    };
  }

  return (
    <div style={{ overflowY: "auto", height: "285px", marginTop: "-15px" }}>
      <Grid item xs={12}>
        <div style={{ height: "100%", overflow: "auto" }}>
          <TableContainer>
            <Table
              size="small"
              aria-label="collapsible table"
              sx={{
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              }}
            >
              <TableHead>
           
                <TableRow sx={{ height: "40px", background: "#f3f2f1" }}>
                <TableCell sx={{width: "5%"}} />
                  <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "18%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                      //color:"#323130",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    Project Name
                  </TableCell>
                    
                  <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "18%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                      //color:"#323130",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                    align="left"
                  >
                    Job Name
                  </TableCell>
                  {/* <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "10%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                      //color:"#323130",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    Job Assignes
                  </TableCell> */}
                  <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "20%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                      //color:"#323130",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                    align="left"
                  >
                    Description
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "10%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                      // color:"#323130",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                    align="left"
                  >
                    Billable Status 
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "10%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                      // color:"#323130",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                    align="left"
                  >
                    Logged Time
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "3%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                      // color:"#323130",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                    align="left"
                  >
                  </TableCell>
                  <TableCell
                    sx={{
                      padding: "4px 16px",
                      fontWeight: "600",
                      width: "10%",
                      position: "sticky",
                      top: 0,
                      backgroundColor: "#f3f2f1",
                      zIndex: 1,
                      // color:"#323130",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                    align="left"
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {props.filteredTimeLogsData.length > 0 ? (
                 props.filteredTimeLogsData.map((row: any) => {
                    const rowData = createData(
                      row.TimelogsId,
                      row.ProjectId,
                      row.ProjectName,
                      row.JobId,
                      row.JobName,
                      row.BillableStatus,
                      row.Description,
                      row.LoggedHours,
                      row.EstimatedHours,
                      row.Created,                      
                    );

                    return (
                      <TimeLogRows
                        key={rowData.TimeLogsId}
                        row={rowData}
                        handleDeleteIconClick={handleDeleteIconClick}
                        handleEditIconClick={handleEditIconClick}
                        timelogProps={props.timelogProps}
                        elapsedTime={props.elapsedTime}
                        isRunning={props.isRunning}
                        handleStartStop={props.handleStartStop} 
                        jobResumeTimer={props.jobResumeTimer}
                        setIsRunning={props.setIsRunning}
                        />
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
        </div>
      </Grid>
    </div>
  );
};

export default TimeLogTable;
