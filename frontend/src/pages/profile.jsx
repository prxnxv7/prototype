import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PersonProfile = () => {
  const { personId } = useParams();
  const [person, setPerson] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchPersonAndTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/persons/${personId}/`);
        setPerson(response.data.person);
        setTransactions(response.data.transactions);
      } catch (error) {
        // Handle error here.
      }
    };
    fetchPersonAndTransactions();
  }, [personId]);

  if (!person) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Profile Page</h1>
      <h2>Name: {person.name}</h2>
      <p>Phone Number: {person.phno}</p>
      {transactions.map((transaction) => (
        <div key={transaction.id}>
          <p>Total Amount Owed: {transaction.total_amount_owed}</p>
          <p>Time Period for Each Installment: {transaction.time_period}</p>
          <p>Next Due Date: {transaction.next_due_date}</p>
          <p>Paid Date: {transaction.paid_date}</p>
          <p>Paid Amount: {transaction.paid}</p>
          <p>Final Paid Amount: {transaction.final_paid}</p>
        </div>
      ))}
    </div>
  );
};

export default PersonProfile;
