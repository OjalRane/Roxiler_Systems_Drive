import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import "./App.css";

const App = () => {
  const [month, setMonth] = useState("March");
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statistics, setStatistics] = useState({});
  const [barChartData, setBarChartData] = useState({
    labels: [],
    datasets: []
  });
  const [pieChartData, setPieChartData] = useState({
    labels: [],
    datasets: []
  });

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    fetchTransactions();
    fetchStatistics();
    fetchBarChartData();
    fetchPieChartData();
  }, [month, page]);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get(
        `/api/transactions?month=${month}&search=${search}&page=${page}`
      );
      setTransactions(response.data.transactions);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await axios.get(`/api/statistics?month=${month}`);
      setStatistics(response.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchBarChartData = async () => {
    try {
      const response = await axios.get(`/api/bar-chart?month=${month}`);
      if (response.data && Array.isArray(response.data)) {
        const labels = response.data.map((item) => item.range);
        const data = response.data.map((item) => item.count);

        setBarChartData({
          labels,
          datasets: [
            {
              label: "Number of Items",
              data,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
            },
          ],
        });
      } else {
        console.error("Invalid data format for bar chart");
      }
    } catch (error) {
      console.error("Error fetching bar chart data:", error);
    }
  };

  const fetchPieChartData = async () => {
    try {
      const response = await axios.get(`/api/pie-chart?month=${month}`);
      if (response.data && Array.isArray(response.data)) {
        const labels = response.data.map((item) => item.category);
        const data = response.data.map((item) => item.count);

        setPieChartData({
          labels,
          datasets: [
            {
              label: "Number of Items",
              data,
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
      } else {
        console.error("Invalid data format for pie chart");
      }
    } catch (error) {
      console.error("Error fetching pie chart data:", error);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
    fetchTransactions();
  };

  return (
    <div className="app">
      <h1>Transaction Dashboard</h1>

      {/* Month Dropdown */}
      <div className="controls">
        <label htmlFor="month">Select Month:</label>
        <select
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        {/* Search Box */}
        <input
          type="text"
          placeholder="Search transactions"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {/* Transactions Table */}
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn) => (
            <tr key={txn.id}>
              <td>{txn.title}</td>
              <td>{txn.description}</td>
              <td>{txn.price}</td>
              <td>{txn.sold ? "Yes" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>

      {/* Statistics */}
      <div className="statistics">
        <h2>Statistics</h2>
        <p>Total Sale Amount: ${statistics.totalSale || 0}</p>
        <p>Total Sold Items: {statistics.totalSold || 0}</p>
        <p>Total Not Sold Items: {statistics.totalNotSold || 0}</p>
      </div>

      {/* Bar Chart */}
      <div className="chart">
        <h2>Price Range Bar Chart</h2>
        <Bar data={barChartData} />
      </div>

      {/* Pie Chart */}
      <div className="chart">
        <h2>Category-wise Distribution</h2>
        <Pie data={pieChartData} />
      </div>
    </div>
  );
};

export default App;
