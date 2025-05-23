import React from 'react';
import ContactInfo from "./ContactInfo";
import ContactForm from "./ContactForm";
import "./ContactPage.css";

const ContactPage = () => {
    return (
        <>
            <br/>
            <h2 style={{ color: '#607AD6',marginLeft:'45%' }}><strong>Contactez-nous</strong></h2>
            <div className="contact-page" style={{ display: 'flex',justifyContent:'space-between', borderRight: '2px solid #ccc', padding: '40px' }}>
          <br/>
                <ContactInfo />
                <ContactForm />
            </div>
        </>
    );
};

export default ContactPage;
