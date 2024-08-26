import * as React from "react";
import { Box, Button, Dialog, DialogContent, DialogTitle, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

const TimeSheetForm = ({ open, onClose, selectedData }: { open: boolean; onClose: () => void; selectedData: any[] }) => {
  if (!selectedData || selectedData.length === 0) return null;

  const convertMinutesToHoursAndMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} Hrs ${mins} Mins`;
  };

  return (
    <Dialog open={open} onClose={onClose} fullScreen>
      <DialogTitle>
        Time Sheet Details
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Task</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Estimated Hours</TableCell>
                  <TableCell>Locked Hours</TableCell>
                  <TableCell>Billable</TableCell>
                  <TableCell>Description</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {selectedData.map((log: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{new Date(log.Created).toLocaleDateString('en-US')}</TableCell>
                    <TableCell>{log.JobName}</TableCell>
                    <TableCell>{log.ProjectName}</TableCell>
                    <TableCell>{log.Status}</TableCell>
                    <TableCell>{convertMinutesToHoursAndMinutes(log.EstimatedHours)}</TableCell>
                    <TableCell>{convertMinutesToHoursAndMinutes(log.LoggedHours)}</TableCell>
                    <TableCell>{log.BillableStatus}</TableCell>
                    <TableCell>{log.Description}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2 }}>
            <Button onClick={onClose} variant="contained" color="primary">
              Close
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default TimeSheetForm;
