import * as React from "react";
import styles from "./ProjectTimeSheet.module.scss";
import type { IProjectTimeSheetProps } from "./IProjectTimeSheetProps";
import Project from "../CustomComponents/Projects/Project";
import Jobs from "../CustomComponents/Jobs/Jobs";
import AppHeader from "../CustomComponents/App Header/AppHeader";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/system";
import TimeLogs from "../CustomComponents/TimeLogs/TimeLogs";
import { SPHttpClient } from "../../..";
import { LoggedInUserDetails, projectsInitialState } from "../CustomComponents/Projects/IProjectStats";
import { getLoggedInUserData } from "../CustomComponents/Projects/Services";


const MainContainer = styled(Box)({
  display: "flex",
  height: "100%", // Full viewport height
  width: "100%",
  overflow: "hidden",
});

const ContentContainer = styled(Box)({
  flexGrow: 1,
  transition: "margin 0.3s", // Smooth transition for drawer open/close
});

const ProjectTimeSheet: React.FC<IProjectTimeSheetProps> = (
  props: IProjectTimeSheetProps
) => {
  const [moduleTab, setModuleTab] = useState("Projects");
 
   useEffect(() => {
   
  }, []);

  return (
    <div>
      <style>
        {`
          #spSiteHeader,
          #spCommandBar,
          #sp-appBar {
            display: none;
          }
        `}
      </style>
      <AppHeader
        userEmail={props.context.pageContext.user.email}
        userName={props.context.pageContext.user.displayName}
        siteURL={props.context.pageContext.web.absoluteUrl}
      />
      <MainContainer>
        <ContentContainer>
          {moduleTab === "Projects" && (
            <Project
              spHttpClient={props.spHttpClient}
              absoluteURL={props.absoluteURL}
              context={props.context}
              setModuleTab={setModuleTab}
           
            />
          )}
          {moduleTab === "Jobs" && (
            <Jobs
              spHttpClient={props.spHttpClient}
              absoluteURL={props.absoluteURL}
              context={props.context}
              setModuleTab={setModuleTab}
            
            />
          )}
          {moduleTab === "TimeLogs" && (
            <TimeLogs
              spHttpClient={props.spHttpClient}
              absoluteURL={props.absoluteURL}
              context={props.context}
              setModuleTab={setModuleTab}
             
            />
          )}
        </ContentContainer>
      </MainContainer>
    </div>
  );
};

export default ProjectTimeSheet;
