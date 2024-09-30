import { Button } from "@mui/material";
import * as React from "react";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  const homepageFunction = () => {
    navigate("/Projects");
  };

  return (
    <React.Fragment>
      <>
        <div style={{display:"flex", flexDirection:"row", justifyContent:"space-around"}}>
          <img
            style={{ height: "450px", marginTop:"50px" }}
            src={require("../assets/HomePage.jpg")}
          />
          <Button sx={{height:"60px", width:"120px", backgroundColor:"#e7f3ff",textTransform: "none" ,fontSize:"20px",fontWeight:"600",color:"#03045E", marginTop:"75px", marginRight:"100px"}}onClick={homepageFunction}>Menu</Button>
        </div>

      
      </>
    </React.Fragment>
  );
};

export default HomePage;
