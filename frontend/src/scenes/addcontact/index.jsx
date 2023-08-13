import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/header";
import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
  const isNonMobile = useMediaQuery("(min-width:600px)");


  const handleFormSubmit = async (values, { setSubmitting }) => {
    const formData = {
      name: values.name,
      phno: values.phno,
      money_owed: values.money_owed,
      time_period_given: values.time_period_given,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/persons/', formData);
      console.log('Response from server:', response.data);
      setSubmitting(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  return (
    <Box m="20px">
      <Header title="CREATE USER" subtitle="Create a New User Profile" />

      <Formik
        onSubmit={handleFormSubmit}
        initialValues={initialValues}
        validationSchema={checkoutSchema}
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
          handleSubmit,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Name"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.firstName}
                name="name"
                error={!!touched.name && !!errors.name}
                helperText={touched.name && errors.name}
                sx={{ gridColumn: "span 2" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Contact Number"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.phno}
                name="phno"
                error={!!touched.phno && !!errors.phno}
                helperText={touched.phno && errors.phno}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Money Owed"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.money_owed}
                name="money_owed"
                error={!!touched.money_owed && !!errors.money_owed}
                helperText={touched.money_owed && errors.money_owed}
                sx={{ gridColumn: "span 4" }}
              />
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Time interval"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.time_period_given}
                name="time_period_given"
                error={!!touched.time_period_given && !!errors.time_period_given}
                helperText={touched.time_period_given && errors.time_period_given}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Create New Contact
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

const checkoutSchema = yup.object().shape({
  name: yup.string().required("required"),
  phno: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid")
    .required("required"),
  money_owed: yup.string().required("required"),
  time_period_given: yup.string().required("required"),
});

const initialValues = {
  name: "",
  phno: "",
  money_owed: "",
  time_period_given: "",
};

export default Form;