import IconButton from "@mui/material/IconButton";
import { React, Box, TableCell, TableRow,} from "../../../../../index";
import Tooltip from "@mui/material/Tooltip";
import Styles from "../TimeLog.module.scss";

const TimeLogRows = (props: { row: ReturnType<any>; handleDeleteIconClick: any;  handleEditIconClick: any; timelogProps: any; isRunning: any; elapsedTime: any; handleStartStop: any; jobResumeTimer: any; setIsRunning: React.Dispatch<React.SetStateAction<any>>;}) => {
  const { row, handleDeleteIconClick, handleEditIconClick } = props;
  let timerTimeLogId = parseInt(localStorage.getItem("TimeLogId") || "0", 10);
  const isPending = row.Status === "Pending";

  const getTaskTypeColor = (status: string) => {
    switch (status) {
      case "Non Billable":
        return "#F72585";
      case "Billable":
        return "#41856A";
      default:
        return "#9D9D9D";
    }
  };
  const borderColorforTaskType = getTaskTypeColor(row.BillableStatus);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending":
        return "#0077B6";
      case "Not Submitted":
        return "#007bff";
      case "Rejected":
        return "#F72585";
      case "Approved":
        return "#41856A";
      default:
        return "#5C6B73";
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
  const month = (today.getMonth() + 1).toString().length === 1 ? "0" + (today.getMonth() + 1).toString() : (today.getMonth() + 1).toString();
  const day = today.getDate().toString().length === 1 ? "0" + today.getDate().toString() : today.getDate().toString();
  const formattedDate = `${year}-${month}-${day}`;
  let showButton = row.Created.split("T")[0] === formattedDate;

  const handleClickStart = (id: number) => {
    if (props.isRunning) {
      alert("Timer is already running. Stop it to resume this task timer.");
      return;
    } else {
      localStorage.setItem("TimeLogId", id as unknown as string);
      props.jobResumeTimer(id);
      props.setIsRunning(true);
      showButton = true;
      timerTimeLogId = id;
    }
  };

  const handleClickPause = () => {
    props.handleStartStop();
  };

  const disabledStyle = {
    opacity: 0.5,
    pointerEvents: "none",
  };

  const isLongName = row.ProjectName?.length > 20;
  const isJobName = row.JobName?.length > 25;
  const isDescriptionLong = row.Description?.length > 25;

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" }, height: "50px", ...(isPending && disabledStyle), }} >
        
        <TableCell component="th" scope="row" className={Styles.TableCells} >
          {isLongName ? (
            <Tooltip title={row.ProjectName}>
              <span>{row.ProjectName.substring(0, 20)}...</span>
            </Tooltip>
          ) : (
            row.ProjectName
          )}
        </TableCell>

        <TableCell align="left" className={Styles.TableCells} >
          {isJobName ? (
            <Tooltip title={row.JobName}>
              <span>{row.JobName.substring(0, 25)}...</span>
            </Tooltip>
          ) : (
            row.JobName
          )}
        </TableCell>

        <TableCell align="left" className={Styles.TableCells}>
          {isDescriptionLong ? (
            <Tooltip title={row.Description}>
              <span>{row.Description.substring(0, 25)}...</span>
            </Tooltip>
          ) : (
            row.Description
          )}
        </TableCell>

        <TableCell align="left" className={Styles.TableCells}>
          <Box className={Styles.StatusCells} sx={{ border: `2px solid ${borderColorStatus}`}}>
            {row.Status}
          </Box>
        </TableCell>

        <TableCell align="left" className={Styles.TableCells}>
          <Box className={Styles.StatusCells}  sx={{ border: `2px solid ${borderColorforTaskType}`}}>
            {row.BillableStatus}
          </Box>
        </TableCell>

        <TableCell  align="left" className={Styles.TableCells}>
          {props.isRunning && timerTimeLogId === row.TimeLogsId ? formatTime(props.elapsedTime) : convertMinutesToHoursAndMinutes(row.LoggedTime)}
        </TableCell>

        <TableCell align="left" className={Styles.TableCells}>
          {showButton &&
            (props.isRunning && timerTimeLogId === row.TimeLogsId ? (
              <IconButton aria-label="edit" size="small" onClick={handleClickPause} disabled={isPending}>
                <img src={require("../../../assets/pause.png")} alt="Pause Button"  className={Styles.PauseButton}/>
              </IconButton>
            ) : (
              <IconButton aria-label="play" size="small" onClick={() => handleClickStart(row.TimeLogsId ? row.TimeLogsId : 0) } disabled={isPending} >
                <img  className={Styles.PauseButton} src={require("../../../assets/play.png")} alt="Play Button" onClick={() => handleClickStart(row.TimeLogsId ? row.TimeLogsId : 0) } />
              </IconButton>
            ))}
        </TableCell>

        <TableCell align="left" sx={{ height: "10px" , backgroundColor:"#fff" }}>
          <Box display="flex" alignItems="left" justifyContent="left">
            <IconButton aria-label="edit" size="small" onClick={() => handleEditIconClick(row.TimeLogsId)} disabled={isPending || props.isRunning} >
              <img src={require("../../../assets/pencil.png")} alt="Edit" className={Styles.PauseButton} />
            </IconButton>
           
            <IconButton aria-label="delete" size="small"onClick={() => handleDeleteIconClick(row.TimeLogsId)} disabled={isPending || props.isRunning} >
              <img src={require("../../../assets/delete.png")} alt="Delete"  className={Styles.PauseButton} style={{ marginLeft: "5px", }}/>
            </IconButton>
          </Box>
        </TableCell>
        
      </TableRow>
    </React.Fragment>
  );
};

export default TimeLogRows;
