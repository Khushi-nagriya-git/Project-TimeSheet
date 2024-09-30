import * as React from "react";

import { Box } from "../../../..";
import { Button } from "@mui/material";

const ConfigurationScreenLeftNavigation = (props: {
  setTab: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const onclick = (tab: string) => {
    props.setTab(tab);
  };

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          color: "white",
          height: "100%",
          backgroundColor: "#03045E",
        }}
      >
        <Box
          sx={{
            padding: "10px",
            display: "flex",
            flexDirection: "column",
            justifyItems: "Left",
          }}
        >
          <Box>
            <Button
              sx={{
                height: "35px",
                width: "96%",
                backgroundColor: "transparent",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "600",
                color: "#fff",
                marginTop: "15px",
                marginRight: "100px",
              }}
              onClick={() => onclick("General Settings")}
            >
              General Settings
            </Button>
          </Box>

          <Box sx={{width:"98%" , opacity:"0.5",marginTop:"10px", marginBottom:"10px",borderBottom:"1px solid white"}}></Box>


          <Box>
          <Button
              sx={{
                height: "35px",
                width: "96%",
                backgroundColor: "transparent",
                textTransform: "none",
                fontSize: "16px",
                fontWeight: "600",
                color: "#fff",
                marginTop: "15px",
                marginRight: "100px",
              }}
              onClick={() => onclick("Departments")}
            >
              Departments
            </Button>
          </Box>
          <Box sx={{width:"98%" , opacity:"0.5",marginTop:"10px", marginBottom:"10px",borderBottom:"1px solid white"}}></Box>

        </Box>
      </Box>
    </React.Fragment>
  );
};

export default ConfigurationScreenLeftNavigation;
