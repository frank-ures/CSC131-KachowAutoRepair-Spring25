import React, { useState, useEffect } from "react";
import "../../components/Payroll.css";
import { useAuth } from "../../context/AuthContext";

const EmployeePayroll = () => {
  // Get auth context to access the current user and auth fetch
  const { currentUser, authFetch } = useAuth();

  // State for date range selection
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // State for payroll data, updated dynamically
  const [payrollData, setPayrollData] = useState({
    payPeriod: "",
    hoursWorked: 0,
    totalHours: 0,
    currentWage: 0,
    tasksCompleted: 0,
    totalTasks: 0,
    estimatedWages: 0
  });

  // Calculate progress ring values (using r=90)
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const completionRatio = payrollData.totalTasks > 0 
    ? payrollData.tasksCompleted / payrollData.totalTasks 
    : 0;
  const offset = circumference - completionRatio * circumference;
  const ringPercentage = Math.round(completionRatio * 100);

  // Function to fetch shifts by date range
  const fetchShiftsByDateRange = async (startDate, endDate) => {
    try {
      const formattedStart = new Date(startDate).toISOString();
      const formattedEnd = new Date(endDate).toISOString();
      // Use authFetch from context
      const response = await authFetch(`/shifts/range?startDate=${formattedStart}&endDate=${formattedEnd}`);
      if (!response.ok) {
        throw new Error("Failed to fetch shifts");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      return [];
    }
  };

  // Function to fetch task completion data
  const fetchTasksSummary = async (startDate, endDate) => {
    try {
      const formattedStart = new Date(startDate).toISOString();
      const formattedEnd = new Date(endDate).toISOString();
      const response = await authFetch(`appointments/tasks-summary?startDate=${formattedStart}&endDate=${formattedEnd}`);
      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to fetch task summary");
      }
      return await response.json();
    } catch (error) {
      console.error("Error fetching task summary:", error);
      return { completedTasks: 0, totalTasks: 0 };
    }
  };

  // Handler function for the Calculate Payroll button
  const handleFetchPayroll = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    
    setIsLoading(true);
    try {
      // Fetch shifts and task data
      const [shifts, taskSummary] = await Promise.all([
        fetchShiftsByDateRange(startDate, endDate),
        fetchTasksSummary(startDate, endDate)
      ]);
      
      console.log('Fetched shifts:', shifts);
      console.log('Fetched task summary:', taskSummary);
      
      // Process shifts data to update payroll
      let totalHours = 0;
      let totalWages = 0;
      
      if (shifts.length > 0) {
        shifts.forEach(shift => {
          // Calculate hours for this shift
          const start = new Date(shift.startTime);
          const end = new Date(shift.endTime);
          const hoursForShift = (end - start) / (1000 * 60 * 60);
          
          // Add to total hours
          totalHours += hoursForShift;
          
          // Calculate wages for this shift using the shift's specific wage
          const wageForShift = shift.wageThisShift * hoursForShift;
          totalWages += wageForShift;
        });
      }
      
      // Update payroll data with all the calculated values
      setPayrollData({
        payPeriod: `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`,
        hoursWorked: totalHours.toFixed(1),
        totalHours: totalHours.toFixed(1),
        currentWage: currentUser?.hourlyWage || 0,
        tasksCompleted: taskSummary.completedTasks || 0,
        totalTasks: taskSummary.totalTasks || 0,
        estimatedWages: totalWages
      });
      
    } catch (error) {
      console.error('Error calculating payroll:', error);
      alert('Error calculating payroll. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Update currentWage when currentUser changes
  useEffect(() => {
    if (currentUser && currentUser.hourlyWage !== undefined) {
      setPayrollData(prev => ({
        ...prev,
        currentWage: currentUser.hourlyWage
      }));
    }
  }, [currentUser]);

  return (
    <div className="content-section">
      <h1 className="page-title">Payroll</h1>
      <div className="payroll-widget">
        <div className="payroll-date">
          <input 
            type="date" 
            id="payrollStartDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          /> - 
          <input 
            type="date" 
            id="payrollEndDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
          <button 
            className="fetch-shifts-btn"
            onClick={handleFetchPayroll}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : 'Submit'}
          </button>
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
                ${payrollData.estimatedWages.toFixed(2)}
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
                {payrollData.hoursWorked}
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