import { Tooltip } from "@mui/material";
import {
  React,
  IProjectProps,
  convertToMinutes,
  useState,
  Collapse,
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
  Typography,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
  Table,
  Box,
  IconButton,
  Avatar,
} from "../../../../../index";

const Row = (props: {
  row: ReturnType<any>;
  projectProps: IProjectProps;
  handleEditIconClick: any;
  loggedInUserDetails: any;
  handleDeleteIconClick: any;
}) => {
  const { row, projectProps, handleEditIconClick, handleDeleteIconClick } = props;
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

  const isLongName = row.jobName?.length > 20;
  const isProjectName = row.projectName?.length > 20;
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" }, height: "50px" , backgroundColor: "#fff"}}>

      <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        
        <TableCell
          component="th"
          scope="row"
          sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" ,color:"black"}}
        >
          <Box display="flex" alignItems="center"  >
            {isLongName ? (
              <Tooltip title={row.jobName}>
                <span>{row.jobName.substring(0, 20)}...</span>
              </Tooltip>
            ) : (
              row.jobName
            )}
          </Box>
        </TableCell>
        <TableCell
          component="th"
          scope="row"
          sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" , color:"black" }}
        >
          <Box display="flex" alignItems="center">
          {isProjectName ? (
                            <Tooltip title={row.projectName}>
                              <span>
                                {row.projectName.substring(0, 20)}...
                              </span>
                            </Tooltip>
                          ) : (
                            row.projectName
                          )}
          </Box>
        </TableCell>
        <TableCell
          align="left"
          sx={{
            height: "10px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",color:"black"
          }}
        >
          {row.startDate.split("T")[0]}
        </TableCell>

        <TableCell
          align="left"
          sx={{
            height: "10px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",color:"black"
          }}
        >
          {row.endDate.split("T")[0]}
        </TableCell>

        <TableCell
          align="left"
          sx={{
            height: "10px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",color:"black"
          }}
        >
          {convertMinutesToHoursAndMinutes(row.estimatedHours)}
        </TableCell>

        <TableCell align="left" sx={{ height: "10px" ,color:"black"}}>
          {convertMinutesToHoursAndMinutes(
            row.loggedHours ? row.loggedHours : 0
          )}
        </TableCell>

        <TableCell align="left" sx={{ height: "10px" , color:"black"}}>
          <Box
            sx={{
              borderRadius: "20px",
              border: `2px solid ${borderColor}`,
              height: "22px",
              width: "100px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            {row.status}
          </Box>
        </TableCell>

        <TableCell align="left" sx={{ height: "10px" }}>
          <IconButton aria-label="users" size="small">
            <img
              src={require("../../../assets/group.png")}
              alt="Assignees"
              style={{ width: "27px", height: "27px", cursor: "pointer" }}
              onClick={() => setOpen(!open)}
            />
          </IconButton>
        </TableCell>
        <TableCell align="left" sx={{ height: "10px" }}>
            <Box display="flex" alignItems="left" justifyContent="left">
              <IconButton
                aria-label="edit"
                size="small"
                onClick={() => handleEditIconClick(row.jobId)}
              >
                <img
                  src={require("../../../assets/pencil.png")}
                  alt="Edit"
                  style={{
                    width: "21px",
                    height: "21px",
                    cursor: "pointer",
                    alignItems: "left",
                    fontFamily:
                      "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                  }}
                />
              </IconButton>
              {props.loggedInUserDetails.Email === row.Author?.EMail && (
                  <IconButton
                  aria-label="delete"
                  size="small"
                  onClick={() => handleDeleteIconClick(row.jobId)}
                >
                  <img
                    src={require("../../../assets/delete.png")}
                    alt="Delete"
                    style={{
                      width: "23px",
                      height: "23px",
                      cursor: "pointer",
                      marginLeft: "5px",
                    }}
                  />
                </IconButton>
              )}
            

            </Box>
          </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={12}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                sx={{
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
              >
                Task Assignee
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#f3f2f1",
                      fontWeight: "600",color:"white",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    <TableCell
                      align="left"
                      sx={{
                        width: "20%",
                        fontWeight: "600",backgroundColor: "#0077B6",color:"white",
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      Assignee Name
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        width: "20%",
                        fontWeight: "600",backgroundColor: "#0077B6",color:"white",
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      Estimated Hour
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        width: "20%",
                        fontWeight: "600",backgroundColor: "#0077B6",color:"white",
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      Logged Hours
                    </TableCell>
                    {/* <TableCell
                      align="left"
                      sx={{
                        width: "20%",
                        fontWeight: "600",
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      Status
                    </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.history?.map((historyRow: any) => (
                    <TableRow key={historyRow.JobName}>
                      <TableCell
                        align="left"
                        component="th"
                        scope="row"
                        sx={{
                          fontFamily:
                            "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                            color:"black"
                        }}
                      >
                        <Box
                          display="flex"
                          alignItems="left"
                          justifyContent="left"
                        >
                          <Avatar
                            alt={row.projectManager}
                            src={`${projectProps.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?accountname=${historyRow.email}&Size=S`}
                            style={{
                              marginRight: 8,
                              height: "25px",
                              width: "25px",
                            }}
                          />
                          <Box sx={{ mt: 0.5 ,color:"black"}}>{historyRow.name}</Box>
                        </Box>
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          fontFamily:
                            "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",color:"black"
                        }}
                      >
                        {convertMinutesToHoursAndMinutes(
                          convertToMinutes(historyRow.estimatedHours)
                        )}{" "}
                      </TableCell>
                      <TableCell
                        align="left"
                        sx={{
                          fontFamily:
                            "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",color:"black"
                        }}
                      >
                        {convertMinutesToHoursAndMinutes(
                        
                            historyRow.loggedHours ? historyRow.loggedHours : 0
                          
                        )}
                      </TableCell>
                      {/* <TableCell
                        align="left"
                        sx={{
                          fontFamily:
                            "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                        }}
                      >
                        {historyRow.JobStatus}
                      </TableCell> */}
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
