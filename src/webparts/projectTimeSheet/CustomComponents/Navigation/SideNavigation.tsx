import * as React from "react";
import { Box, Button } from "@mui/material";
import { styled } from "@mui/system";

const SidebarContainer = styled("div")({
  borderRadius: "5px",
  marginTop: "10px",
  // marginLeft: "10px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  padding: "15px",
  //width: "100%",
  height: "100%",
});

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "5px",
  textTransform: "none",
  color: "#000",
  borderColor: "#000",
  marginBottom: "10px",
  width: "100%",
  minWidth: "180px",
  height: "50px",
  display: "flex",
  alignItems: "center",
  paddingLeft: "0px",
  justifyContent: "flex-start",
  "&.active": {
    backgroundColor: "#1565c0",
    color: "#fff",
    borderColor: "#55ADFF",
  },
}));

const SideNavigation = (props: { setModuleTab: React.Dispatch<React.SetStateAction<any>> }) => {
  const [activeTab, setActiveTab] = React.useState("Projects");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    props.setModuleTab(tab);
  };

  return (
    <SidebarContainer>
    
        <StyledButton
          className={activeTab === "TimeLogs" ? "active" : ""}
          onClick={() => handleTabChange("TimeLogs")}
          style={{fontWeight:"600" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}
        >
          <img
            src={
              activeTab === "TimeLogs"
                ? require("../../assets/timelogswhite.png")
                : require("../../assets/timelogsgray.png")
            }
            alt="Time Logs"
            style={{
              marginRight: "10px",
              height: "25px",
              width: "25px",
              marginLeft: "10px"

            }}
          />
          Time Logs
        </StyledButton>
        <StyledButton
          className={activeTab === "TimeSheets" ? "active" : ""}
          onClick={() => handleTabChange("TimeSheets")}
          style={{fontWeight:"600" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}
        >
          <img
            src={
              activeTab === "TimeSheets"
                ? require("../../assets/tablewhite.png")
                : require("../../assets/tablegray.png")
            }
            alt="TimeSheets"
            style={{
              marginRight: "10px",
              height: "25px",
              width: "25px",
              marginLeft: "10px"
            }}
          />
          TimeSheets
        </StyledButton>
        <StyledButton
          className={activeTab === "Jobs" ? "active" : ""}
          onClick={() => handleTabChange("Jobs")}
          style={{fontWeight:"600" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}
        >
          <img
            src={
              activeTab === "Jobs"
                ? require("../../assets/jobwhite.png")
                : require("../../assets/jobgray.png")
            }
            alt="Tasks"
            style={{
              marginRight: "10px",
              height: "25px",
              width: "25px",
              marginLeft: "10px"
            }}
          />
          Tasks
        </StyledButton>
        <StyledButton
          className={activeTab === "Projects" ? "active" : ""}
          onClick={() => handleTabChange("Projects")}
           style={{fontWeight:"600" , fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"}}
        >
          <img
            src={
              activeTab === "Projects"
                ? require("../../assets/projectwhite.png")
                : require("../../assets/projectgray.png")
            }
            alt="Projects"
            style={{
              marginRight: "10px",
              height: "25px",
              width: "25px",
              marginLeft: "10px"
            }}
          />
          Projects
        </StyledButton>
      
      
    </SidebarContainer>
  );
};

export default SideNavigation;
