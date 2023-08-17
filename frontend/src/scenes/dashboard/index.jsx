import { Box, Button, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import Header from "../../components/header";
import StatBox from "../../components/statbox";
import ProgressCircle from "../../components/progresscircles";
import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [fetchedData, setFetchedData] = useState([]);

  let { authTokens, logoutUser } = useContext(AuthContext);

  useEffect(() => {
    getData();
  }, []);

  let getData = async () => {
    let response = await fetch("http://127.0.0.1:8000/api/dashboard/", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + String(authTokens.access),
      },
    });
    let data = await response.json();

    if (response.status === 200) {
      setFetchedData(data);
    } else if (response.statusText === "Unauthorized") {
      logoutUser();
    }
  };

  return (
    <Box m="20px">
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
      </Box>

      {/* GRID & CHARTS */}
      <Box backgroundColor={colors.primary[0]} borderRadius="15px">
        <Box
          display="grid"
          gridTemplateColumns="repeat(9, 1fr)"
          gridAutoRows="140px"
          gap="20px"
        >
          {/* ROW 1 */}
          <Box
            gridColumn="span 3"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="10px"
            margin="15px 0px 0px 15px"
          >
            ///////
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="block"
            borderRadius="10px"
            margin="15px 0px 0px 15px"
          >
            <Typography color={colors.grey[100]} variant="h3" fontWeight="600">
              Todays Collections
            </Typography>
            <Typography
              color={colors.greenAccent[400]}
              variant="h3"
              fontWeight="600"
              sx={{ marginTop: "20px" }}
            >
              12
            </Typography>
          </Box>
          <Box
            gridColumn="span 3"
            backgroundColor={colors.primary[400]}
            display="block"
            borderRadius="10px"
            margin="15px 0px 0px 15px"
          >
            <Typography color={colors.grey[100]} variant="h3" fontWeight="600">
              Pending Collections
            </Typography>
            <Typography
              color={colors.greenAccent[400]}
              variant="h3"
              fontWeight="600"
              sx={{ marginTop: "20px" }}
            >
              5
            </Typography>
          </Box>

          {/* ROW 2 */}
          <Box
            gridColumn="span 3"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            overflow="auto"
            borderRadius="10px"
            margin="15px 15px 15px 15px"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[400]}`}
              colors={colors.grey[100]}
              p="15px"
            >
              <Typography
                color={colors.grey[100]}
                variant="h3"
                fontWeight="600"
              >
                Paid Today
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.grey[900]}`}
              p="15px"
            >
              <Box color={colors.grey[100]}>5714</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                $60000
              </Box>
            </Box>
          </Box>
          <Box
            gridColumn="span 3"
            gridRow="span 2"
            backgroundColor={colors.primary[400]}
            overflow="auto"
            borderRadius="10px"
            margin="15px 15px 15px 15px"
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.primary[400]}`}
              colors={colors.grey[100]}
              p="15px"
            >
              <Typography
                color={colors.grey[100]}
                variant="h3"
                fontWeight="600"
              >
                Pending
              </Typography>
            </Box>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              borderBottom={`4px solid ${colors.grey[900]}`}
              p="15px"
            >
              <Box color={colors.grey[100]}>5714</Box>
              <Box
                backgroundColor={colors.greenAccent[500]}
                p="5px 10px"
                borderRadius="4px"
              >
                $60000
              </Box>
            </Box>
          </Box>
          <Box
            gridColumn="span 3"
            gridRow="span 1"
            backgroundColor={colors.primary[400]}
            borderRadius="10px"
            margin="15px 0px 15px 15px"
          >
            <Box
              mt="25px"
              p="0 30px"
              display="flex "
              justifyContent="space-between"
              alignItems="center"
            >
              <Box>
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.grey[100]}
                >
                  Total Amount Collected today
                </Typography>
                <Typography
                  variant="h3"
                  fontWeight="bold"
                  color={colors.greenAccent[500]}
                >
                  $59,342.32
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
