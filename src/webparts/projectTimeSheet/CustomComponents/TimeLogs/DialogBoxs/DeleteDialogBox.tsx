import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button, React, IconButton,} from "../../../../../index";
import CloseIcon from "@mui/icons-material/Close";
import dialogBox from "./DialogBox.module.scss";

interface DeleteDialogBoxProps {
  open: boolean;
  handleClose: () => void;
  handleDeleteAction: () => void;
}

const DeleteDialogBox: React.FC<DeleteDialogBoxProps> = ({ open, handleClose, handleDeleteAction,}) => {
  return (
    <Dialog open={open} onClose={handleClose}aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title" className={dialogBox.dialogTitle}>
        Delete Timelog
        <IconButton className={dialogBox.buttonIcon} aria-label="close" onClick={handleClose} >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <DialogContentText  id="alert-dialog-description"className={dialogBox.dialogContentText} >
          Are you sure you want to delete this timelog?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}
          sx={{
            color: "rgb(50, 49, 48)",
            backgroundColor: "white",
            border: "1px solid grey",
            "&:hover": {
              backgroundColor: "lightgrey",
            },
          }}
        >
          Cancel
        </Button>

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
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialogBox;
