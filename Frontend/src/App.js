/*****************************/
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Single import

// Dashboard components
import EmployeeDashboard from './Dashboards/EmployeeDashboard/EmployeeDashboard';
import AdminDashboard from './Dashboards/AdminDashboard/AdminDashboard';
import CustomerDashboard from "./Dashboards/CustomerDashboard/CustomerDashboard";

// Public page components
// import TEMPLandingPage from "./components/TEMPLandingPage";
import LandingPage from './HomePages/LandingPage';
import ServicesPage from './HomePages/ServicesPage';
import AboutUsPage from "./HomePages/AboutUsPage";
import ReviewsPage from "./HomePages/ReviewsPage";
import Login from './FormPages/Login';
import RegisterPage from './FormPages/Register';
import ForgotPassword from './FormPages/ForgotPassword';
import ResetPassword from './FormPages/ResetPassword';
import PrivacyPolicy from './FormPages/PrivacyPolicy';
import TermsOfService from './FormPages/TermsOfService';

// Import Protected Route components
import { PrivateRoute, AdminRoute } from './components/ProtectedRoutes';
import './App.css';

// Define App component first
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/role-router" element={<RoleRouter />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          
          {/* Temporary landing page - can redirect to login if not authenticated */}
          <Route path="/" element={<LandingPage />} />
          {/* <Route path="/" element={<TEMPLandingPage />} /> */}
          
          {/* Protected Dashboard routes */}
          <Route element={<PrivateRoute roleRequired="mechanic" />}>
            <Route path="/employee/*" element={<EmployeeDashboard />} />
          </Route>
          <Route element={<PrivateRoute roleRequired="admin" />}>
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Route>
          <Route element={<PrivateRoute roleRequired="customer" />}>
            <Route path="/customer/*" element={<CustomerDashboard />} />
          </Route>
          
          {/* Public Application Pages - no auth required */}
          <Route path="/home" element={<LandingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Define RoleRouter component after App
const RoleRouter = () => {
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  
  // console.log("RoleRouter - currentUser:", currentUser);
  
  useEffect(() => {
    if (isLoading) {
      return;
    }
    
    if (!isAuthenticated) {
      navigate("/login", { replace: true });
      return;
    }
    
    let userRole = currentUser?.role;
    
    if (!userRole) {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          userRole = userData.role;
          console.log("Using role from localStorage:", userRole);
        } catch (e) {
          console.error("Error parsing stored user:", e);
        }
      }
    }
    
    switch (userRole) {
      case 'admin':
        navigate("/admin", { replace: true });
        break;
      case 'mechanic':
        navigate("/employee", { replace: true });
        break;
      case 'customer':
        navigate("/customer", { replace: true });
        break;
      default:
        console.error("Unknown role or missing role information:", userRole);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate("/login", { replace: true });
    }
  }, [currentUser, isAuthenticated, isLoading, navigate]);
  
  return <div className="loading">Redirecting to your dashboard...</div>;
};

export default App;