// src/components/AdminEmployeeList.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const AdminEmployeeList = () => {
  const [employeeList, setEmployeeList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Get auth context to access the current user and auth fetch
  const { currentUser, authFetch } = useAuth();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setIsLoading(true);
        setError("");

        // Use the authFetch helper instead of regular fetch
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

    fetchEmployees();
  }, [authFetch]);

  const handleRemoveEmployee = async ( employee, index, e ) => {
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
      const response = await authFetch(`http://localhost:5999/api/employee/${employee._id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }
      // Only update local state if API call was successful
      const newEmployees = [...employeeList];
      newEmployees.splice(index, 1);
      setEmployeeList(newEmployees);
      // Show success message
      alert(`${employee.firstName} ${employee.lastName} has been removed.`);
    } catch (error) {
      console.error("Error removing employee:", error);
      alert("Failed to remove employee. Please try again.");
    }
  };

  return (
    <div className="content-section">
      <h1 className="page-title">Employee List</h1>
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
    </div>
  );
};

export default AdminEmployeeList;
