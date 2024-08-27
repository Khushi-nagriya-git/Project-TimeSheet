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
import Tooltip from "@mui/material/Tooltip";

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
  const isPending = row.Status === "Pending";

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
  const borderColorforTaskType = getTaskTypeColor(row.BillableStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#9D9D9D";
      case "Not Submitted":
        return "#007bff";
      case "Rejected":
        return "#FFB6C1";
      case "Approved":
        return "#65B741";
      default:
        return "#9D9D9D";
    }
  };
  const borderColorStatus = getStatusColor(row.Status);

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

  const disabledStyle = {
    opacity: 0.5,
    pointerEvents: "none",
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" }, height: "50px" , ...(isPending && disabledStyle) }}>
       
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
              border: `2px solid ${borderColorStatus}`,
              height: "30px",
              width: "115px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            {row.Status}
          </Box>
        </TableCell>

        <TableCell align="left" sx={{ height: "10px" }}>
          <Box
            sx={{
              borderRadius: "20px",
              border: `2px solid ${borderColorforTaskType}`,
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
              disabled={isPending}
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
              disabled={isPending}
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
              disabled={isPending}
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
              disabled={isPending}
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
    </React.Fragment>
  );
};

export default TimeLogRows;
