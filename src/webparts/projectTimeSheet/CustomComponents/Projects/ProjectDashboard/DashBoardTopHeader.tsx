import * as React from "react";
import { Label } from "@fluentui/react";
import { useNavigate } from "react-router-dom";
import { Box, CloseIcon, IconButton } from "../../../../..";
import { WebPartContext } from "@microsoft/sp-webpart-base";

const DashBoardTopHeader = (props: {
}) => {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate("/Projects");
  };

  return (
    <Box sx={{ height: "25px", backgroundColor: "white", width: "100%" , display:"flex", flexDirection:"row", justifyContent:"space-between" }}>
      <Label style={{fontSize:"18px", fontWeight:"600" , color:"#03045E" , marginTop:"-5px"}}>Project DashBoard</Label>
      {/* Close Button */}
      <Box sx={{marginTop:"-7px"}}>
        <IconButton aria-label="close" onClick={handleClose}>
          <CloseIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default DashBoardTopHeader;
