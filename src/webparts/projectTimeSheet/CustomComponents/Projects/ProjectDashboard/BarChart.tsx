import * as React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartOptions,
} from "chart.js";
import { Label } from "@fluentui/react";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

interface BarChartProps {
  data: any;
  label: string;
  status: any;
}

const BarCharts: React.FC<BarChartProps> = ({ data, label, status }) => {
  const chartData = {
    labels: status.map((statusItem: any) => statusItem),
    datasets: [
      {
       
        data: [data[1],data[2],data[3],data[4]],
        backgroundColor: ["#03045E", "#023E8A", "#0077B6", "#0096C7"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio to fill the space
    plugins: {
      legend: {
        display: false,
        position: "bottom",
      },
      title: {
        display: true,
        text: "Project Task Status Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div
      style={{
        height: "265px",
        backgroundColor: "#fff",
        marginTop: "13px",
        width: "32%",
        borderRadius: "10px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", 
        padding: "10px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
      }}
    >
      <div style={{ width: "100%",  height: "80%", padding: "10px 0px" }}>
        <div style={{display:"flex" , flexDirection:"row" ,  justifyContent : "space-between"}}>
      <Label >{label}</Label>
      <Label style={{display:"flex" , flexDirection:"row" , justifyContent:"center"}}>Total Task {data[0]}</Label>
        </div>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default BarCharts;
