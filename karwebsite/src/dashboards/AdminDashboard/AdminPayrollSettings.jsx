import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

const AdminPayrollSettings = () => {
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

  // function to change wage if clicked on
  const changeWage = async (employeeIndex) => {
    const defaultValue = employeeList[employeeIndex].hourlyWage;
    const input = prompt("Enter New Wage:", defaultValue);

    if (input !== null) {
      const parsedWage = parseFloat(input);

      if (!isNaN(parsedWage) && parsedWage >= 0) {
        try {
          // Use authFetch helper here too
          const response = await authFetch(
            `/employee/${employeeList[employeeIndex]._id}`,
            {
              method: "PUT",
              body: JSON.stringify({ hourlyWage: parsedWage }),
            }
          );

          if (!response.ok) {
            throw new Error("Failed to update employee wage.");
          }

          const updatedEmployee = await response.json();

          // Update state only if request is successful
          setEmployeeList((prevList) => {
            const newList = [...prevList];
            newList[employeeIndex] = updatedEmployee;
            return newList;
          });
        } catch (error) {
          console.error(error);
          alert("Failed to update wage in the database.");
        }
      } else {
        alert("Invalid wage!");
      }
    }
  };

  if (isLoading) {
    return <div className="loading">Loading employees...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="content-section">
      <h1 className="page-title">Payroll Settings</h1>
      <div className="admin-info">
        <p>
          Logged in as: {currentUser?.firstName} {currentUser?.lastName} (Admin)
        </p>
      </div>

      <div className="employee-list-container">
        {employeeList.length === 0 ? (
          <div className="no-employees-message">No employees found.</div>
        ) : (
          employeeList.map((employee, index) => (
            <div
              key={employee._id}
              className="employee-item"
              onClick={() =>
                alert(
                  `Showing details for ${employee.firstName} ${employee.lastName}`
                )
              }
            >
              <div className="employee-name">
                {employee.firstName} {employee.lastName}
              </div>
              <div className="employee-type">{employee.role}</div>
              <div
                className="employee-wage"
                onClick={(e) => {
                  e.stopPropagation();
                  changeWage(index);
                }}
              >
                $<span className="wage-amount">{employee.hourlyWage}</span>/hr
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AdminPayrollSettings;
