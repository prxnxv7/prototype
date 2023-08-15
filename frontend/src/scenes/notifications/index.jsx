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
  const [transactions, setTransactions] = useState([]);
  const [paidAmount, setPaidAmount] = useState("");


  useEffect(() => {
    fetch("http://localhost:8000/api/transactions/")
      .then(response => response.json())
      .then(data => {
        const flattenedData = data.map(transaction => ({
          ...transaction,
          name: transaction.person_details.name,
          phno: transaction.person_details.phno,
        }));
        setTransactions(flattenedData);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const handlePaid = async (transactionId, paidAmount) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/transactions/${transactionId}/`,
        {
          paid: parseFloat(paidAmount),
          paid_date: new Date().toISOString().slice(0, 10),
        }
      );
      const updatedTransactions = transactions.map((transaction) =>
        transaction.id === response.data.id ? response.data : transaction
      );
      setTransactions(updatedTransactions);
      console.log(updatedTransactions);
    } catch (error) {
    }
  };

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
            onClick={() => handlePaid(params.row.id,paidAmount)}
          >
            Paid
          </Button>
        </Box>
      ),
    }
  ];


  return (
    <Box m="20px">
      <Header
        title="Notifications"
        subtitle="Transaction Details"
      />
      <Box
        m="40px 0 0 0"
        height="60vh"
        width="76.5rem"
        sx={{
          "& .MuiDataGrid-root": {
            fontSize:"15px",
            borderColor: colors.grey[900],
            backgroundColor: colors.primary[0],
            borderRadius:"20px"
          },
          "& .MuiDataGrid-cell": {
            fontSize:"15px",
            borderLeft:"none",
            paddingLeft:"20px",
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize:"18px",
            marginLeft:"10px",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[0],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            borderRadius:"20px",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
            
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
            marginBottom:"20px",
            marginTop:"20px",
            marginLeft:"10px",
            backgroundColor: colors.greenAccent[600],
          },
        }}
      >
        <DataGrid
          rows={transactions}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;