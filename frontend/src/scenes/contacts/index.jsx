import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Box, Button, Typography } from "@mui/material";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";
import "./index.css";

const PersonProfile1 = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { personId } = useParams();
  const [person, setPerson] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    const fetchPersonAndTransactions = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/persons/${personId}/`
        );
        setPerson(response.data.person);
        setTransactions(response.data.transactions);
        setPayments(response.data.payments);
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
    <Box>
      <Box
        margin="5px 20px 0px 20px"
        borderRadius="10px"
        sx={{ backgroundColor: colors.primary[0] }}
      >
        <Box
          display="flex"
          justifyContent="start"
          alignItems="center"
          gap="10rem"
          padding="0px 20px 0px 30px"
        >
          <h1 sx={{ marginLeft: "10px" }}>{person.name}</h1>
          <h2>{person.phno}</h2>
        </Box>

        {/* details */}
        <Box backgroundColor={colors.primary[0]}>
          <Box
            display="grid"
            gridTemplateColumns="repeat(9, 1fr)"
            gridAutoRows="140px"
            gap="10px"
          >
            {/* Row 1 */}
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              borderRadius="10px"
              margin="15px 0px 0px 30px"
              paddingLeft="20px"
            >
              <h2>First Due</h2>
              <h2 className="css">
                {new Date(person.start_date).toLocaleDateString()}
              </h2>
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              borderRadius="10px"
              margin="15px 0px 0px 30px"
              paddingLeft="20px"
            >
              <h2>Amount Per Due</h2>
              <h2 className="css">{person.time_period_given} Day</h2>
            </Box>
            <Box
              gridColumn="span 3"
              backgroundColor={colors.primary[400]}
              borderRadius="10px"
              margin="15px 15px 0px 30px"
              paddingLeft="20px"
            >
              <h2>Next Due</h2>
              <h2 className="css">{transactions.next_due_date}</h2>
            </Box>

            {/* ROW 2 */}
            <Box
              gridColumn="span 3"
              gridRow="span 2"
              backgroundColor={colors.blueAccent[900]}
              borderRadius="10px"
              margin="15px 0px 15px 30px"
            >
              <Box
                mt="25px"
                p="0 30px"
                display="flex "
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.grey[100]}
                >
                  Total Completed
                </Typography>
              </Box>
            </Box>
            <Box
              gridColumn="span 3"
              gridRow="span 2"
              backgroundColor={colors.blueAccent[900]}
              borderRadius="10px"
              margin="15px 0px 15px 30px"
            >
              <Box
                mt="25px"
                p="0 30px"
                display="flex "
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.grey[100]}
                >
                  Total Pending
                </Typography>
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
                  variant="h5"
                  fontWeight="600"
                >
                  Previous Payments
                </Typography>
              </Box>
              {payments.map((payment) => (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  borderBottom={`4px solid ${colors.grey[900]}`}
                  p="15px"
                >
                  <Box color={colors.grey[100]}>{payment.paid_date}</Box>
                  <Box
                    backgroundColor={colors.greenAccent[500]}
                    p="5px 10px"
                    borderRadius="4px"
                  >
                    ${payment.paid_amount}
                  </Box>
                </Box>
              ))}
            </Box>

            {/* Row 3 */}
            {transactions.map((transaction) => (
              <Box
                gridColumn="span 9"
                backgroundColor={colors.primary[400]}
                display="flex"
                alignItems="center"
                justifyContent="space-between "
                borderRadius="10px"
                margin="15px 15px 25px 30px"
              >
                <Box display="block">
                  <Typography
                    variant="h3"
                    fontWeight="200"
                    color={colors.grey[100]}
                    paddingLeft="10rem"
                  >
                    Total Amount
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="600"
                    color={colors.grey[100]}
                    paddingLeft="10rem"
                    paddingTop="15px"
                  >
                    ₹{transaction.total_amount_owed}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight="200"
                    color={colors.grey[100]}
                  >
                    Collected
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="600"
                    color={colors.greenAccent[400]}
                    paddingTop="15px"
                  >
                    ₹{transaction.final_paid}
                  </Typography>
                </Box>
                <Box>
                  <Typography
                    variant="h3"
                    fontWeight="200"
                    color={colors.grey[100]}
                    paddingRight="10rem"
                  >
                    Pending
                  </Typography>
                  <Typography
                    variant="h3"
                    fontWeight="600"
                    color={colors.redAccent[500]}
                    paddingRight="10rem"
                    paddingTop="15px"
                  >
                    ₹{transaction.pending_amount}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PersonProfile1;
