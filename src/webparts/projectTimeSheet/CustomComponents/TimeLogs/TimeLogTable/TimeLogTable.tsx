import { React, Box,TableCell,TableBody, Table, TableContainer, TableRow, TableHead,useEffect, Grid,} from "../../../../../index";
import { getTimeLogsListData } from "../Services";
import TimeLogRows from "./TimeLogRows";
import Styles from "../TimeLog.module.scss";

const TimeLogTable = (props: { absoluteURL: any; spHttpClient: any; loggedInUserDetails:any; isUserAdmin:any; timelogProps:any ;filteredTimeLogsData:any;isUserReportingManager:any;currentUserDetails:any ; isRunning:any ; elapsedTime:any ; setTimeLogsData:React.Dispatch<React.SetStateAction<any>> ; timeLogsData:any ; jobResumeTimer:any;handleStartStop:any ; setDeletedTimelogId:React.Dispatch<React.SetStateAction<any>> ; setIsOpen:React.Dispatch<React.SetStateAction<any>>;setIsRunning: React.Dispatch<React.SetStateAction<any>>; setEditTimeLogId: React.Dispatch<React.SetStateAction<any>> ; setInitialFormData:React.Dispatch<React.SetStateAction<any>>; setEditFormOpen:React.Dispatch<React.SetStateAction<any>>}) => {

  useEffect(() => {
    getTimeLogsListData(props.absoluteURL, props.spHttpClient, props.setTimeLogsData,props.loggedInUserDetails,"TimeLogs",props.isUserAdmin,props.isUserReportingManager );
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
    //  console.error(`Timelog with ID ${timelogId} not found.`);
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
  
  function createData( TimeLogsId: number, ProjectId: number, ProjectName: string, JobId: number, JobName: string, BillableStatus: string, Description: string, LoggedTime: string,EstimatedHours: number, Created:'', Status:string   ) {
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
      Status 
    };
  }

  return (
    <div style={{ overflowY: "auto",  height: "calc(100vh - 300px)" , marginTop: "-15px" }}>
      <Grid item xs={12}>
        <div style={{ height: "100%", overflow: "auto" }}>
          <TableContainer>
            <Table size="small" aria-label="collapsible table" sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", }}>
              <TableHead>
           
                <TableRow sx={{ height: "40px", background: "#f3f2f1" }}>
                  <TableCell className={Styles.TimeLogTableCell} sx={{ width: "18%", }} align="left">
                    Project Name
                  </TableCell>
                    
                  <TableCell className={Styles.TimeLogTableCell} sx={{ width: "18%", }} align="left">
                    Task Name
                  </TableCell>
                 
                  <TableCell className={Styles.TimeLogTableCell} sx={{ width: "20%", }} align="left"> 
                    Description
                  </TableCell>
                  <TableCell className={Styles.TimeLogTableCell} sx={{ width: "10%", }} align="left">
                  
                    Status
                  </TableCell>

                  <TableCell className={Styles.TimeLogTableCell} sx={{ width: "10%", }} align="left">
                    Task Type
                  </TableCell>

                  <TableCell className={Styles.TimeLogTableCell} sx={{ width: "10%", }} align="left">
                    Logged Time
                  </TableCell>

                  <TableCell className={Styles.TimeLogTableCell} sx={{ width: "3%", }} align="left" >
                  </TableCell>

                  <TableCell sx={{  width: "10%", }} className={Styles.TimeLogTableCell} align="left" >
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
                      row.Status                     
                    );

                    return (
                      <TimeLogRows key={rowData.TimeLogsId} row={rowData} handleDeleteIconClick={handleDeleteIconClick} handleEditIconClick={handleEditIconClick} timelogProps={props.timelogProps} elapsedTime={props.elapsedTime} isRunning={props.isRunning} handleStartStop={props.handleStartStop}  jobResumeTimer={props.jobResumeTimer} setIsRunning={props.setIsRunning} />
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Box className={Styles.NoDataAvaliable} >
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
