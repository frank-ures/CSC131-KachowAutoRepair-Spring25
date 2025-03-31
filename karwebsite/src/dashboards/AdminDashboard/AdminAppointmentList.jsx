// src/dashboards/AdminDashboard/AdminAppointmentList.jsx
import React, { useState } from 'react';
import leftArrowIcon from '../../components/left-arrow-icon.png';
import rightArrowIcon from '../../components/right-arrow-icon.png';

const AdminAppointmentList = () => {
    // MM/DD/YY state
    const [day, setDay] = useState(3);
    const [month, setMonth] = useState(3);
    const [year, setYear] = useState(25);

    // Appointments keyed by "MM-DD-YY"
    // remove and fetch from server later
    const appointmentsByDate = {
        '03-03-25': [
            { name: 'Joe M.', type: 'Engine Diagnostics' },
            { name: 'Ko D.', type: 'Spark Plug Replacement' },
        ],
        '03-04-25': [
            { name: 'Mac M.', type: 'Tire Rotation' },
        ],
        '03-05-25': [
            { name: 'Jack G.', type: 'Oil Change' },
            { name: 'Bob D.', type: 'Brake Inspection' },
        ],
    };

    // Adds a leading zero if the number is under 10
    const formatNumber = (num) => (num < 10 ? `0${num}` : `${num}`);

    // Build an "MM-DD-YY" key
    const buildDateKey = (d, m, y) => {
        return `${formatNumber(m)}-${formatNumber(d)}-${formatNumber(y)}`;
    };

    // Current date key
    const currentDateKey = buildDateKey(day, month, year);

    // Get the relevant appointments for the current date (default to empty array if not found)
    const [appointments, setAppointments] = useState(() => {
        return appointmentsByDate[currentDateKey] || [];
    });

    // Whenever day/month/year changes, update appointments from dictionary
    const updateAppointmentsForNewDate = (newDay, newMonth, newYear) => {
        const newKey = buildDateKey(newDay, newMonth, newYear);
        setAppointments(appointmentsByDate[newKey] || []);
    };

    // Wrap updating day/month/year so we can also update appointments
    const setDayAndUpdate = (newDay) => {
        setDay(newDay);
        updateAppointmentsForNewDate(newDay, month, year);
    };
    const setMonthAndUpdate = (newMonth) => {
        setMonth(newMonth);
        updateAppointmentsForNewDate(day, newMonth, year);
    };
    const setYearAndUpdate = (newYear) => {
        setYear(newYear);
        updateAppointmentsForNewDate(day, month, newYear);
    };

    // Left/right arrow logic (simple day +/- 1)
    const handleDayBack = () => {
        if (day > 1) {
            setDayAndUpdate(day - 1);
        } else {
            // Example wrap-around logic for day
            setDayAndUpdate(31);
        }
    };

    const handleDayForward = () => {
        if (day < 31) {
            setDayAndUpdate(day + 1);
        } else {
            setDayAndUpdate(1);
        }
    };

    // Click handlers for day/month/year to prompt user input
    const handleDayClick = () => {
        const input = prompt('Enter day (1-31):', day);
        if (input !== null) {
            const newDay = parseInt(input, 10);
            if (!isNaN(newDay) && newDay >= 1 && newDay <= 31) {
                setDayAndUpdate(newDay);
            } else {
                alert('Invalid day!');
            }
        }
    };

    const handleMonthClick = () => {
        const input = prompt('Enter month (1-12):', month);
        if (input !== null) {
            const newMonth = parseInt(input, 10);
            if (!isNaN(newMonth) && newMonth >= 1 && newMonth <= 12) {
                setMonthAndUpdate(newMonth);
            } else {
                alert('Invalid month!');
            }
        }
    };

    const handleYearClick = () => {
        const input = prompt('Enter year (00-99):', year);
        if (input !== null) {
            const newYear = parseInt(input, 10);
            if (!isNaN(newYear) && newYear >= 0 && newYear <= 99) {
                setYearAndUpdate(newYear);
            } else {
                alert('Invalid year!');
            }
        }
    };

    // Cancel an appointment
    const handleCancel = (index, e) => {
        e.stopPropagation();
        const updated = [...appointments];
        updated.splice(index, 1);
        setAppointments(updated);
    };

    return (
        <div className="content-section">
            <h1 className="page-title">Appointment List</h1>
            {/* ADD TO APP.CSS or SEPARATE CSS FILE LATER */}
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '20px',
                    marginBottom: '20px',
                    backgroundColor: '#fff',
                    color: '#000',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    maxWidth: '350px',
                    margin: '0 auto 20px auto'
                }}
            >
                <img
                    src={leftArrowIcon}
                    alt="Previous Day"
                    style={{ width: '32px', height: '32px', cursor: 'pointer' }}
                    onClick={handleDayBack}
                />

                <div
                    style={{
                        fontSize: '36px',
                        display: 'flex',
                        gap: '10px',
                        cursor: 'pointer',
                        alignItems: 'center',
                        fontWeight: 'bold'
                    }}
                >
                    <span onClick={handleMonthClick}>{formatNumber(month)}</span>
                    <span onClick={handleDayClick}>{formatNumber(day)}</span>
                    <span onClick={handleYearClick}>{formatNumber(year)}</span>
                </div>

                <img
                    src={rightArrowIcon}
                    alt="Next Day"
                    style={{ width: '32px', height: '32px', cursor: 'pointer' }}
                    onClick={handleDayForward}
                />
            </div>

            {/* Scrollable container for appointments */}
            <div
                className="schedule-container"
                style={{ maxHeight: '400px', overflowY: 'auto', padding: '0 20px' }}
            >
                {appointments.length === 0 ? (
                    <div className="no-tasks-message">No appointments found.</div>
                ) : (
                    appointments.map((appt, index) => (
                        <div
                            key={index}
                            className="schedule-item"
                            onClick={() => alert(`Showing details for ${appt.name}: ${appt.type}`)}
                            style={{ marginBottom: '10px' }}
                        >
                            <div className="schedule-name">{appt.name}</div>
                            <div className="schedule-service">{appt.type}</div>
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

export default AdminAppointmentList;