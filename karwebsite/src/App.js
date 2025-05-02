/*****************************/
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Single import

// Dashboard components
import EmployeeDashboard from './dashboards/EmployeeDashboard/EmployeeDashboard';
import AdminDashboard from './dashboards/AdminDashboard/AdminDashboard';
import CustomerDashboard from "./dashboards/CustomerDashboard/CustomerDashboard";

// Public page components
// import TEMPLandingPage from "./components/TEMPLandingPage";
import LandingPage from './HomePages/LandingPage';
import ServicesPage from './HomePages/ServicesPage';
import AboutUsPage from "./HomePages/AboutUsPage";
import ReviewsPage from "./HomePages/ReviewsPage";
import Login from './HomePages/Login';
import RegisterPage from './HomePages/Register';

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
        </Routes>
      </Router>
    </AuthProvider>
  );
}

// Define RoleRouter component after App
const RoleRouter = () => {
  const { currentUser, isAuthenticated, isLoading } = useAuth();
  console.log("role router",currentUser);
  
  if (isLoading) {
    return <div className="loading">Loading user data...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  switch (currentUser.role) {
    case 'admin':
      return <Navigate to="/admin" />;
    case 'mechanic':
      return <Navigate to="/employee" />;
    case 'customer':
      return <Navigate to="/customer" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default App;


/*
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext'; // Single import

// Other imports...
// Dashboard components
import EmployeeDashboard from './dashboards/EmployeeDashboard/EmployeeDashboard';
import AdminDashboard from './dashboards/AdminDashboard/AdminDashboard';
import CustomerDashboard from "./dashboards/CustomerDashboard/CustomerDashboard";

// Public page components
import LandingPage from './HomePages/LandingPage/LandingPage';
import TEMPLandingPage from "./components/TEMPLandingPage";
import ServicesPage from './HomePages/ServicesPage/ServicesPage';
import AboutUsPage from "./HomePages/AboutUsPage/AboutUsPage";
import ReviewsPage from "./HomePages/ReviewsPage/ReviewsPage";
//import Login from './components/Login';

// Import Protected Route components
import { PrivateRoute, AdminRoute } from './components/ProtectedRoutes';

import './App.css';

// Move RoleRouter inside the AuthProvider in your component tree
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes *///}
          ///<Route path="/role-router" element={<RoleRouter />} />
          //{/* Other routes... */}
        //</Routes>
      //</Router>
   // </AuthProvider>
  //);
//}

// Define RoleRouter after your App component
//const RoleRouter = () => {
  //const { currentUser, isAuthenticated } = useAuth();
  /*
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  switch (currentUser.role) {
    case 'admin':
      return <Navigate to="/admin" />;
    case 'mechanic':
      return <Navigate to="/employee" />;
    case 'customer':
      return <Navigate to="/customer" />;
    default:
      return <Navigate to="/login" />;
  }
};

export default App;
*/

/*
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // Import the AuthProvider
import { useAuth } from './context/AuthContext'; // Import the AuthProvider

// Dashboard components
import EmployeeDashboard from './dashboards/EmployeeDashboard/EmployeeDashboard';
import AdminDashboard from './dashboards/AdminDashboard/AdminDashboard';
import CustomerDashboard from "./dashboards/CustomerDashboard/CustomerDashboard";

// Public page components
import LandingPage from './HomePages/LandingPage/LandingPage';
import TEMPLandingPage from "./components/TEMPLandingPage";
import ServicesPage from './HomePages/ServicesPage/ServicesPage';
import AboutUsPage from "./HomePages/AboutUsPage/AboutUsPage";
import ReviewsPage from "./HomePages/ReviewsPage/ReviewsPage";
//import Login from './components/Login';

// Import Protected Route components
import { PrivateRoute, AdminRoute } from './components/ProtectedRoutes';

import './App.css';


// A component for role-based redirection
const RoleRouter = () => {
  const { currentUser, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  switch (currentUser.role) {
    case 'admin':
      return <Navigate to="/admin" />;
    case 'mechanic':
      return <Navigate to="/employee" />;
    case 'customer':
      return <Navigate to="/customer" />;
    //default:
    //  return <Navigate to="/login" />;
  }
};



function App() {
  
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Auth routes *///}
          /*
         {/*} <Route path="/login" element={<Login />} />*///}
          //<Route path="/role-router" element={<RoleRouter />} />
          
          //{/* Temporary landing page - can redirect to login if not authenticated */}
          //<Route path="/" element={<TEMPLandingPage />} />
          
         // {/* Protected Dashboard routes */}
         // <Route element={<PrivateRoute roleRequired="mechanic" />}>
         //   <Route path="/employee/*" element={<EmployeeDashboard />} />
         // </Route>
          
         // <Route element={<PrivateRoute roleRequired="admin" />}>
         //   <Route path="/admin/*" element={<AdminDashboard />} />
         // </Route>
          
         // <Route element={<PrivateRoute roleRequired="customer" />}>
         //   <Route path="/customer/*" element={<CustomerDashboard />} />
          //</Route>
          
          
          
         // {/* Public Application Pages - no auth required */}
          ///<Route path="/home" element={<LandingPage />} />
          //<Route path="/services" element={<ServicesPage />} />
          //<Route path="/about" element={<AboutUsPage />} />
          //<Route path="/reviews" element={<ReviewsPage />} />
        //</Routes>
     // </Router>
   // </AuthProvider>
  //);
  
//}

//export default App;