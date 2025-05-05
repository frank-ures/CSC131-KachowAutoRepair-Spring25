// src/layouts/HomeLayout.jsx
import React from 'react';
import TopBar from '../components/TopBar';
import '../components_CSS/HomeLayout.css';

const HomeLayout = ({ bgImage, children }) => {
    return (
        <div className="home-layout" style={{ backgroundImage: `url(${bgImage})` }}>
            <TopBar />
            {children}
        </div>
    );
};

export default HomeLayout;