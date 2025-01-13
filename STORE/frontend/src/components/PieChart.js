import React, { useEffect, useState } from "react";
import { fetchPieChart } from "../api/api";
import { Pie } from "react-chartjs-2";

const PieChart = ({ month }) => {
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    const getChartData = async () => {
      try {
        const { data } = await fetchPieChart(month);
        setChartData({
          labels: data.map((item) => item._id),
          datasets: [
            {
              data: data.map((item) => item.count),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };

    getChartData();
  }, [month]);

  return <Pie data={chartData} />;
};

export default PieChart;
