import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import NotAuthorizedPage from './pages/NotAuthorizedPage';
import NotFoundPage from './pages/NotFoundPage';
import PrivateRoute from './components/PrivateRoute';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';  
import ReaderPage from './pages/ReaderPage'; 
const RoutesConfig = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/not-authorized" element={<NotAuthorizedPage />} />
        <Route path="/not-found" element={<NotFoundPage />} />
        {/* Korumalı rotalar gelecek */}
        <Route path="/contact" element={<PrivateRoute element={<ContactPage />} />} />
        <Route path="/admin" element={<PrivateRoute element={<AdminPage />} />} />
        <Route path="/reader" element={<PrivateRoute element={<ReaderPage />} />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};

export default RoutesConfig;
