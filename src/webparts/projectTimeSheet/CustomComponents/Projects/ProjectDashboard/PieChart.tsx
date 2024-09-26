import * as React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";

import { Label } from "@fluentui/react";

ChartJS.register(ArcElement, Tooltip, Legend);

const PieChart = (props: { project: any; lockedHours:number}) => {

  const convertMinutesToHoursAndMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} Hrs ${mins} Mins`;
  };
  
  const chartData = {
    labels: ["Estimated", "Locked"],
    datasets: [
      {
        label: "Estimated Vs Locked Hours",
        data: [props.project?.ProjectHours, props.lockedHours],
        backgroundColor: ["#023E8A", "#0077B6"],
        borderWidth: 2,
      },
    ],
  };
  const chartOptions: ChartOptions<"pie"> = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "bottom",
      },
      title: {
        display: true,
        text: "Project Hours Overview",
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const value = tooltipItem.raw as number; // Get the raw value
            if( tooltipItem.label === "Estimated") return `${tooltipItem.label}: ${value}`;
            return `${tooltipItem.label}: ${convertMinutesToHoursAndMinutes(value)} Hrs`; // Convert to "Hrs Mins" format
          },
        },
      },
      
    },
    
  };
  return (
    <div style={{  height: "285px",boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)", backgroundColor: "#fff", marginTop: "13px", width: "32%", borderRadius: "10px" }}>
      <div style={{ width: "70%", margin: "0 auto"}}>
        <Label style={{display:"flex" , flexDirection:"row" , justifyContent:"center"}}>Estimated Vs Logged Hours</Label>
        <Pie data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default PieChart;
