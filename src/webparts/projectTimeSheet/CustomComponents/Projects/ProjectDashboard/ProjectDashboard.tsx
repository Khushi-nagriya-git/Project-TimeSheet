import * as React from "react";
import { useState, useEffect } from "react";
import { IProjectDashboardProps } from "./IProjectDashboardProps";
import { useEmployeeTimeSheetContext } from "../../EmployeeTimeSheetContext";
import { useParams } from "react-router-dom";
import {
  Box,
  Label,
  ProjectStyle,
  ProjectsData,
  getProjectListData,
  projectsInitialState,
  styled,
} from "../../../../../index";
import DashBoardHeader from "./DashBoardHeader";
import DashBoardBody from "./DashBoardBody";

const Content = styled("div")({
  height: "calc(100vh - 143px)",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
  padding:"10px"
});


const ProjectDashboard = (props: IProjectDashboardProps) => {
  const { id } = useParams<{ id: string }>();

  const { projectsData, setProjectsData } = useEmployeeTimeSheetContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getProjectListData(
          props.absoluteURL,
          props.spHttpClient,
          setProjectsData,
          props.loggedInUserDetails,
          props.isUserAdmin
        );
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        // setLoading(false);
      }
    };
    fetchData();
  }, []);

  let project:any;
  
  for (let i = 0; i < projectsData.length; i++) {
    if (projectsData[i].ProjectId === parseInt(id ? id : "", 10)) {
      project = projectsData[i];
    }
  }

  return (
    <React.Fragment>
        <Content >
          <DashBoardHeader project={project} context={props.context}></DashBoardHeader>
          <DashBoardBody project={project} context={props.context}></DashBoardBody>
        </Content>
    </React.Fragment>
  );
};

export default ProjectDashboard;
