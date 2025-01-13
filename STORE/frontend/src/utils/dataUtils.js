const BASE_API = "https://s3.amazonaws.com/roxiler.com/product_transaction.json";

export async function fetchTransactions(month) {
  try {
    const response = await fetch(BASE_API);
    const data = await response.json();

    // Filter transactions by month
    const filteredTransactions = data.filter((tx) =>
      new Date(tx.dateOfSale).toLocaleString("default", { month: "long" }) ===
      month
    );
    return filteredTransactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return [];
  }
}

export async function fetchChartData(month) {
  try {
    const transactions = await fetchTransactions(month);

    // Group by price range
    const priceRanges = [
      { range: "0-100", count: 0 },
      { range: "101-200", count: 0 },
      { range: "201-300", count: 0 },
      { range: "301-400", count: 0 },
      { range: "401-500", count: 0 },
      { range: "501-600", count: 0 },
      { range: "601-700", count: 0 },
      { range: "701-800", count: 0 },
      { range: "801-900", count: 0 },
      { range: "901+", count: 0 },
    ];

    transactions.forEach((tx) => {
      const price = tx.price;
      const rangeIndex =
        price > 900
          ? 9
          : Math.min(Math.floor(price / 100), 8); // Find the range
      priceRanges[rangeIndex].count++;
    });

    return priceRanges;
  } catch (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }
}
