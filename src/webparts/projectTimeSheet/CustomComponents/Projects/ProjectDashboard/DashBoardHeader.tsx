import * as React from "react";
import { useState, useEffect } from "react";

import { Navigate, useParams } from "react-router-dom";
import {
  Avatar,
  Box,
  CloseIcon,
  IconButton,
  Label,
  dialogBox,
} from "../../../../../index";
import { useNavigate } from "react-router-dom";
import { WebPartContext } from "@microsoft/sp-webpart-base";

const DashBoardHeader = (props: { project: any; context: WebPartContext }) => {

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Not Started":
        return "#FFB6C1";
      case "In Progress":
        return "#007bff";
      case "Completed":
        return "#65B741";
      default:
        return "#9D9D9D";
    }
  };

  const navigate = useNavigate();
  
  const handleClose = () => {
    navigate("/Projects");
  };

  function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string?.length; i += 1) {
      hash = string?.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }
  
  const stringAvatar = (name: string)=> {
    return {
      sx: {
        bgcolor: stringToColor(name?name:''),
      },
      children: `${name?.split(' ')[0][0]}${name?.split(' ')[1][0]}`,
    };
  }

  return (
    <React.Fragment>
      <Box sx={{ height: "25%", backgroundColor: "#f3f2f1", padding: "5px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
           <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar {...stringAvatar(props.project?.ProjectName)} />
              <Box sx={{ marginLeft: "10px" }}>
                <Label style={{ fontWeight: "600", fontSize: "24px" }}>
                  {props.project?.ProjectName}
                </Label>
                <Box
                  sx={{
                    fontWeight: "500",
                    fontSize: "14px",
                    color: getStatusColor(props.project?.ProjectStatus),
                  }}
                >
                  {props.project?.ProjectStatus}
                </Box>
              </Box>
            </Box>

          <Box>
            <Label style={{ fontWeight: "600", fontSize: "16px" }}>
              Client Name
            </Label>
            <Box sx={{ fontWeight: "500", fontSize: "14px" }}>
              {props.project?.ClientName}
            </Box>
          </Box>

          <Box>
            <Label style={{ fontWeight: "600", fontSize: "16px" }}>
              Project Cost
            </Label>
            <Box sx={{ fontWeight: "500", fontSize: "14px" }}>
              ${props.project?.ProjectCost}
            </Box>
          </Box>

          <Box>
            <Label style={{ fontWeight: "600", fontSize: "16px" }}>
              Project Members
            </Label>
            <Box sx={{ fontWeight: "500", fontSize: "14px" }}>5</Box>
          </Box>

          <Box display="flex" alignItems="left" justifyContent="left">
            <Avatar
              alt={props.project?.ProjectManagerPeoplePicker?.Title}
              src={`${props.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?accountname=${props.project?.ProjectManagerPeoplePicker?.EMail}&Size=S`}
              style={{
                marginRight: 8,
                height: "50px",
                width: "50px",
                borderRadius: "5px",
              }}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ fontWeight: "600" }}>
                {props.project?.ProjectManagerPeoplePicker?.Title}
              </Box>
              <Box>Reporting Manager</Box>
            </Box>
          </Box>

          <Box display="flex" alignItems="left" justifyContent="left">
            <Avatar
              alt={props.project?.ReportingManagerPeoplePicker?.Title}
              src={`${props.context.pageContext.web.absoluteUrl}/_layouts/15/userphoto.aspx?accountname=${props.project?.ReportingManagerPeoplePicker?.EMail}&Size=S`}
              style={{
                marginRight: 8,
                height: "50px",
                width: "50px",
                borderRadius: "5px",
              }}
            />
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Box sx={{ fontWeight: "600" }}>
                {props.project?.ReportingManagerPeoplePicker?.Title}
              </Box>
              <Box>Project Manager</Box>
            </Box>
          </Box>
            <Box>
            <IconButton
            className={dialogBox.buttonIcon}
            aria-label="close"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
            </Box>
       
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          <Label
            style={{
              fontWeight: "600",
              fontSize: "16px",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
          >
            Description:
          </Label>
          <Box
            sx={{
              fontWeight: "400",
              fontSize: "14px",
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              marginLeft: "5px",
              marginTop: "8px",
            }}
          >
            {props.project?.Description}
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
};

export default DashBoardHeader;
