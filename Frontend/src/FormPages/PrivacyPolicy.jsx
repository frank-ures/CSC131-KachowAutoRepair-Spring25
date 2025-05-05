import React from 'react';
import HomeLayout from '../components/HomeLayout';
import Footer from '../components/Footer';

const PrivacyPolicy = () => {
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
        <h1 style={{ color: yellowColor, fontSize: '36px' }}>Privacy Policy</h1>
        <p style={{ fontSize: '24px' }}>
          Welcome to our Privacy Policy page. Here, we explain how we collect, use, and protect your personal data.
          Your privacy is important to us, and we are committed to safeguarding your information.
        </p>
        <h2 style={{ color: yellowColor, fontSize: '28px' }}>Information We Collect</h2>
        <p style={{ fontSize: '24px' }}>
          We may collect personal information such as your name, email address, phone number, and vehicle details
          when you use our services or contact us.
        </p>
        <h2 style={{ color: yellowColor, fontSize: '28px' }}>How We Use Your Information</h2>
        <p style={{ fontSize: '24px' }}>
          Your information is used to provide and improve our services, process appointments, and communicate with you.
        </p>
        <h2 style={{ color: yellowColor, fontSize: '28px' }}>Contact Us</h2>
        <p style={{ fontSize: '24px' }}>
          If you have any questions about our Privacy Policy, please contact us at KACHOWAUTOREPAIR@gmail.com.
        </p>
      </div>
      <Footer />
    </HomeLayout>
  );
};

export default PrivacyPolicy;