// frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect, useCallback } from "react";

const API_BASE_URL = "http://localhost:5999";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Function to make authenticated API calls - moved up to be used in checkLoggedIn
  const authFetch = useCallback(async (endpoint, options = {}) => {
    const url = endpoint.startsWith("http") ? endpoint : `${API_BASE_URL}/api/${endpoint}`;

    const token = localStorage.getItem("token");
    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    const defaultOptions = {
      headers: {
        ...authHeader,
        "Content-Type": "application/json",
      },
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...(options.headers || {}),
      },
    };

    return fetch(url, mergedOptions);
  }, []);

  // Check for stored token and fetch user profile
  const checkLoggedIn = useCallback(async () => {
    try {
      console.log("Checking if user logged in");
      const token = localStorage.getItem("token");
      console.log("Token exists –", !!token);

      if (!token) {
        setCurrentUser(null);
        setIsLoading(false);
        return;
      }

      const caughtUser = localStorage.getItem("user");
      if (caughtUser) {
        try {
          const userData = JSON.parse(caughtUser);
          console.log("Using caught user data:", userData);
          setCurrentUser(userData);
        } catch (e) {
          console.error("Error parsing caught user:", e);
        }
      }

      // Fetch user profile
      try {
        const response = await fetch(`${API_BASE_URL}/api/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const userData = await response.json();
          console.log("Fresh user profile loaded:", userData);
          setCurrentUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          console.log("Invalid token, status:", response.status);
          if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setCurrentUser(null);
          }
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        // We already have cached user data, so don't clear on network errors
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setAuthError("Failed to authenticate user");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Run checkLoggedIn when component mounts OR when authRefresh changes
  useEffect(() => {
    checkLoggedIn();
  }, [checkLoggedIn]);

  // Login function
  const login = async (email, password) => {
    try {
      setAuthError(null);
      setIsLoading(true);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("Login successful:", data);

      // Store token in localStorage
      localStorage.setItem("token", data.token);

      if (data.user) {
        console.log("Storing user data from login:", data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        setCurrentUser(data.user);
      }

      return { success: true, role: data.role };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setCurrentUser(null);
  };

  // Function to get auth header for API calls
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        authError,
        login,
        logout,
        getAuthHeader,
        authFetch,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === "admin",
        isMechanic: currentUser?.role === "mechanic",
        isCustomer: currentUser?.role === "customer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  console.log(context);
  return context;
};
