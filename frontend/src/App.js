import React from "react";
import { useState } from "react";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import { Route, Routes, useParams } from "react-router-dom";
import CreatePersonForm from "./pages/new";
import NotificationPage from "./pages/notifications";
import PersonProfile from "./pages/profile";
import DesktopHome from "./pages/home";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import Contacts from "./scenes/profile";
import Form from "./scenes/addcontact";
import Dashboard from "./scenes/dashboard";
import TransactionsToday from "./scenes/notifications";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/hello" element={<TransactionsToday />} />
              <Route path="/create-person" element={<CreatePersonForm />} />
              <Route path="/notification" element={<NotificationPage />} />
              <Route path="/person/:id" element={<PersonProfileWrapper />} />
              <Route path="/reminder" element={<DesktopHome />} />
              <Route path="/form" element={<Form />} />
              <Route path="/contacts" element={<Contacts />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
const PersonProfileWrapper = () => {
  const params = useParams();
  return <PersonProfile personId={params.id} />;
};

export default App;
