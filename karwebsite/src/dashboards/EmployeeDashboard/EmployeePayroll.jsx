// src/dashboards/EmployeeDashboard/EmployeePayroll.jsx
import React, { useState, useEffect } from "react";
import "../../components/Payroll.css";
import { useAuth } from "../../context/AuthContext";

const EmployeePayroll = () => {
  // Get auth context to access the current user and auth fetch
  const { currentUser, authFetch } = useAuth();

  // State for payroll data
  const [payrollData, setPayrollData] = useState({
    payPeriod: "MAR 17 - MAR 30",
    hoursWorked: 60,
    totalHours: 70,
    currentWage: 33,
    tasksCompleted: 24,
    totalTasks: 28,
  });

  // Calculate estimated wages
  const estimatedWages = payrollData.hoursWorked * payrollData.currentWage;

  // Calculate progress ring values (using r=90)
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const completionRatio = payrollData.tasksCompleted / payrollData.totalTasks;
  const offset = circumference - completionRatio * circumference;
  const ringPercentage = Math.round(completionRatio * 100);

  useEffect(() => {
    // fetch data later from Express API?
  }, []);

  return (
    // inline css, replace later with sep file or integrate with app.css
    <div className="content-section">
      <h1 className="page-title">Payroll</h1>
      <div className="payroll-widget">
        <div
          className="payroll-date"
          onClick={() => alert("Implement pay period change here!")}
        >
          {payrollData.payPeriod}
        </div>
        <div className="payroll-content">
          <div className="payroll-ring-container">
            <svg className="progress-ring" width="200" height="200">
              <circle
                className="progress-ring__background"
                stroke="#ccc"
                strokeWidth="10"
                fill="transparent"
                r="90"
                cx="100"
                cy="100"
              />
              <circle
                className="progress-ring__progress"
                stroke="#DE1E29"
                strokeWidth="10"
                fill="transparent"
                r="90"
                cx="100"
                cy="100"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
              />
            </svg>
            <div className="ring-text">{ringPercentage}%</div>
          </div>
          <div className="payroll-data-container">
            <div className="payroll-data-line">
              <div className="payroll-data-label">ESTIMATED WAGES</div>
              <div className="payroll-data-value">
                ${estimatedWages.toFixed(2)}
              </div>
            </div>
            <div className="payroll-data-line">
              <div className="payroll-data-label">TASKS COMPLETED</div>
              <div className="payroll-data-value">
                {payrollData.tasksCompleted} of {payrollData.totalTasks}
              </div>
            </div>
            <div className="payroll-data-line">
              <div className="payroll-data-label">HOURS WORKED</div>
              <div className="payroll-data-value">
                {payrollData.hoursWorked} of {payrollData.totalHours}
              </div>
            </div>
            <div className="payroll-data-line">
              <div className="payroll-data-label">CURRENT WAGE</div>
              <div className="payroll-data-value">
                ${payrollData.currentWage}/hr
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePayroll;
