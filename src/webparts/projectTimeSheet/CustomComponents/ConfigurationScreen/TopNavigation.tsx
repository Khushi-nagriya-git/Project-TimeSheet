import * as React from "react";
import { Box } from "../../../..";
import { Label } from "@fluentui/react-components";

const TopNavigation = (props: {
  heading:string
}) => {
  return (
    <React.Fragment>
       <Box sx={{ height: "25px", backgroundColor: "white", width: "100%"  }}>
        <Label style={{fontSize:"18px", fontWeight:"600" , color:"#03045E" , marginTop:"-5px"}}>{props.heading}</Label>
    </Box>
    </React.Fragment>
  );
};

export default TopNavigation;
