import * as React from "react";
import { useState, useEffect } from "react";
import { IProjectDashboardProps } from "./IProjectDashboardProps";
import { useEmployeeTimeSheetContext } from "../../EmployeeTimeSheetContext";
import Dialog from "@mui/material/Dialog/Dialog";
import DialogTitle from "@mui/material/DialogTitle/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { CloseIcon, DialogContent, DialogContentText } from "../../../../..";


const ProjectDashboard = (props: IProjectDashboardProps) => {
  const { projectsData } = useEmployeeTimeSheetContext();
  let project;
  for (let i = 0; i < projectsData.length; i++) {
    if (projectsData[i].ProjectId === props.projectId) {
      project = projectsData[i];
    }
  }

  return (
    <React.Fragment>
      <Dialog open={props.isDashBoardOpen} onClose={props.handleClose}>
        <DialogTitle>
          {"Project DashBoard"}
          <IconButton aria-label="close" onClick={props.handleClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {
              "This project cannot be deleted as it contains associated tasks.Are you sure you want to delete this project?"
            }
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </React.Fragment>
  );
};

export default ProjectDashboard;
