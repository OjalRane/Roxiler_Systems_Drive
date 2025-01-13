import React, { useEffect, useState } from "react";
import { fetchStatistics } from "../api/api";

const Statistics = ({ month }) => {
  const [stats, setStats] = useState({});

  useEffect(() => {
    const getStats = async () => {
      try {
        const { data } = await fetchStatistics(month);
        setStats(data);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      }
    };

    getStats();
  }, [month]);

  return (
    <div>
      <h3>Statistics</h3>
      <p>Total Sale Amount: ${stats.totalSaleAmount || 0}</p>
      <p>Total Sold Items: {stats.soldItems || 0}</p>
      <p>Total Not Sold Items: {stats.notSoldItems || 0}</p>
    </div>
  );
};

export default Statistics;
