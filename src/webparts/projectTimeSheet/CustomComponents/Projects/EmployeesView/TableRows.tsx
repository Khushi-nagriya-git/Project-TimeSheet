import IconButton from "@mui/material/IconButton";
import { React, useState, Box, Table, TableBody, IProjectProps, TableCell, TableHead, TableRow, Typography, Avatar, Collapse, KeyboardArrowDownIcon, KeyboardArrowUpIcon,} from "../../../../../index";
import { Tooltip } from "@mui/material";
import RowStyles from "./EmployeeView.module.scss";
import { useNavigate } from 'react-router-dom';

const Row = (props: { row: ReturnType<any>;projectProps: IProjectProps; handleDeleteIconClick: any; handleEditIconClick: any; topNavigationMode: any; isUserReportingManager: any; isUserProjectManager: any; isUserAdmin: any; isUserProjectTeam: any; loggedInUserDetails: any;}) => {
  const { row, projectProps, handleDeleteIconClick, handleEditIconClick, loggedInUserDetails, topNavigationMode, } = props;
  const [open, setOpen] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "#FF5C5C";
      case "In Progress":
        return "#0077B6";
      case "Completed":
        return "#41856A";
      default:
        return "#5C6B73";
    }
  };
  const borderColor = getStatusColor(row.status);

  const convertMinutesToHoursAndMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} Hrs ${mins} Mins`;
  };

  const navigate = useNavigate();
  const isLongName = row.projectName.length > 30;

  const dashboardOpen = (projectId: number) => {
    navigate(`/Projects/${projectId}`);
  };

  return (
    <React.Fragment>
      <TableRow className={RowStyles.TableRowHeader} sx={{ "& > *": { borderBottom: "unset" }}} >
       
        <TableCell>
          <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)} >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>

        <TableCell component="th" scope="row" className={RowStyles.fontFamily} onClick={() => dashboardOpen(row.projectId)} >
          {row.projectId}
        </TableCell>

        <TableCell align="left" className={RowStyles.ParentTableCell} onClick={() => dashboardOpen(row.projectId)} >
          {isLongName ? (
            <Tooltip title={row.projectName}>
              <span>{row.projectName.substring(0, 30)}...</span>
            </Tooltip>
          ) : (
            row.projectName
          )}
        </TableCell>

        <TableCell align="left" className={RowStyles.ParentTableCell}  onClick={() => dashboardOpen(row.projectId)} >
          <Box className={RowStyles.AvatarBox}>
            <Avatar alt={row.projectManager} src={`${projectProps.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?accountname=${row.projectManagerEmail}&Size=S`} className={RowStyles.Avatar} />
            <Box sx={{ mt: 0.5 }}>{row.projectManager}</Box>
          </Box>
        </TableCell>

        <TableCell align="left" sx={{ height: "10px" }} onClick={() => dashboardOpen(row.projectId)} >
          <Box className={RowStyles.StatusBox} sx={{ border: `2px solid ${borderColor}`}}>
            {row.status}
          </Box>
        </TableCell>

        <TableCell align="left" sx={{ height: "10px" }}>
          <IconButton aria-label="Detail Logs" size="small">
            <img src={require("../../../assets/job.png")} alt="Tasks" className={RowStyles.taskIcon} onClick={() => setOpen(!open)} />
          </IconButton>
        </TableCell>

        <TableCell align="left" sx={{ height: "10px" }}>
              <Box className={RowStyles.IconBox}>
              {props.topNavigationMode === "Employee" && (props.isUserAdmin || props.loggedInUserDetails.Email === row.ReportingManagerPeoplePicker?.EMail) && (
                <><IconButton aria-label="edit" size="small" onClick={() => handleEditIconClick(row.projectId, "Edit")}>
                <img src={require("../../../assets/pencil.png")} alt="Edit" className={RowStyles.editIcon} />
                </IconButton><IconButton aria-label="delete" size="small" onClick={() => handleDeleteIconClick(row.projectId)}>
                  <img src={require("../../../assets/delete.png")} alt="Delete" className={RowStyles.deleteIcon} />
                </IconButton></>
              )}
             <IconButton aria-label="View" size="small" onClick={() => handleEditIconClick(row.projectId ,"View")} >
              <img src={require("../../../assets/show.png")} alt="View" className={RowStyles.deleteIcon} />
            </IconButton>
              </Box> 
           
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>

              <Typography variant="h6" gutterBottom component="div"  className={RowStyles.ChildTableHeader} >
                Project Tasks
              </Typography>

              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow className={RowStyles.ChildTableRow}>
                    <TableCell  align="left"  className={RowStyles.ChildTableCell} sx={{ width: "15%"}}>
                      Assigned By
                    </TableCell>

                    <TableCell align="left"  className={RowStyles.ChildTableCell} sx={{ width: "15%"}}>
                      Assigned To
                    </TableCell>

                    <TableCell align="left"  className={RowStyles.ChildTableCell} sx={{ width: "37%"}}>
                      Task Name
                    </TableCell>
                   
                    <TableCell align="left"  className={RowStyles.ChildTableCell} sx={{ width: "13%"}}>
                      Estimated Hour
                    </TableCell>
                    
                    <TableCell align="left"  className={RowStyles.ChildTableCell} sx={{ width: "10%"}}>
                      Logged Hours
                    </TableCell>

                    <TableCell align="left"  className={RowStyles.ChildTableCell} sx={{ width: "10%"}} >
                      Status
                    </TableCell>

                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow: any) => {
                    const isLongName = historyRow.JobName.length > 100;

                    return (
                      <TableRow key={historyRow.JobName}>
                        <TableCell align="left" className={RowStyles.ParentTableCell}>
                          <Box className={RowStyles.IconBox}>
                            <Avatar alt={historyRow.Author.Title} src={`${projectProps.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?accountname=${historyRow.Author.EMail}&Size=S`}className={RowStyles.ChildTableAvatar} />
                            <Box sx={{ mt: 0.5 }}> {historyRow.Author.Title}</Box>
                          </Box>
                        </TableCell>

                        <TableCell align="left" className={RowStyles.ParentTableCell} >
                          {JSON.parse(historyRow.AssignedTo).map(
                            (assignee: any) => (
                              <Box className={RowStyles.AvatarBox} key={assignee.EMail} >
                                <Avatar alt={assignee.name} src={`${projectProps.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?accountname=${assignee.email}&Size=S`}className={RowStyles.ChildTableAvatar}/>
                                <Box sx={{ mt: 0.5 }}>{assignee.name}</Box>
                              </Box>
                            )
                          )}
                        </TableCell>

                        <TableCell align="left" className={RowStyles.fontFamily} component="th"scope="row" >
                          {isLongName ? (
                            <Tooltip title={historyRow.JobName}>
                              <span>
                                {historyRow.JobName.substring(0, 100)}...
                              </span>
                            </Tooltip>
                          ) : (
                            historyRow.JobName
                          )}
                        </TableCell>

                        <TableCell align="left" className={RowStyles.fontFamily}>
                          {convertMinutesToHoursAndMinutes( historyRow.EstimatedHours ? historyRow.EstimatedHours : 0 )}
                        </TableCell>

                        <TableCell align="left" className={RowStyles.fontFamily} >
                          {convertMinutesToHoursAndMinutes( historyRow.loggedHours ? historyRow.loggedHours : 0 )}
                        </TableCell>

                        <TableCell align="left" className={RowStyles.fontFamily}>
                          {historyRow.JobStatus}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default Row;
