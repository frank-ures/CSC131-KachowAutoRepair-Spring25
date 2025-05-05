// src/HomePages/ServicesPage/ServicesPage.jsx
import React, { useEffect, useState, useRef } from "react";
import HomeLayout from "../components/HomeLayout";
import ServicePageBkgImg from "../images/service-page-bkg-img.jpg";
import BlackBox from "../components/BlackBox";
import ScheduleAppointmentButton from "../components/ScheduleAppointmentButton";
import BlackBoxHeader from "../components/BlackBoxHeader";
import ContactUsBox from "../components/ContactUsBox";
import Footer from "../components/Footer";
import PhoneNumberAndAddress from "../components/PhoneNumberAndAddress";

const ServicesPage = () => {
  const [serviceList, setServiceList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setIsLoading(true);
      setError("");
      // Use the authFetch helper
      const response = await fetch("http://localhost:5999/api/appointment-types");
      if (!response.ok) {
        throw new Error("Failed to fetch services list");
      }
      const data = await response.json();
      setServiceList(data);
    } catch (error) {
      console.error(error);
      setError("Error fetching services list");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <HomeLayout bgImage={ServicePageBkgImg}>
      <BlackBoxHeader>Services</BlackBoxHeader>
      <BlackBox>
        {/* <div style={{ height: "280px" }}></div> */}
        {isLoading && <div className="loading">Loading Services...</div>}
        {error && <div className="error-message">{error}</div>}

        <div className="services-list-container">
          {serviceList.length === 0 && !isLoading ? (
            <div className="no-employees-message"> </div>
          ) : (
            serviceList.map((service, index) => (
                <div key={ service._id || index } className="service-item">
                    <h1>{ service.name }</h1>
                    <p>Description: { service.description }</p>
                    <p>Projected Time: { service.timeMin } – { service.timeMax } minutes</p>
                    <p>Price: ${ service.priceMin } – ${ service.priceMax }</p>
                </div>
                
            ))
          )}
        </div>

        <div style={{ height: "150px" }}></div>
        <PhoneNumberAndAddress/>
        <div style={{ height: "50px" }}></div>
        <ContactUsBox />
        <Footer />
      </BlackBox>
    </HomeLayout>
  );
};

export default ServicesPage;
