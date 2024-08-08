import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { styled } from "@mui/material/styles";

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
  
  const NavigationLinks = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "10px",
  });
  
  const NavigationLinksForTeams = styled("div")({
    display: "flex",
    alignItems: "center",
    justifyContent: "left",
    marginBottom: "2px",
  });
  
  const NavLink = styled(Button)(({ theme }) => ({
    textTransform: "none",
    color: "#000",
    borderBottom: "3px solid transparent",
    marginRight: "20px",
    "&.active": {
      color: "#000",
      borderBottom: "3px solid #1565c0",
    },
  }));
  
  const Content = styled("div")({
    height: "440px",
    backgroundColor: "#F9F9F9",
    boxSizing: "border-box",
    padding: "13px",
    borderRadius: "5px",
    background: "#F9F9F9",
    boxShadow: "0 4px 8px #9D9D9D",
  });

  export default {Content,NavLink,NavigationLinksForTeams,MainContainer,NavigationLinks,FullHeightGrid}