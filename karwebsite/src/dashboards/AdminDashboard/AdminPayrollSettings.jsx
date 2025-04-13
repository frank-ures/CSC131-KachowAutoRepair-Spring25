import React, { useEffect, useState } from 'react';

const AdminPayrollSettings =  () => {
    const [employeeList, setEmployeeList] = useState([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('/api/employees');
                if (!response.ok) {
                    throw new Error('Failed to fetch employee list');
                }
                const data = await response.json();
                setEmployeeList(data);
            } catch (error) {
                console.error(error);
                alert('Error fetching employee list.')
            }
        };
        fetchEmployees();
    }, []);

    // function to change wage if clicked on, should update in database later
    const changeWage = async (employeeIndex) => {
        const defaultValue = employeeList[employeeIndex].hourlyWage;
        const input = prompt('Enter New Wage:', defaultValue);
    
        if (input !== null) {
            const parsedWage = parseFloat(input);
            if (!isNaN(parsedWage) && parsedWage >= 0) {
                const updatedEmployee = {
                    ...employeeList[employeeIndex],
                    hourlyWage: parsedWage,
                };
    
                try {
                    const response = await fetch(`/api/employee/${updatedEmployee._id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ hourlyWage: updatedEmployee.hourlyWage }),
                    });
    
                    if (!response.ok) {
                        throw new Error('Failed to update employee wage.');
                    }
    
                    // Update state only if request is successful
                    setEmployeeList((prevList) => {
                        const newList = [...prevList];
                        newList[employeeIndex] = updatedEmployee;
                        return newList;
                    });
                } catch (error) {
                    console.error(error);
                    alert('Failed to update wage in the database.');
                }
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
                            key={employee._id}
                            className="employee-item"
                            onClick={() =>
                                alert(`Showing details for ${employee.firstName}: ${employee.lastName}`)
                            }
                        >
                            <div className="employee-name">{employee.firstName} {employee.lastName}</div>
                            <div className="employee-type">{employee.role}</div>
                            <div className="employee-wage" onClick={(e) => {
                                e.stopPropagation();
                                changeWage(index);
                            }}>
                                $
                                <span className="wage-amount">{employee.hourlyWage}</span>
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