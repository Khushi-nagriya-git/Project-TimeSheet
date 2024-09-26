import * as React from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  TooltipItem,
} from "chart.js";
import { Label } from "@fluentui/react";

ChartJS.register(ArcElement, Tooltip, Legend);

const centerTextPlugin = (text1: string, text2: string) => ({
  id: "centerText",
  afterDraw(chart: any) {
    const { ctx, chartArea: { width, height } } = chart;
    ctx.save();
    ctx.font = "bold 16px 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
    ctx.fillStyle = "#44556e";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text1, width / 2, height / 2 - 10); 
    ctx.fillText(text2, width / 2, height / 2 + 10); 
    ctx.restore();
  },
});

const DashBoardBody = (props: { data: any , label:string , status:any , type:string, centerValue:any}) => {

  const convertMinutesToHoursAndMinutes = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} Hrs ${mins} Mins`;
  };


  const chartData = {
    labels: props.status.map((status: any, index: any) => status),
    datasets: [
      {
        label: props.label,
        data: props.type === "status chart"? [props.data[1],props.data[2], props.data[3], props.data[4]] : props.type === "Billable chart" ? [props.data[0],props.data[1]] : 0,
        backgroundColor: ["#03045E", "#023E8A", "#0077B6","#0096C7"],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions: ChartOptions<"doughnut"> = {
    responsive: true,
    cutout: "70%",
    plugins: {
      legend: {
        display: true,
        position: "bottom", // Use 'bottom' as a string literal
      },
      title: {
        display: true,
        text: "Project Hours Overview",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem: TooltipItem<'doughnut'>) => {
            const value = tooltipItem.raw as number; // Get the raw value
            return convertMinutesToHoursAndMinutes(value); // Convert to "Hrs Mins" format
          },
        },
      },
    },
  };

  return (
    <div
      style={{
        height: "285px",
        backgroundColor: "#fff",
        marginTop: "13px",
        width: "32%",
        borderRadius: "10px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)"
      }}
    >
      <div style={{ width: "70%", margin: "0 auto" }}>
        <Label style={{display:"flex" , flexDirection:"row" , justifyContent:"center"}}>{props.label}</Label>
        {props.centerValue!=0 && (
        <Doughnut data={chartData} options={chartOptions}   plugins={[
          centerTextPlugin(
            props.type === "status chart" ? "Total tasks" : "Total Hours",
            convertMinutesToHoursAndMinutes(props.centerValue) 
        
          ),
        ]}/>

        )}
      </div>
    </div>
  );
};

export default DashBoardBody;
