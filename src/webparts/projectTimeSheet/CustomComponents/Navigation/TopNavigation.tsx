import * as React from "react";
import { Button, Box, Drawer, IconButton } from "@mui/material";
import { styled } from "@mui/system";
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react";
import SideNavigation from "./SideNavigation";

const Header = styled("div")({
  height: "calc(10% - 15px)",
  width: "100%",
  marginBottom: "10px",
  backgroundColor: "#F9F9F9",
  boxSizing: "border-box",
  padding: "8px",
  borderRadius: "5px",
  boxShadow: "0 4px 8px #9D9D9D",
  display: "flex",
  justifyContent: "space-between", // Change to space-between
  alignItems: "center", // Center align items vertically
});

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: "5px",
  textTransform: "none",
  color: "#000",
  borderColor: "#000",
  width: "120px", // Ensuring all buttons have the same width
  height: "35px", // Ensuring all buttons have the same height
  "&.active": {
    backgroundColor: "#1565c0",
    color: "#fff",
    borderColor: "#55ADFF",
  },
}));

const DrawerContainer = styled(Drawer)({
  width: 500,
  flexShrink: 0,
});

const DrawerHeader = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-end',
  padding: 16,
});

const TopNavigation = (props: {
  setTopNavigationState: React.Dispatch<React.SetStateAction<any>>;
  setTopNavigationMode: React.Dispatch<React.SetStateAction<any>>;
  setModuleTab: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [activeTab, setActiveTab] = React.useState("myData");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    props.setTopNavigationState(tab);
    if (tab === "myData") {
      props.setTopNavigationMode("Employee");
    }
  };

  return (
    <Box>
      <Header>
        <Box display="flex" alignItems="center">
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{ margin: 0 }}
          >
            <MenuIcon />
          </IconButton>
          <DrawerContainer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
          >
            <SideNavigation setModuleTab={props.setModuleTab} />
          </DrawerContainer>
        </Box>
        <Box display="flex" alignItems="center">
          <StyledButton
            className={activeTab === "myData" ? "active" : ""}
            onClick={() => handleTabChange("myData")}
          >
            My Data
          </StyledButton>
        </Box>
      </Header>
    </Box>
  );
};

export default TopNavigation;
