// src/components/AdminEmployeeList.jsx
import React, { useState } from 'react';

const AdminEmployeeList = () => {
    const [employeeList, setEmployeeList] = useState([
        { name: 'Rick H.', employeeType: 'Mechanic' },
        { name: 'Codey H.', employeeType: 'Mechanic' },
    ]);

    // removes widget when called
    // will remove date in future
    const handleCancel = (index, e) => {
        e.stopPropagation();
        const newEmployees = [...employeeList];
        newEmployees.splice(index, 1);
        setEmployeeList(newEmployees);
    };

    return (
        <div className="content-section">
            <h1 className="page-title">Employee List</h1>
            <div className="employee-list-container">
                {employeeList.length === 0 ? (
                    <div className="no-employees-message">No employees found.</div>
                ) : (
                    employeeList.map((employee, index) => (
                        <div
                            key={index}
                            className="employee-item"
                            onClick={() => alert(`Showing details for ${employee.name}: ${employee.employeeType}`)}
                        >
                            <div className="employee-name">{employee.name}</div>
                            <div className="employee-type">{employee.employeeType}</div>
                            <div className="employee-remove">
                                <button onClick={(e) => handleCancel(index, e)}>Remove</button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminEmployeeList;