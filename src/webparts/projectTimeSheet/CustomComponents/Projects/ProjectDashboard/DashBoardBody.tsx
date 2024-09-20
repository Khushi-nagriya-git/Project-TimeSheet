import * as React from "react";
import { useState, useEffect } from "react";

import {
  Box,
} from "../../../../../index";
import { PieChart } from '@mui/x-charts/PieChart';
import { WebPartContext } from "@microsoft/sp-webpart-base";

const DashBoardHeader = (props: { project: any; context: WebPartContext }) => {

  
    const Data = [
        { id: 1, label: 'Estimated Hours', value: props.project.ProjectHours || 0},
        { id: 2, label: 'Logged Hours', value: 25 },
      ];

      const valueFormatter = (value: number) => `${value} hours`;
  

  return (
    <React.Fragment>
     <Box sx={{height:"auto" , backgroundColor :"red"}}>
      chart section 
     </Box>
     {/* <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label: 'series B' },
            { id: 2, value: 20, label: 'series C' },
          ],
        },
      ]}
      width={400}
      height={200}
    /> */}
    </React.Fragment>
  );
};

export default DashBoardHeader;
