import IconButton from "@mui/material/IconButton";
import {
  React,
  useState,
  Box,
  Table,
  convertToMinutes,
  TableBody,
  IProjectProps,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Avatar,
  Collapse,
  KeyboardArrowDownIcon,
  KeyboardArrowUpIcon,
} from "../../../../../index";

const TimeLogRows = (props: {
  row: ReturnType<any>;
  handleDeleteIconClick: any;
  handleEditIconClick: any;
  timelogProps: any;
  isRunning: any;
  elapsedTime: any;
  handleStartStop:any;
  jobResumeTimer:any;
  setIsRunning:React.Dispatch<React.SetStateAction<any>>;
  
}) => {
  const { row, handleDeleteIconClick, handleEditIconClick } = props;
  const [open, setOpen] = useState(false);
  let timerTimeLogId = parseInt(localStorage.getItem("TimeLogId") || "0", 10);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Non Billable":
        return "#65B741";
      case "Billable":
        return "#FFB6C1";
      default:
        return "#9D9D9D";
    }
  };
  const borderColor = getStatusColor(row.BillableStatus);

  const convertMinutesToHoursAndMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} Hrs ${mins} Mins`;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSecs = secs < 10 ? `0${secs}` : `${secs}`;
    return `${formattedHours}:${formattedMinutes}:${formattedSecs}`;
  };

  const today = new Date();

  const year = today.getFullYear();
  const month =
    (today.getMonth() + 1).toString().length === 1
      ? "0" + (today.getMonth() + 1).toString()
      : (today.getMonth() + 1).toString();
  const day =
    today.getDate().toString().length === 1
      ? "0" + today.getDate().toString()
      : today.getDate().toString();
  const formattedDate = `${year}-${month}-${day}`;

  const cellContent =
    props.isRunning &&
    timerTimeLogId === row.TimeLogsId &&
    row.LoggedTime === 0;

  let showButton = row.Created.split("T")[0] === formattedDate;

  const handleClickStart = (id:number) => {
    if (props.isRunning) {
      alert("Timer is already running. Stop it to resume this task timer.");
      return;
    } else {
      localStorage.setItem("TimeLogId" , id as unknown as string);
      props.jobResumeTimer(id);
      props.setIsRunning(true);
      showButton=true;
      timerTimeLogId = id ;

    }
  };

  const handleClickPause = () => {
    props.handleStartStop();
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" }, height: "50px" }}>
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
          sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
        >
          {row.ProjectName}
        </TableCell>
        <TableCell
          align="left"
          sx={{
            height: "10px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          {row.JobName}
        </TableCell>
        {/* <TableCell align="left" sx={{ height: "10px" ,  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
          <Box display="flex" alignItems="left" justifyContent="left">
            <Avatar
              alt={row.projectManager}
              src={`${props.timelogProps.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?accountname=${row.projectManagerEmail}&Size=S`}
              style={{ marginRight: 8, height: "30px", width: "30px" }}
            />
            <Box sx={{ mt: 0.5 }}>{row.projectManager}</Box>
          </Box>
        </TableCell> */}
        <TableCell
          align="left"
          sx={{
            height: "10px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          {row.Description}
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
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            {row.BillableStatus}
          </Box>
        </TableCell>

        <TableCell
          align="left"
          sx={{
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          {props.isRunning &&
          timerTimeLogId === row.TimeLogsId
            ? formatTime(props.elapsedTime)
            : convertMinutesToHoursAndMinutes(row.LoggedTime)}
        </TableCell>
        <TableCell align="left" sx={{ height: "10px" }}>
          {showButton &&
            (props.isRunning &&
            timerTimeLogId === row.TimeLogsId ? (
              <IconButton
              aria-label="edit"
              size="small"
              onClick={handleClickPause}
            >
              <img
              src={require("../../../assets/pause.png")}
              alt="Pause Button"
              style={{ cursor: "pointer", height: "21px", width: "21px" }}
            />
            </IconButton>
            ) : (
              <IconButton
              aria-label="edit"
              size="small"
              onClick={() => handleClickStart(row.TimeLogsId ? row.TimeLogsId : 0)}
            >
              <img
              src={require("../../../assets/play.png")}
              alt="Play Button"
              onClick={() => handleClickStart(row.TimeLogsId ? row.TimeLogsId : 0)}
              style={{ cursor: "pointer", height: "21px", width: "21px" }}
            />
            </IconButton>
            ))}
        </TableCell>

        <TableCell align="left" sx={{ height: "10px" }}>
          <Box display="flex" alignItems="left" justifyContent="left">
            <IconButton
              aria-label="edit"
              size="small"
              onClick={() => handleEditIconClick(row.TimeLogsId)}
            >
              <img
                src={require("../../../assets/edit.png")}
                alt="Edit"
                style={{
                  width: "21px",
                  height: "21px",
                  cursor: "pointer",
                  alignItems: "left",
                  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                }}
              />
            </IconButton>
            <IconButton
              aria-label="delete"
              size="small"
              onClick={() => handleDeleteIconClick(row.TimeLogsId)}
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
                Project Jobs
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow
                    sx={{
                      backgroundColor: "#f3f2f1",
                      fontWeight: "600",
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                    }}
                  >
                    <TableCell
                      align="left"
                      sx={{
                        width: "40%",
                        fontWeight: "600",
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      Job Name
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        width: "20%",
                        fontWeight: "600",
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
                        fontWeight: "600",
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      Logged Hours
                    </TableCell>
                    <TableCell
                      align="left"
                      sx={{
                        width: "20%",
                        fontWeight: "600",
                        fontFamily:
                          "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      }}
                    >
                      Status
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* {row.history.map((historyRow:any) => (
                    <TableRow key={}>
                      <TableCell align="left" component="th" scope="row" sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}>
                        {}
                      </TableCell>
                      <TableCell align="left" sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}></TableCell>
                      <TableCell align="left" sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}></TableCell>
                      <TableCell align="left" sx={{ fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}></TableCell>
                    </TableRow>
                  ))} */}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default TimeLogRows;
