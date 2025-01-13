import React, { useEffect, useState } from "react";
import { fetchBarChart } from "../api/api";
import { Bar } from "react-chartjs-2";

const BarChart = ({ month }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const getChartData = async () => {
      try {
        const { data } = await fetchBarChart(month);
        setChartData({
          labels: data.map((item) => item.range),
          datasets: [
            {
              label: "Number of Items",
              data: data.map((item) => item.count),
              backgroundColor: "rgba(75,192,192,0.6)",
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching bar chart data:", error);
      }
    };

    getChartData();
  }, [month]);

  return <Bar data={chartData} />;
};

export default BarChart;
