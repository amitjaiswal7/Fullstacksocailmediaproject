// index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
  // Adjust path as necessary
import { AuthProvider } from './Component/AuthContext';
ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
     <AuthProvider>
        <App />
        </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
