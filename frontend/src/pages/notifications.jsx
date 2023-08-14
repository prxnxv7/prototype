import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const NotificationPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [paidAmountInput, setPaidAmountInput] = useState("");

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/transactions/"
        );
        setTransactions(response.data);
      } catch (error) {
      }
    };
    fetchTransactions();
  }, []);

  const handlePaid = async (transactionId, paidAmount) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/transactions/${transactionId}/`,
        {
          paid: parseFloat(paidAmountInput),
          paid_date: new Date().toISOString().slice(0, 10),
        }
      );
      const updatedTransactions = transactions.map((transaction) =>
        transaction.id === response.data.id ? response.data : transaction
      );
      setTransactions(updatedTransactions);
    } catch (error) {
    }
  };

  return (
    <div>
      <h1>Notification Page</h1>
      {transactions.map((transaction) => (
        <div key={transaction.id}>
          <h2>Name: {transaction.person}</h2>
          <p>Phone {transaction.person.phno}</p>
          <p>Time period {transaction.time_period}</p>
          <p>Next due date {transaction.next_due_date}</p>
          <p>Previous due date {transaction.previous_due_date}</p>
          <button onClick={() => handlePaid(transaction.id)}>Paid</button>
          <input
            type="number"
            placeholder="Enter paid amount"
            value={paidAmountInput}
            onChange={(e) => setPaidAmountInput(e.target.value)}
          />
          <Link to={`/person/${transaction.person.id}`}>More</Link>
        </div>
      ))}
    </div>
  );
};

export default NotificationPage;
