import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/products";

export const seedDatabase = () => axios.get(`${API_BASE_URL}/seed`);

export const fetchTransactions = (params) =>
  axios.get(`${API_BASE_URL}/transactions`, { params });

export const fetchStatistics = (month) =>
  axios.get(`${API_BASE_URL}/statistics`, { params: { month } });

export const fetchBarChart = (month) =>
  axios.get(`${API_BASE_URL}/barchart`, { params: { month } });

export const fetchPieChart = (month) =>
  axios.get(`${API_BASE_URL}/piechart`, { params: { month } });

export const fetchCombinedData = (month) =>
  axios.get(`${API_BASE_URL}/combined`, { params: { month } });
