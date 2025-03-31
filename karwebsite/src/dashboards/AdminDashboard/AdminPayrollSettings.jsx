import React, { useState } from 'react';

const AdminPayrollSettings = () => {
    const [employeeList, setEmployeeList] = useState([
        { name: 'Rick H.', employeeType: 'Mechanic', currentWage: 35 },
        { name: 'Codey H.', employeeType: 'Mechanic', currentWage: 33 },
    ]);

    // function to change wage if clicked on, should update in database later
    const changeWage = (employeeIndex) => {
        const defaultValue = employeeList[employeeIndex].currentWage;
        const input = prompt('Enter New Wage:', defaultValue);

        if (input !== null) {
            const parsedWage = parseFloat(input);
            if (!isNaN(parsedWage) && parsedWage >= 0) {
                setEmployeeList((prevList) => {
                    const newList = [...prevList];
                    newList[employeeIndex] = {
                        ...newList[employeeIndex],
                        currentWage: parsedWage,
                    };
                    return newList;
                });
            } else {
                alert('Invalid wage!');
            }
        }
    };

    return (
        <div className="content-section">
            <h1 className="page-title">Payroll Settings</h1>
            <div className="employee-list-container">
                {employeeList.length === 0 ? (
                    <div className="no-employees-message">No employees found.</div>
                ) : (
                    employeeList.map((employee, index) => (
                        <div
                            key={index}
                            className="employee-item"
                            onClick={() =>
                                alert(`Showing details for ${employee.name}: ${employee.employeeType}`)
                            }
                        >
                            <div className="employee-name">{employee.name}</div>
                            <div className="employee-type">{employee.employeeType}</div>
                            <div className="employee-wage" onClick={(e) => {
                                e.stopPropagation();
                                changeWage(index);
                            }}>
                                $
                                <span className="wage-amount">{employee.currentWage}</span>
                                /hr
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default AdminPayrollSettings;