import * as React from "react";
import {
  Avatar,
  Box,
  Label,
} from "../../../../../index";
import { WebPartContext } from "@microsoft/sp-webpart-base";

const DashBoardLeftHeader = (props: { project: any; context: WebPartContext; team:number }) => {

  const stringAvatar = (name: string) => {
    return {
      sx: {
        bgcolor: "white",
        width: 63, 
        height: 60, 
        borderRadius: "10px", 
        color: "#03045E",
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
      },
      children: `${name?.split(' ')[0][0]}${name?.split(' ')[1][0]}`,
    };
  }

  return (
    <React.Fragment>
        {/* Left part: Project details */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%", 
            color: "white",
            height:"100%",
            backgroundColor: "#03045E"
          }}
        >
          <Box sx={{padding:"10px"}}>
          {/* Project Name and Status */}


          <Box sx={{ display: "flex", alignItems: "center" , flexDirection:"column"}}>
          <Avatar {...stringAvatar(props.project?.ProjectName)} />

              <Label style={{ fontWeight: "600", fontSize: "20px", color:"white" }}>
                {props.project?.ProjectName}
              </Label>
          </Box>

          <Box sx={{width:"98%" ,opacity:"0.5",marginTop:"10px",marginBottom:"10px", borderBottom:"1px solid white"}}></Box>

          {/* Client Name */}
          <Box>
            <Label style={{ fontWeight: "500", fontSize: "14px" , color:"white"}}>Client</Label>
            <Box sx={{ fontWeight: "600", fontSize: "16px" }}>
              {props.project?.ClientName}
            </Box>
          </Box>

          <Box sx={{width:"98%" , opacity:"0.5",marginTop:"10px", marginBottom:"10px",borderBottom:"1px solid white"}}></Box>

          {/* Project Cost */}
          <Box>
            <Label style={{ fontWeight: "500", fontSize: "14px" , color:"white"}}>Project Cost</Label>
            <Box sx={{ fontWeight: "600", fontSize: "16px" }}>
              ${props.project?.ProjectCost}
            </Box>
          </Box>

          <Box sx={{width:"98%" , opacity:"0.5",marginTop:"10px", marginBottom:"10px", borderBottom:"1px solid white"}}></Box>

          {/* Project Members */}
          <Box>
            <Label style={{ fontWeight: "500", fontSize: "14px" , color:"white" }}>
              Project Members
            </Label>
            <Box sx={{ fontWeight: "600", fontSize: "16px" }}>{props.team > 0 ? props.team : 0}</Box>
          </Box>

          <Box sx={{width:"98%" , opacity:"0.5", marginTop:"10px",marginBottom:"10px", borderBottom:"1px solid white"}}></Box>

          {/* Project Manager */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              alt={props.project?.ProjectManagerPeoplePicker?.Title}
              src={`${props.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?accountname=${props.project?.ProjectManagerPeoplePicker?.EMail}&Size=S`}
              sx={{ marginRight: 1, height: 50, width: 50, borderRadius: "5px" }}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ fontWeight: "600" }}>
                {props.project?.ProjectManagerPeoplePicker?.Title}
              </Box>
              <Box>Project Manager</Box>
            </Box>
          </Box>

          <Box sx={{width:"98%" ,opacity:"0.5", marginTop:"10px",marginBottom:"10px", borderBottom:"1px solid white"}}></Box>

          {/* Reporting Manager */}
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
              alt={props.project?.ReportingManagerPeoplePicker?.Title}
              src={`${props.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?accountname=${props.project?.ReportingManagerPeoplePicker?.EMail}&Size=S`}
              sx={{ marginRight: 1, height: 50, width: 50, borderRadius: "5px" }}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ fontWeight: "600" }}>
                {props.project?.ReportingManagerPeoplePicker?.Title}
              </Box>
              <Box>Reporting Manager</Box>
            </Box>
          </Box>

          <Box sx={{width:"98%" , opacity:"0.5",marginTop:"10px", marginBottom:"10px", borderBottom:"1px solid white"}}></Box>

          <Label style={{ fontWeight: "600", fontSize: "16px" , color:"white" }}>Description:</Label>
          <Box
            sx={{
              fontWeight: "400",
              fontSize: "14px",
              marginTop: "10px",
              color:"white"
            }}
          >
            {props.project?.Description}
          </Box>

          </Box>
      
        </Box>
    </React.Fragment>
  );
};

export default DashBoardLeftHeader;
