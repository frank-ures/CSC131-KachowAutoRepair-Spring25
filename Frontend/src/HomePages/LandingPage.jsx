// src/HomePages/LandingPage/LandingPage.jsx
import React from 'react';
import HomeLayout from '../components/HomeLayout';
import homePageBkgImg from '../images/home-page-bkg-img.jpg';
import BlackBox from '../components/BlackBox';
import ScheduleAppointmentButton from "../components/ScheduleAppointmentButton";
import theOwner from '../images/the-owner.png';
import HomeCustomerReview from '../components/homeCustomerReview';
import customer1 from '../images/customer1.png';
import customer2 from '../images/customer2.png';
import customer3 from '../images/customer3.png';
import PhoneNumberAndAddress from "../components/PhoneNumberAndAddress";
import ContactUsBox from '../components/ContactUsBox';
import Footer from '../components/Footer';

const LandingPage = () => {
    return (
        <HomeLayout bgImage={homePageBkgImg}>
            <ScheduleAppointmentButton />
            <BlackBox>
                <div style={{ height: '280px' }}></div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '70px' }}>
                    <img src={theOwner} alt="Owner" className="owner-image" />
                    <div>
                        <h1>Meet The Owner</h1>
                        <p>
                            Hey, I’m Rick Harrison, and this is Kachow Automotive Repair.
                            You need routine maintenance, diagnostics, or just want your car running like new?
                            You’re in the right place. Our certified mechanics know their stuff and won’t waste your time or your money.
                            With our easy online booking and real-time updates, car trouble’s got nothing on us.
                            So stop stressing, schedule your appointment today, and let’s get your ride back on the road!
                        </p>
                    </div>
                </div>
                <div style={{ height: '150px' }}></div>

                <div style={{ margin: 'auto', textAlign: 'center' }}>
                    <h1>Hear What Our Clients have to say</h1>
                </div>
                <div style={{ height: '100px' }}></div>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px'}}>
                    <HomeCustomerReview
                        imgSrc={customer1}
                        reviewText="Brought my car in for a brake repair, and the team at Kachow Automotive Repair was fast and professional. Definitely coming back!"
                        reviewerName="John M."
                    />
                    <HomeCustomerReview
                        imgSrc={customer2}
                        reviewText="Super easy to book an appointment online and get real-time updates on my car’s status. The mechanics were friendly and got my oil change done in no time. Highly recommend!"
                        reviewerName="Sarah L."
                    />
                    <HomeCustomerReview
                        imgSrc={customer3}
                        reviewText="Had a weird noise coming from my engine, and these guys figured it out quick. Honest pricing and great service, felt like I could really trust them. 10/10 would recommend."
                        reviewerName="Mike T."
                    />
                </div>
                <div style={{ height: '150px' }}></div>
                <PhoneNumberAndAddress/>
                <div style={{ height: '50px' }}></div>
                <ContactUsBox/>
                <Footer/>
            </BlackBox>
        </HomeLayout>
    );
};

export default LandingPage;