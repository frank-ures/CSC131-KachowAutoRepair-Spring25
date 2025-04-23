// src/HomePages/ServicesPage/ServicesPage.jsx
import React from 'react';
import HomeLayout from '../../components/HomeLayout';
import ServicePageBkgImg from '../../components/service-page-bkg-img.png';
import BlackBox from '../../components/BlackBox';
import ScheduleAppointmentButton from "../../components/ScheduleAppointmentButton";
import BlackBoxHeader from "../../components/BlackBoxHeader";
import ContactUsBox from '../../components/ContactUsBox';

const ServicesPage = () => {
    return (
        <HomeLayout bgImage={ServicePageBkgImg}>
            <BlackBoxHeader>
                Services
            </BlackBoxHeader>
            <BlackBox>
                <div style={{ height: '280px' }}></div>
                <div className="service-item">
                    <h1>Brake Repair and Replacement</h1>
                    <p><strong>Description:</strong> Inspect brake pads, rotors, and brake fluid. Replace pads if needed.</p>
                    <p><strong>Projected Time:</strong> 60–90 minutes</p>
                    <p><strong>Price:</strong> $150–$250 per axle</p>
                </div>
                <hr />
                <div className="service-item">
                    <h1>Tire Rotating and Balancing</h1>
                    <p><strong>Description:</strong> Rotate tires for even wear and balance for smooth driving.</p>
                    <p><strong>Projected Time:</strong> 30–45 minutes</p>
                    <p><strong>Price:</strong> $30–$50</p>
                </div>
                <hr />
                <div className="service-item">
                    <h1>Battery Replacement</h1>
                    <p><strong>Description:</strong> Test and replace battery, clean terminals if necessary.</p>
                    <p><strong>Projected Time:</strong> 20–30 minutes</p>
                    <p><strong>Price:</strong> $90–$150 (including battery)</p>
                </div>
                <hr />
                <div className="service-item">
                    <h1>Wheel Alignment</h1>
                    <p><strong>Description:</strong> Adjust wheel angles for proper contact and reduce tire wear.</p>
                    <p><strong>Projected Time:</strong> 60–75 minutes</p>
                    <p><strong>Price:</strong> $80–$120</p>
                </div>
                <hr />
                <div className="service-item">
                    <h1>Engine Diagnostics</h1>
                    <p><strong>Description:</strong> Use advanced diagnostic tools to identify and fix engine issues.</p>
                    <p><strong>Projected Time:</strong> 30–60 minutes</p>
                    <p><strong>Price:</strong> $70–$100 (diagnostic fee)</p>
                </div>
                <hr />
                <div className="service-item">
                    <h1>Transmission Service</h1>
                    <p><strong>Description:</strong> Replace transmission fluid, filter, and inspect for leaks.</p>
                    <p><strong>Projected Time:</strong> 90–120 minutes</p>
                    <p><strong>Price:</strong> $150–$250</p>
                </div>
                <hr />
                <div className="service-item">
                    <h1>Air Conditioning Service</h1>
                    <p><strong>Description:</strong> Inspect and recharge A/C system, check for leaks.</p>
                    <p><strong>Projected Time:</strong> 60–90 minutes</p>
                    <p><strong>Price:</strong> $120–$180</p>
                </div>
                <hr />
                <div className="service-item">
                    <h1>Spark Plug Replacement</h1>
                    <p><strong>Description:</strong> Replace spark plugs for better ignition and fuel efficiency.</p>
                    <p><strong>Projected Time:</strong> 45–60 minutes</p>
                    <p><strong>Price:</strong> $80–$150 (varies by vehicle)</p>
                </div>
                <hr />
                <div className="service-item">
                    <h1>Brake Repair and Replacement</h1>
                    <p><strong>Description:</strong> Inspect and repair shocks, struts, and steering components.</p>
                    <p><strong>Projected Time:</strong> 90–180 minutes</p>
                    <p><strong>Price:</strong> $200–$400</p>
                </div>
                <hr />
                <div className="service-item">
                    <h1>Suspension and Steering Repair</h1>
                    <p><strong>Description:</strong> Replace old coolant, flush the system, and check hoses.</p>
                    <p><strong>Projected Time:</strong> 45–60 minutes</p>
                    <p><strong>Price:</strong> $80–$120</p>
                </div>
                <hr />
                <div className="service-item">
                    <h1>Coolant System Flush</h1>
                    <p><strong>Description:</strong> Inspect and repair mufflers, pipes, and catalytic converters.</p>
                    <p><strong>Projected Time:</strong> 60–120 minutes</p>
                    <p><strong>Price:</strong> $150–$300</p>
                </div>
                <hr />
                <div className="service-item">
                    <h1>Headlight Restoration</h1>
                    <p><strong>Description:</strong> Clean and restore clarity to foggy or yellowed headlights.</p>
                    <p><strong>Projected Time:</strong> 30–45 minutes</p>
                    <p><strong>Price:</strong> $40–$70</p>
                </div>
                <hr />
                <div className="service-item">
                    <h1>Cabin and Engine Air Filter Replacement</h1>
                    <p><strong>Description:</strong> Replace air filters to improve air quality and engine performance.</p>
                    <p><strong>Projected Time:</strong> 15–30 minutes</p>
                    <p><strong>Price:</strong> $30–$50 per filter</p>
                </div>
                <hr />
                <div className="service-item">
                    <h1>Pre-Purchase Vehicle Inspection</h1>
                    <p><strong>Description:</strong> Comprehensive inspection for buyers to assess a vehicle’s condition.</p>
                    <p><strong>Projected Time:</strong> 60–90 minutes</p>
                    <p><strong>Price:</strong> $100–$150</p>
                </div>
                <div style={{ height: '150px' }}></div>
                <div style={{ margin: 'auto', textAlign: 'center', fontSize: '3rem', whiteSpace: 'pre' }}>
                    (916) 278-6011                                                                 6000 J Street, Sacramento, CA, 95819, United States
                </div>

                <div style={{ height: '150px' }}></div>
                <ContactUsBox/>
            </BlackBox>
        </HomeLayout>
    );
};

export default ServicesPage;