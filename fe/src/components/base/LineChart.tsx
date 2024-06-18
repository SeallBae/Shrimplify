import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  ChartData,
  ScatterDataPoint,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip
);

export interface Props {
  data: ChartData<"line", (number | ScatterDataPoint | null)[], unknown>;
  options: any;
}

export default function LineChart({ data, options }: Props) {
  return (
    <>
      <Line data={data} options={options} />
    </>
  );
}
