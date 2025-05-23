// src/HomePages/AboutUsPage/AboutUsPage.jsx
import React from 'react';
import HomeLayout from '../components/HomeLayout';
import AboutUsPageBkgImg from '../images/aboutus-page-bkg-img.jpg';
import BlackBox from '../components/BlackBox';
import ScheduleAppointmentButton from "../components/ScheduleAppointmentButton";
import BlackBoxHeader from "../components/BlackBoxHeader";
import TheBoysImg from '../images/the-boys.png';
import HandsImg from '../images/hands.png';
import RickImg from '../images/Rick.png';
import CodeyImg from '../images/Codey.png';
import AustinImg from '../images/Austin.png';
import RichardImg from '../images/Richard.png';
import WadeImg from '../images/Wade.png';
import RobertImg from '../images/Robert.png';
import AboutUsBox from "../components/AboutUsBox";
import PhoneNumberAndAddress from "../components/PhoneNumberAndAddress";
import ContactUsBox from '../components/ContactUsBox';
import Footer from '../components/Footer';

const AboutUsPage = () => {
    return (
        <HomeLayout bgImage={AboutUsPageBkgImg}>
            <BlackBoxHeader>
                About Us
            </BlackBoxHeader>
            <BlackBox>
                <div style={{padding: '100px'}}>
                <h1>Welcome To Kachow Auto Repair (Kar)!</h1>
                <p>
                    At Kachow Automotive Repair (KAR), we pride ourselves on delivering fast, reliable,
                    and professional automotive services. With a team of experienced mechanics and a focus
                    on customer satisfaction, our goal is to keep your vehicle running smoothly and safely.
                    Whether it's routine maintenance, diagnostics, or complex repairs, you can count on us
                    to get the job done right.
                </p>
                    <img
                        src={TheBoysImg}
                        alt="The Boys"
                        style={{
                            display: 'block',
                            margin: '40px auto',      // vertical margin + auto horizontal centering
                            width: '100%',
                            height: 'auto',
                        }}
                    />
                <h1>Our Mission</h1>
                <p>
                    Our mission at KAR is to provide exceptional automotive repair services
                    with a focus on transparency, efficiency, and trust. We strive to make
                    auto repairs simple and stress-free, ensuring that every customer leaves
                    our shop fully satisfied and confident in the service they received.
                </p>

                <h1>Our Story</h1>
                <p>
                    Kachow Automotive Repair was founded with a passion for cars and a commitment
                    to delivering honest, high-quality repair services. Over the years, we have
                    built a reputation for excellence by combining state-of-the-art diagnostic tools
                    with a customer-first approach. Located conveniently in Sacramento, California,
                    our team is dedicated to providing the best service experience possible.
                </p>
                    <img
                        src={HandsImg}
                        alt="Hands"
                        style={{
                            display: 'block',
                            margin: '40px auto',
                            width: '100%',
                            height: 'auto',
                        }}
                    />
                <h1>Meet Our Team</h1>
                <p>
                    Our team is made up of certified mechanics and service advisors who bring
                    years of experience and a passion for automotive repair. We believe in continuous
                    learning and regularly update our skills to stay ahead of industry trends. When
                    you bring your vehicle to KAR, you can trust that it will be handled by knowledgeable
                    and caring professionals.
                </p>
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'center',
                        gap: '20px',
                        paddingTop: '45px'
                    }}>
                        <AboutUsBox imgSrc={RickImg} name="Rick Harrison" />
                        <AboutUsBox imgSrc={CodeyImg} name="Codey Harrison" />
                        <AboutUsBox imgSrc={AustinImg} name="Austin Russel" />
                        <AboutUsBox imgSrc={RichardImg} name="Richard Benjamin" />
                        <AboutUsBox imgSrc={WadeImg} name="Wade Warren" />
                        <AboutUsBox imgSrc={RobertImg} name="Robert Fox" />
                    </div>

                <h1>Why Choose Us? </h1>
                <p> •	Expert Mechanics: Highly trained and certified professionals.</p>
                <p> •	Transparent Pricing: Clear and honest estimates with no surprises.</p>
                <p> •	Customer-Centric Service: Friendly and personalized approach.</p>
                <p> •	Advanced Technology: Modern diagnostic tools for accurate results.</p>

                <h1>Our Location</h1>
                <p> Kachow Automotive Repair (KAR) </p>
                <p> 6000 J Street, </p>
                <p> Sacramento, CA, 95819, </p>
                <p> United States</p>
                </div>
                <PhoneNumberAndAddress/>
                <div style={{ height: '50px' }}></div>
                <ContactUsBox/>
                <Footer/>
            </BlackBox>
        </HomeLayout>
        
    );
};

export default AboutUsPage;