import React from 'react';
import './Footer.css';
import karLogo from './kar-logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-section about">
          <div className="footer-logo">
            <img src={karLogo} alt="Kachow Auto Repair Logo" />
            <h3>KACHOW AUTO REPAIR</h3>
          </div>
          <p>Professional auto repair services with a focus on quality, reliability, and customer satisfaction.</p>
        </div>
        
        <div className="footer-section links">
          <h3>QUICK LINKS</h3>
          <ul>
            <li><a href="/home">HOME</a></li>
            <li><a href="/services">SERVICES</a></li>
            <li><a href="/about">ABOUT US</a></li>
            <li><a href="/reviews">REVIEWS</a></li>
            <li><a href="/karwebsite/src/LoginPage/Login">LOGIN</a></li>
            <li><a href="/register">REGISTER</a></li>
          </ul>
        </div>
        
        <div className="footer-section contact">
          <h3>CONTACT US</h3>
          <address>
            <p><i className="icon location"></i> 6000 J Street, Sacramento, CA, 95819</p>
            <p><i className="icon phone"></i> (916) 278-6011</p>
            <p><i className="icon email"></i> KachowAutoRepair@gmail.com</p>
          </address>
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><i className="icon facebook"></i></a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><i className="icon twitter"></i></a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><i className="icon instagram"></i></a>
          </div>
        </div>
        
        <div className="footer-section hours">
          <h3>BUSINESS HOURS</h3>
          <ul className="hours-list">
            <li><span>Monday - Friday:</span> 8:00 AM - 6:00 PM</li>
            <li><span>Saturday - Sunday:</span> Closed</li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>© {currentYear} Kachow Auto Repair. All Rights Reserved.</p>
        <div className="footer-bottom-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;