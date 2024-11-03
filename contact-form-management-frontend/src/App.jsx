import { BrowserRouter , Route, Routes,Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from "react";
import AuthContext from './context/AuthContext';
import LoginPage from './pages/LoginPage'; 
import HomePage from './pages/HomePage';
import MessagesPage from './pages/MessagesPage';
import UserPage from './pages/UserPage';
import ReportsPage from './pages/ReportsPage.jsx';
import NotAuthorizedPage from './pages/NotAuthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import MessageDetails from "./pages/MessageDetails";
import EditUser from "./pages/EditUser";
import AddUserPage from "./pages/AddUserPage";
import PropTypes from 'prop-types';
import {DarkModeProvider} from './context/DarkModeContext.js';
import { LanguageProvider } from './context/LanguageContext'; 
import './utils/i18n.js';

function App() {
  const userRoles = {
    ADMIN: "admin",
    READER: "reader",
  };


  return (
    <LanguageProvider>
    <DarkModeProvider>
    <BrowserRouter>
      <Routes>
        {/* Public Pages */}
        <Route index element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
       {/* Admin and reader pages */}
        <Route
          path="/messages"
          element={<PrivateRoute roles={[userRoles.ADMIN, userRoles.READER]} />}
        >
          <Route path="/messages" element={<MessagesPage />} />
        </Route>
        <Route
          path="/messages/:messageId"
          element={<PrivateRoute roles={[userRoles.ADMIN, userRoles.READER]} />}
        >
          <Route path="/messages/:messageId" element={<MessageDetails />} />
        </Route>
        {/* Admin pages */}
        <Route
          path="/users"
          element={<PrivateRoute roles={[userRoles.ADMIN]} />}
        >
          <Route path="/users" element={<UserPage />} />
        </Route>
        <Route
          path="/users/:id"
          element={<PrivateRoute roles={[userRoles.ADMIN]} />}
        >
          <Route path="/users/:id" element={<EditUser />} />
        </Route>
        <Route
          path="/users/add-new-user"
          element={<PrivateRoute roles={[userRoles.ADMIN]} />}
        >
          <Route path="/users/add-new-user" element={<AddUserPage />} />
        </Route>
        <Route
          path="/reports"
          element={<PrivateRoute roles={[userRoles.ADMIN]} />}
        >
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
        {/* Error pages */}
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/unauthorized" element={<NotAuthorizedPage />} />
      </Routes>
    </BrowserRouter>
    </DarkModeProvider>
    </LanguageProvider>
  );
}

function PrivateRoute(props) {
  const { authenticated, isLoading } = AuthContext();
  const navigate = useNavigate();
  const userRole = JSON.parse(localStorage.getItem("user"))?.role ?? "";

  useEffect(() => {
    if (!isLoading && !authenticated) {
      navigate("/login");
    }
  }, [authenticated, isLoading, navigate]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <Navigate to="/login" />;
  }
  else if (!props.roles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }
  else {
    return <Outlet />;
  }
}

PrivateRoute.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default App;

