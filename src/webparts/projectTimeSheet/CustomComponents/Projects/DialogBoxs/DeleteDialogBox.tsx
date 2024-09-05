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
  isJobAvailable: boolean;
}

const DeleteDialogBox: React.FC<DeleteDialogBoxProps> = ({
  open,
  handleClose,
  handleDeleteAction,
  isJobAvailable,
}) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title"className={dialogBox.dialogTitle}>
        {isJobAvailable ? "Project Deletion Not Allowed" : "Delete Project"}
        <IconButton className={dialogBox.buttonIcon} aria-label="close"onClick={handleClose} >
          <CloseIcon/>
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" className={dialogBox.dialogContentText}>
          {isJobAvailable
            ? "This project cannot be deleted as it contains associated tasks."
            : "Are you sure you want to delete this project?"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          sx={{
            color: isJobAvailable ? "white" : "rgb(50, 49, 48)",
            backgroundColor: isJobAvailable ? "#1565c0" : "white",
            border: "1px solid grey",
            "&:hover": {
              backgroundColor: isJobAvailable ? "#0069D9" : "lightgrey",
            },
          }}
        >
          {isJobAvailable ? "Okay" : "Cancel"}
        </Button>
        {!isJobAvailable && (
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
