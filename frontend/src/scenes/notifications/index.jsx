import { Box, Button, TextField } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../context/AuthContext";
import { Link } from "react-router-dom";

const Transactions = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [transactions, setTransactions] = useState([]);
  const [paidAmounts, setPaidAmounts] = useState({});
  let { authTokens, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    gettransaction();
  }, []);

  let gettransaction = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/transactions/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();
    const flattenedData = data.map((transaction) => ({
      ...transaction,
      name: transaction.person_details.name,
      phno: transaction.person_details.phno,
    }));

    if (response.status === 200) {
      setTransactions(flattenedData);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  const handlePaid = async (transactionId, paidAmount) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/transactions/${transactionId}/`,
        {
          paid: parseFloat(paidAmount),
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      const updatedTransactions = transactions.map((transaction) =>
        transaction.id === response.data.id ? response.data : transaction
      );
      setTransactions(updatedTransactions);
      setPaidAmounts((prevPaidAmounts) => ({
        ...prevPaidAmounts,
        [transactionId]: "",
      }));
      window.location.reload();
      console.log(updatedTransactions);
    } catch (error) {}
  };

  const handleIgnore = async (transactionId) => {
    try {
      const response = await axios.patch(
        `http://localhost:8000/api/ignore/${transactionId}/`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + String(authTokens.access),
          },
        }
      );
      console.log(authTokens.access);
      const updatedTransactions = transactions.map((transaction) =>
        transaction.id === response.data.id ? response.data : transaction
      );
      setTransactions(updatedTransactions);
      window.location.reload();
      console.log(updatedTransactions);
    } catch (error) {
      console.error("Error:", error);
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
      headerName: "Total Amount",
      flex: 1,
    },
    {
      field: "paid",
      headerName: "Previous Paid",
      flex: 1,
    },
    {
      field: "previous_due_date",
      headerName: "Previous Date",
      flex: 1,
      valueGetter: (params) => {
        const startDate = new Date(params.row.previous_due_date);
        return startDate.toLocaleDateString();
      },
    },
    {
      field: "per_due_amount",
      headerName: "Amount per due",
      flex: 1,
      valueGetter: (params) => {
        const nextDueDate = new Date(params.row.per_due_amount);
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
            value={paidAmounts[params.row.id] || ""}
            onChange={(e) =>
              setPaidAmounts((prevPaidAmounts) => ({
                ...prevPaidAmounts,
                [params.row.id]: e.target.value,
              }))
            }
            sx={{ marginRight: "5px" }}
          />
          <Link to={`/notifications/`}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: colors.greenAccent[500],
              }}
              onClick={() =>
                handlePaid(params.row.id, paidAmounts[params.row.id] || "")
              }
            >
              Paid
            </Button>
          </Link>
          <Button
              variant="contained"
              sx={{
                backgroundColor: colors.greenAccent[500],
              }}
              onClick={() =>
                handleIgnore(params.row.id)
              }
            >
              Ignore
            </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="Notifications" subtitle="Transaction Details" />
      <Box
        m="40px 0 0 0"
        height="60vh"
        width="79vw"
        sx={{
          "& .MuiDataGrid-root": {
            fontSize: "15px",
            borderColor: colors.grey[900],
            backgroundColor: colors.primary[0],
            borderRadius: "20px",
          },
          "& .MuiDataGrid-cell": {
            fontSize: "15px",
            borderLeft: "none",
            paddingLeft: "20px",
            fontFamily: "sans-serif",
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: "17px",
            marginLeft: "10px",
            fontFamily: "Montserrat",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[0],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            borderRadius: "20px",
          },
          "& .MuiCheckbox-root": {
            color: `${colors.greenAccent[200]} !important`,
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `#ffffff !important`,
            marginBottom: "20px",
            marginTop: "20px",
            marginLeft: "10px",
            backgroundColor: "#a654f8",
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
