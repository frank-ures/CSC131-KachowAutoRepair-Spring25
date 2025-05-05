// src/Dashboards/EmployeeDashboard/EmployeeWorkHistory.jsx
import React, { useState } from 'react';
import downloadIcon from '../../images/download-icon.png';

const EmployeeWorkHistory = () => {
    const [historyTasks] = useState([
        { name: 'Hannah H.', service: 'Brake Repair and Replacement' },
        { name: 'Finn T.', service: 'Air Conditioning Service' },
        { name: 'John G.', service: 'Oil Change' },
    ]);

    return (
        <div className="content-section">
            <h1 className="page-title">Work History</h1>
            <div className="work-history-container">
                {historyTasks.length === 0 ? (
                    <div className="no-tasks-message">No previous tasks found.</div>
                ) : (
                    historyTasks.map((task, index) => (
                        <div
                            key={index}
                            className="history-item"
                            onClick={() => alert(`Showing details for ${task.name}: ${task.service}`)}
                        >
                            <div className="history-name">{task.name}</div>
                            <div className="history-service">{task.service}</div>
                            <div className="history-download">
                                <img
                                    src={downloadIcon}
                                    alt="Download"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        alert(`Download details for ${task.name}'s ${task.service}`);
                                    }}
                                />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EmployeeWorkHistory;