// src/components/AdminEmployeeList.jsx
import React, { useEffect, useState, useRef } from "react";
import { useAuth } from "../../context/AuthContext";

const AdminEmployeeList = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  // Refs for modal form inputs
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const roleRef = useRef(null);
  const hourlyWageRef = useRef(null);
  
  // Get auth context to access the current user and auth fetch
  const { currentUser, authFetch } = useAuth();
  
  useEffect(() => {
    fetchEmployees();
  }, [authFetch]);

  const fetchEmployees = async () => {
    try {
      setIsLoading(true);
      setError("");
      // Use the authFetch helper
      const response = await authFetch("/employees");
      if (!response.ok) {
        throw new Error("Failed to fetch employee list");
      }
      const data = await response.json();
      setEmployeeList(data);
    } catch (error) {
      console.error(error);
      setError("Error fetching employee list");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Delete employee from database
  const handleRemoveEmployee = async (employee, index, e) => {
    e.stopPropagation();
    // Confirm before deleting
    const confirmDelete = window.confirm(
      `Are you sure you want to remove ${employee.firstName} ${employee.lastName}?`
    );
    if (!confirmDelete) {
      return;
    }
    try {
      // Make DELETE request to API
      const response = await authFetch(`/employee/${employee._id}`, {
        method: 'DELETE'
      });
      if (!response.ok) {
        throw new Error('Failed to delete employee');
      }
      // Update local state if API call was successful
      const newEmployees = [...employeeList];
      newEmployees.splice(index, 1);
      setEmployeeList(newEmployees);
      alert(`${employee.firstName} ${employee.lastName} has been removed.`);
    } catch (error) {
      console.error('Error removing employee:', error);
      alert('Failed to remove employee. Please try again.');
    }
  };
  
  const handleOpenModal = () => {
    setShowModal(true);
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
    
    // Reset form fields, clear refs
    if (firstNameRef.current) firstNameRef.current.value = "";
    if (lastNameRef.current) lastNameRef.current.value = "";
    if (usernameRef.current) usernameRef.current.value = "";
    if (emailRef.current) emailRef.current.value = "";
    if (passwordRef.current) passwordRef.current.value = "";
    if (roleRef.current) roleRef.current.value = "mechanic";
    if (hourlyWageRef.current) hourlyWageRef.current.value = "0";
  };
  
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    
    try {
      // Get values from refs
      const newEmployee = {
        firstName: firstNameRef.current.value,
        lastName: lastNameRef.current.value,
        username: usernameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value,
        role: roleRef.current.value,
        hourlyWage: parseFloat(hourlyWageRef.current.value || 0)
      };
      // Verify required fields are not empty
      if (!newEmployee.firstName || !newEmployee.lastName || !newEmployee.email || !newEmployee.password) {
        alert("Please fill all required fields");
        return;
      }
      // Make POST request to create employee
      const response = await authFetch('http://localhost:5999/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEmployee)
      });
      if (!response.ok) {
        throw new Error('Failed to create employee');
      }
      const createdEmployee = await response.json();
      setEmployeeList([...employeeList, createdEmployee]);
      alert(`Employee ${newEmployee.firstName} ${newEmployee.lastName} has been added successfully.`);
      handleCloseModal();
      // Needed to display new employee correctly
      fetchEmployees();
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee. Please try again.');
    }
  };
  
  // Modal component
  const EmployeeModal = () => {
    if (!showModal) return null;
    
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header">
            <h2>Add New User</h2>
            <button className="close-button" onClick={handleCloseModal}>&times;</button>
          </div>
          <form onSubmit={handleAddEmployee} autoComplete="off">
            <div className="form-group">
              <label htmlFor="firstName">First Name*:</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                ref={firstNameRef}
                defaultValue=""
                autoComplete="off"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name*:</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                ref={lastNameRef}
                defaultValue=""
                autoComplete="off"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="username">Username*:</label>
              <input
                type="text"
                id="username"
                name="username"
                ref={usernameRef}
                defaultValue=""
                autoComplete="off"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email*:</label>
              <input
                type="email"
                id="email"
                name="email"
                ref={emailRef}
                defaultValue=""
                autoComplete="off"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password*:</label>
              <input
                type="password"
                id="password"
                name="password"
                ref={passwordRef}
                defaultValue=""
                autoComplete="off"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="role">Role:</label>
              <select
                id="role"
                name="role"
                ref={roleRef}
                defaultValue="mechanic"
              >
                <option value="mechanic">Mechanic</option>
                <option value="admin">Admin</option>
                <option value="customer">Customer</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="hourlyWage">Hourly Wage ($):</label>
              <input
                type="number"
                id="hourlyWage"
                name="hourlyWage"
                step="0.01"
                min="0"
                ref={hourlyWageRef}
                defaultValue="0"
                autoComplete="off"
              />
            </div>
            
            <div className="form-buttons">
              <button type="button" onClick={handleCloseModal}>Cancel</button>
              <button type="submit">Add Employee</button>
            </div>
          </form>
        </div>
      </div>
    );
  };
  
  return (
    <div className="content-section">
      <div className="employee-header">
        <h1 className="page-title">Employee List</h1>
        <button className="add-employee-button" onClick={handleOpenModal}>Add Employee</button>
      </div>
      
      {isLoading && <div className="loading">Loading employees...</div>}
      {error && <div className="error-message">{error}</div>}
      
      <div className="employee-list-container">
        {employeeList.length === 0 && !isLoading ? (
          <div className="no-employees-message">No employees found.</div>
        ) : (
          employeeList.map((employee, index) => (
            <div
              key={employee._id || index}
              className="employee-item"
              onClick={() =>
                alert(
                  `Showing details for ${employee.firstName}: ${employee.role}`
                )
              }
            >
              <div className="employee-name">{employee.firstName} {employee.lastName}</div>
              <div className="employee-type">{employee.role}</div>
              <div className="employee-remove">
                <button onClick={(e) => handleRemoveEmployee(employee, index, e)}>
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <EmployeeModal />
    </div>
  );
};

export default AdminEmployeeList;