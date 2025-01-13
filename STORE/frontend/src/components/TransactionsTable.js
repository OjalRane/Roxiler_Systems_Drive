import React, { useState } from "react";

const TransactionsTable = ({ transactions }) => {
  const [search, setSearch] = useState("");

  const filteredTransactions = transactions.filter((tx) =>
    [tx.title, tx.description, String(tx.price)]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      <h2>Transactions</h2>
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((tx, index) => (
            <tr key={index}>
              <td>{tx.title}</td>
              <td>{tx.description}</td>
              <td>${tx.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;
