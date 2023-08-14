import React, { useState } from 'react';
import axios from 'axios';

const CreatePersonForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    phno: '',
    money_owed: '',
    time_period_given: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/api/persons/', formData);
      setFormData({
        name: '',
        phno: '',
        money_owed: '',
        time_period_given: '',
      });
    } catch (error) {
    }
  };

  return (
    <div>
      <h1>Create Person Form</h1>
      <form onSubmit={handleSubmit} method="post" action='http://localhost:8000/api/persons'>
        <label>
          Name:
          <input type="text" name="name" value={formData.name} onChange={handleChange} />
        </label>
        <br />
        <label>
          Phone Number:
          <input type="text" name="phno" value={formData.phno} onChange={handleChange} />
        </label>
        <br />
        <label>
          Money Owed:
          <input type="number" name="money_owed" value={formData.money_owed} onChange={handleChange} />
        </label>
        <br />
        <label>
          Time Period Given (in days):
          <input
            type="number"
            name="time_period_given"
            value={formData.time_period_given}
            onChange={handleChange}
          />
        </label>
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default CreatePersonForm;
