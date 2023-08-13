import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [contactData, setContactData] = useState([]);  // State to hold fetched data


  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "phno",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "money_owed",
      headerName: "Money Owed",
      flex: 1,
    },
    {
      field: "time_period_given",
      headerName: "Time Interval Given",
      flex: 1,
    },
    {
      field: "start_date",
      headerName: "Start Date",
      flex: 1,
      valueGetter: (params) => {
        const startDate = new Date(params.row.start_date);
        return startDate.toLocaleDateString();
      },
    },
  ];

  useEffect(() => {
    // Fetch data from your Django API
    fetch("http://localhost:8000/api/profile/")
      .then(response => response.json())
      .then(data => setContactData(data))
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.greenAccent[300],
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.blueAccent[700],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={contactData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Contacts;