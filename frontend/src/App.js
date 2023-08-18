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
import Header from "./components/header";

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
        <AuthProvider>
          <div className="app">
            <Sidebar isSidebar={isSidebar} />
            <main
              className="content"
              style={{ backgroundColor: mainBackgroundColor }}
            >
              <Topbar setIsSidebar={setIsSidebar} />
              <Header />
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />

                <Route
                  path="/hello"
                  element={<TransactionsToday />}
                />
                <Route
                  path="/create_person"
                  element={<CreatePersonForm />}
                />
                <Route
                  path="/notification"
                  element={<NotificationPage />}
                />
                <Route
                  path="/persons/:personId"
                  element={<PersonProfile1 />}
                />
                <Route
                  path="/form"
                  element={<Form />}
                />
                <Route
                  path="/contacts"
                  element={<Contacts />}
                />

                <Route path="/login" element={<Login />} />
              </Routes>
            </main>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
