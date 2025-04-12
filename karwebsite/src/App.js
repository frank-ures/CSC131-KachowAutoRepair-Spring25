// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmployeeDashboard from './dashboards/EmployeeDashboard/EmployeeDashboard';
import AdminDashboard from './dashboards/AdminDashboard/AdminDashboard';
import CustomerDashboard from "./dashboards/CustomerDashboard/CustomerDashboard";
import LandingPage from './HomePages/LandingPage/LandingPage';
import TEMPLandingPage from "./components/TEMPLandingPage";
import ServicesPage from './HomePages/ServicesPage/ServicesPage';
import './App.css';
import AboutUsPage from "./HomePages/AboutUsPage/AboutUsPage";
import ReviewsPage from "./HomePages/ReviewsPage/ReviewsPage";

function App() {
    return (
        <Router>
            <Routes>
                {/* Temporary landing page */}
                <Route path="/" element={<TEMPLandingPage />} />

                {/* Dashboard routes */}
                <Route path="/employee/*" element={<EmployeeDashboard />} />
                <Route path="/admin/*" element={<AdminDashboard />} />
                <Route path="/customer/*" element={<CustomerDashboard />} />

                {/* Application Pages */}
                <Route path="/home" element={<LandingPage />} />
                <Route path="/services" element={<ServicesPage />} />
                <Route path="/about" element={<AboutUsPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
            </Routes>
        </Router>
    );
}

export default App;