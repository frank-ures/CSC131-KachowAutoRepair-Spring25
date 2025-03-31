// src/dashboards/EmployeeDashboard/EmployeeSchedule.jsx
import React, { useState } from 'react';

const EmployeeSchedule = () => {
    const [scheduleTasks, setScheduleTasks] = useState([
        { name: 'Alice B.', service: 'Tire Rotation' },
        { name: 'Bob C.', service: 'Engine Diagnostics' },
    ]);

    const handleCancel = (index, e) => {
        e.stopPropagation();
        const newTasks = [...scheduleTasks];
        newTasks.splice(index, 1);
        setScheduleTasks(newTasks);
    };

    return (
        <div className="content-section">
            <h1 className="page-title">Today's Schedule</h1>
            <div className="schedule-container">
                {scheduleTasks.length === 0 ? (
                    <div className="no-tasks-message">No scheduled tasks found.</div>
                ) : (
                    scheduleTasks.map((task, index) => (
                        <div
                            key={index}
                            className="schedule-item"
                            onClick={() => alert(`Showing details for ${task.name}: ${task.service}`)}
                        >
                            <div className="schedule-name">{task.name}</div>
                            <div className="schedule-service">{task.service}</div>
                            <div className="schedule-cancel">
                                <button onClick={(e) => handleCancel(index, e)}>Cancel</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EmployeeSchedule;