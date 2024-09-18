import { Button } from "@mui/material";
import * as React from "react";
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    
  const navigate = useNavigate();

  const homepageFunction = () => {
    navigate("/Projects");    
  };

  return (
    <React.Fragment>
      <>
        <h1>Home Page</h1>
        <Button onClick={homepageFunction}>Go to Projects</Button>
      </>
    </React.Fragment>
  );
};

export default HomePage;
