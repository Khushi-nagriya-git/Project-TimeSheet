import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  React,
  IconButton,
} from "../../../../../index";
import CloseIcon from "@mui/icons-material/Close";
import dialogBox from "./DialogBox.module.scss";

interface DeleteDialogBoxProps {
  open: boolean;
  handleClose: () => void;
  handleDeleteAction: () => void;
  isTimeLogAvailable: boolean;
}

const DeleteDialogBox: React.FC<DeleteDialogBoxProps> = ({
  open,
  handleClose,
  handleDeleteAction,
  isTimeLogAvailable,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title"className={dialogBox.dialogTitle}>
        {isTimeLogAvailable ? "Task Deletion Not Allowed" : "Delete Task"}
        <IconButton className={dialogBox.buttonIcon} aria-label="close"onClick={handleClose} >
          <CloseIcon/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className={dialogBox.dialogContentText}>
          {isTimeLogAvailable
            ? "This Task cannot be deleted as it contains associated time logs."
            : "Are you sure you want to delete this task?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            color: isTimeLogAvailable ? "white" : "rgb(50, 49, 48)",
            backgroundColor: isTimeLogAvailable ? "#1565c0" : "white",
            border: "1px solid grey",
            "&:hover": {
              backgroundColor: isTimeLogAvailable ? "#0069D9" : "lightgrey",
            },
          }}
        >
          {isTimeLogAvailable ? "Ok" : "Cancel"}
        </Button>
        {!isTimeLogAvailable && (
          <Button
            onClick={handleDeleteAction}
            autoFocus
            sx={{
              backgroundColor: "#FF6666",
              color: "white",
              "&:hover": {
                backgroundColor: "#dc3545",
              },
            }}
          >
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialogBox;
