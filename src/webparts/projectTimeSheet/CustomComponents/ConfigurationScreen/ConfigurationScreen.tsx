import * as React from "react";
import { IConfigurationScreenProps } from "./IConfigurationScreenProps";
import Box from "@mui/material/Box/Box";
import { styled, useState } from "../../../..";
import ConfigurationScreenLeftNavigation from "./ConfigurationScreenLeftNavigation";
import TopNavigation from "./TopNavigation";
import GeneralSettings from "./GeneralSettings";
import DepartmentSetting from "./DepartmentSetting";

const Content = styled("div")({
  height: "calc(100vh - 143px)",
  backgroundColor: "#ffffff",
  boxSizing: "border-box",
  padding: "10px 10px 0px 10px",
  overflowY: "scroll",
});

const ConfigurationScreen: React.FC<IConfigurationScreenProps> = (
  props: IConfigurationScreenProps
) => {
  const [tab, setTab] = useState("General Settings");

  return (
    <React.Fragment>
      <Content>
        <Box
          sx={{
            display: "flex",
            height: "auto",
            backgroundColor: "#f8f8f9",
          }}
        >
          {/* Left Header: Takes up around 25-30% of the screen width */}
          <Box
            sx={{
              width: "20%",
              backgroundColor: "#fff",
              boxShadow: "2px 0px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ConfigurationScreenLeftNavigation setTab={setTab} />
          </Box>

          {/* Right Content: Takes up the remaining 70-75% of the screen */}
          <Box
            sx={{
              width: "80%",
              display: "flex",
              flexDirection: "column",
              padding: "10px",
            }}
          >
            {/* Top Header */}
            <Box
              sx={{
                marginBottom: "20px",
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              <TopNavigation heading={tab ==="General Settings" ? "Configuration" : "Add Departments"} />
            </Box>

            <Box
              sx={{
                marginBottom: "20px",
                backgroundColor: "#fff",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
              }}
            >
              {tab === "General Settings" && (
                <GeneralSettings absoluteURL={props.absoluteURL} context={props.context} title={props.title}></GeneralSettings>
              )}
              {tab === "Departments" && <DepartmentSetting absoluteURL={props.absoluteURL} spHttpClient={props.spHttpClient}></DepartmentSetting>}
            </Box>
          </Box>
        </Box>
      </Content>
    </React.Fragment>
  );
};

export default ConfigurationScreen;
