import React from 'react';
import HomeLayout from '../components/HomeLayout';
import Footer from '../components/Footer';

const TermsOfService = () => {
  const yellowColor = '#FFD700'; 

  return (
    <HomeLayout>
      <div
        style={{
          padding: '50px',
          textAlign: 'center', 
          marginTop: '50px', 
          color: 'white', 
        }}
      >
        <h1 style={{ color: yellowColor, fontSize: 'px' }}>Terms of Service</h1>
        <p style={{ fontSize: '24px' }}>
          Welcome to our Terms of Service page. By using our website and services, you agree to the following terms and conditions.
        </p>
        <h2 style={{ color: yellowColor, fontSize: '36px' }}>Use of Services</h2>
        <p style={{ fontSize: '24px' }}>
          Our services are provided for personal use only. You agree not to misuse our services or violate any applicable laws.
        </p>
        <h2 style={{ color: yellowColor, fontSize: '36px' }}>Limitation of Liability</h2>
        <p style={{ fontSize: '24px' }}>
          We are not responsible for any damages or losses resulting from the use of our services, except as required by law.
        </p>
        <h2 style={{ color: yellowColor, fontSize: '36px' }}>Contact Us</h2>
        <p style={{ fontSize: '24px' }}>
          If you have any questions about our Terms of Service, please contact us at KACHOWAUTOREPAIR@gmail.com.
        </p>
      </div>
      <Footer />
    </HomeLayout>
  );
};

export default TermsOfService;