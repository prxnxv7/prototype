import { Box, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transactions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [transactionData, setTransactionData] = useState([]);
  const [paidAmount, setPaidAmount] = useState(0);  // State to hold fetched data


  const columns = [
    {
      field: "person.name",
      headerName: "Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "person.phno",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "total_amount_owed",
      headerName: "Money Owed",
      flex: 1,
    },
    {
      field: "time_period",
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
    {
      field: "next_due_date",
      headerName: "Next Due Date",
      flex: 1,
      valueGetter: (params) => {
        const nextDueDate = new Date(params.row.next_due_date);
        return nextDueDate.toLocaleDateString();
      },
    },    
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" alignItems="center">
          <TextField
            label="Paid Amount"
            type="number"
            variant="outlined"
            size="small"
            value={paidAmount}
            onChange={(e) => setPaidAmount(Number(e.target.value))}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handlePaidButtonClick(params.row.id)}
          >
            Paid
          </Button>
        </Box>
      ),
    }
  ];


  const handlePaidButtonClick = async (transactionId) => {
    try {
      // Call the update_transaction function
      const response = await axios.patch(`http://localhost:8000/api/update_transaction/${transactionId}`, {
        paid: paidAmount
      });
      console.log('Updated transaction:', response.data);
      
      // Refresh the transaction data after successful update
      fetchTransactionData();
      
      // Reset the paid amount input field
      setPaidAmount(0);
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };

  const fetchTransactionData = () => {
    axios.get('http://localhost:8000/api/notification_page')
      .then(response => {
        setTransactionData(response.data);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchTransactionData();
  }, []);

  return (
    <Box m="20px">
      <Header
        title="Notifications"
        subtitle="Transaction Details"
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
          rows={transactionData}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;