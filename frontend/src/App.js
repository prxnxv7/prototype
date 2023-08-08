import React from 'react';
import { BrowserRouter as Router, Link, Route, Routes, Outlet, useParams } from 'react-router-dom';
import CreatePersonForm from './pages/new';
import NotificationPage from './pages/notifications';
import PersonProfile from './pages/profile';
import DesktopHome from './pages/home';

const App = () => {
  return (
    <Router>

      <div>
        <h1>Hello world
          
        </h1>
        <Routes>
          <Route path="/create-person" element={<CreatePersonForm />} />
          <Route path="/notification" element={<NotificationPage />} />
          <Route path="/person/:id" element={<PersonProfileWrapper />} />
          <Route path="/reminder" element={<DesktopHome />} />
        </Routes>
      </div>
    </Router>
  );
};

const PersonProfileWrapper = () => {
  const params = useParams();
  return <PersonProfile personId={params.id} />;
};

export default App;
