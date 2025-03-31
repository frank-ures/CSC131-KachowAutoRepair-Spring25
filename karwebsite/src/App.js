// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import EmployeeDashboard from './dashboards/EmployeeDashboard/EmployeeDashboard';
import AdminDashboard from './dashboards/AdminDashboard/AdminDashboard';
import CustomerDashboard from "./dashboards/CustomerDashboard/CustomerDashboard";
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                {/* landing page at the root */}
                <Route path="/" element={<LandingPage />} />

                {/* dashboard routes */}
                <Route path="/employee/*" element={<EmployeeDashboard />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="/customer/*" element={<CustomerDashboard />} />
            </Routes>
        </Router>
    );
}

export default App;