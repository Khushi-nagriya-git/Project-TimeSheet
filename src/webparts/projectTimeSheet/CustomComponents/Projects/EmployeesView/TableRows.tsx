import IconButton from '@mui/material/IconButton';
import {React,useState,Box,Table, convertToMinutes,TableBody,IProjectProps,TableCell,TableHead,TableRow, Typography, Avatar,Collapse,KeyboardArrowDownIcon,KeyboardArrowUpIcon,} from "../../../../../index"

const Row = (props: {
  row: ReturnType<any>;
  projectProps: IProjectProps;
  handleDeleteIconClick: any;
  handleEditIconClick:any;
  topNavigationMode:any;
  isUserReportingManager: any;
  isUserProjectManager: any;
  isUserAdmin: any;
  isUserProjectTeam: any;
}) => {
  const { row, projectProps,handleDeleteIconClick ,handleEditIconClick , topNavigationMode} = props;
  const [open, setOpen] = useState(false);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "#FFB6C1";
      case "In Progress":
        return "#007bff";
      case "Completed":
        return "#65B741";
      default:
        return "#9D9D9D";
    }
  };
  const borderColor = getStatusColor(row.status);

  const convertMinutesToHoursAndMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} Hrs ${mins} Mins`;
  };
  
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } ,height:"50px",}}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row" sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
          {row.projectId}
        </TableCell>
        <TableCell align="left" sx={{ height: "10px" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
          {row.projectName}
        </TableCell>
        <TableCell align="left" sx={{ height: "10px" ,  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
          <Box display="flex" alignItems="left" justifyContent="left">
            <Avatar
              alt={row.projectManager}
              src={`${projectProps.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?accountname=${row.projectManagerEmail}&Size=S`}
              style={{ marginRight: 8, height: "30px", width: "30px" }}
            />
            <Box sx={{ mt: 0.5 }}>{row.projectManager}</Box>
          </Box>
        </TableCell>
        <TableCell align="left" sx={{ height: "10px" }}>
          <Box
            sx={{
              borderRadius: "20px",
              border: `2px solid ${borderColor}`,
              height: "30px",
              width: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}
          >
            {row.status}
          </Box>
        </TableCell>

        <TableCell align="left" sx={{ height: "10px" }}>
          <IconButton aria-label="Detail Logs" size="small">
            <img
              src={require("../../../assets/jobgray.png")}
              alt="Jobs"
              style={{ width: "21px", height: "21px", cursor: "pointer" }}
              onClick={() => setOpen(!open)}
            />
          </IconButton>
        </TableCell>
        
        {props.topNavigationMode === "Employee" &&(props.isUserAdmin || props.isUserReportingManager) && (
            <TableCell align="left" sx={{ height: "10px" }}>
            <Box display="flex" alignItems="left" justifyContent="left">
              <IconButton
                aria-label="edit"
                size="small"
                onClick={() => handleEditIconClick(row.projectId)}
              >
                <img
                  src={require("../../../assets/edit.png")}
                  alt="Edit"
                  style={{
                    width: "21px",
                    height: "21px",
                    cursor: "pointer",
                    alignItems: "left",
                    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                  }}
                />
              </IconButton>
              <IconButton
                aria-label="delete"
                size="small"
               onClick={() => handleDeleteIconClick(row.projectId)}
              >
                <img
                  src={require("../../../assets/delete.png")}
                  alt="Delete"
                  style={{
                    width: "21px",
                    height: "21px",
                    cursor: "pointer",
                    marginLeft: "5px",
                  }}
                />
              </IconButton>
            </Box>
          </TableCell>
        )}
      
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div" sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
                Project Jobs
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#f3f2f1" , fontWeight:"600" ,  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                    <TableCell align="left" sx={{ width: "40%" , fontWeight:"600" ,  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
                      Job Name
                    </TableCell>
                    <TableCell align="left" sx={{ width: "20%" , fontWeight:"600" ,  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                      Estimated Hour
                    </TableCell>
                    <TableCell align="left" sx={{ width: "20%" , fontWeight:"600" ,  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                      Logged Hours
                    </TableCell>
                    <TableCell align="left" sx={{ width: "20%" , fontWeight:"600" ,  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history.map((historyRow:any) => (
                    <TableRow key={historyRow.JobName}>
                      <TableCell align="left" component="th" scope="row" sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
                        {historyRow.JobName}
                      </TableCell>
                      <TableCell align="left" sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>{convertMinutesToHoursAndMinutes(historyRow.EstimatedHours ? historyRow.EstimatedHours : 0)}</TableCell>
                      <TableCell align="left" sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>{convertMinutesToHoursAndMinutes(historyRow.loggedHours ? historyRow.loggedHours : 0)}</TableCell>
                      <TableCell align="left" sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>{historyRow.JobStatus}</TableCell>
                    </TableRow>
                  ))}
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