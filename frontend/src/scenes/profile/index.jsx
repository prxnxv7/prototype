import { Box, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/header";
import { useTheme } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import axios from "axios";

const Contacts = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [contactData, setContactData] = useState([]);
  let { authTokens, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    getprofile();
  }, []);

  let getprofile = async () => {
    let response = await axios.get("http://127.0.0.1:8000/api/profile/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setContactData(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
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
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => {
        return (
          <Link to={`/persons/${params.row.id}`}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: colors.greenAccent[600],
                color: colors.grey[100],
              }}
            >
              More
            </Button>
          </Link>
        );
      },
    },
  ];

  return (
    <Box m="20px">
      <Header
        title="CONTACTS"
        subtitle="List of Contacts for Future Reference"
      />
      <Box
        m="40px 0 0 0"
        height="60vh"
        width="75rem"
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
            paddingLeft: "20.5px",
          },
          "& .MuiDataGrid-columnHeaders": {
            fontSize: "18px",
            marginLeft: "10px",
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
            color: `${colors.grey[100]} !important`,
            marginBottom: "20px",
            marginTop: "20px",
            marginLeft: "10px",
            backgroundColor: colors.greenAccent[600],
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
