import * as React from "react";
import { useState, useEffect } from "react";
import { styled } from "@mui/system";
import Grid from "@mui/material/Grid";
import { IProjectProps } from "../IProjectProps";
import { IProjectDashboardProps } from "./IProjectDashboardProps";
import { useEmployeeTimeSheetContext } from "../../EmployeeTimeSheetContext";

const FullHeightGrid = styled(Grid)({
  height: "100%",
  boxSizing: "border-box",
});

const MainContainer = styled("div")({
  width: "100%",
  height: "100%",
  padding: "16px",
  boxSizing: "border-box",
});

const Content = styled("div")({
  height: "calc(100vh - 143px)",
  backgroundColor: "#F9F9F9",
  boxSizing: "border-box",
  padding: "13px",
  borderRadius: "5px",
  boxShadow: "0 4px 8px #9D9D9D",
});

const ProjectDashboard = (props: IProjectDashboardProps) => {
  const { projectsData } = useEmployeeTimeSheetContext();
  let project;
  for(let i=0;i<projectsData.length;i++){
    if(projectsData[i].ProjectId === props.projectId){
        project = projectsData[i]
    }
  }
 
  return (
    <React.Fragment>
      <FullHeightGrid container>
        <FullHeightGrid
          item
          style={{ display: "flex", height: "100%", width: "100%" }}
        >
          <MainContainer>
            <Content>
            Dashboard project id {props.projectId}
            </Content>
          </MainContainer>
        </FullHeightGrid> 
      </FullHeightGrid>
    </React.Fragment>
  );
};

export default ProjectDashboard;
