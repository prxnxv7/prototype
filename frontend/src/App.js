import React, { useState } from "react";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useParams } from "react-router-dom";
import CreatePersonForm from "./pages/new";
import NotificationPage from "./pages/notifications";
import { CssBaseline, ThemeProvider, useTheme } from "@mui/material";
import { ColorModeContext, useMode, tokens } from "./theme";
import Contacts from "./scenes/profile";
import PersonProfile1 from "./scenes/contacts";
import Form from "./scenes/addcontact";
import Dashboard from "./scenes/dashboard";
import TransactionsToday from "./scenes/notifications";
import Login from "./scenes/login";
import "./App.css";
import PrivateRoute from "./utils/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const theme1 = useTheme();
  const colors = tokens(theme1.palette.mode);
  const mainBackgroundColor =
    theme.palette.mode === "dark" ? colors.grey[100] : colors.grey[50];

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main
            className="content"
            style={{ backgroundColor: mainBackgroundColor }}
          >
            <Topbar setIsSidebar={setIsSidebar} />
            <Router>
              <AuthProvider>
                <Routes>
                  <PrivateRoute element={Dashboard} path="/dashboard" />
                  <Route element={Login} path="/login" />
                  <PrivateRoute element={TransactionsToday} path="/hello" />
                  <PrivateRoute
                    element={CreatePersonForm}
                    path="/create_person"
                  />
                  <PrivateRoute
                    element={NotificationPage}
                    path="/notification"
                  />
                  <PrivateRoute
                    element={PersonProfile1}
                    path="//persons/:personId"
                  />
                  <PrivateRoute element={Form} path="/form" />
                  <PrivateRoute element={Contacts} path="/contacts" />
                </Routes>
              </AuthProvider>
            </Router>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
