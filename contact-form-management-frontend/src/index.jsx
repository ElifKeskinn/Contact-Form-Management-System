import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
//bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
//bundle
import "bootstrap/dist/js/bootstrap.bundle.min";
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
