import React, { useState } from 'react';
import axiosInstance from "../../core/axiosConfig";

const ContactForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = { name, email, message }; 
    try {
      const response = await axiosInstance.post('http://localhost:8080/api/v1/contacts', data);
      alert('Message sent successfully!');
      setName('');
      setEmail('');
      setMessage('');
    } catch (error) {
      alert('Failed to send message: ' + error.message);
    }
  };

  return (
    <div className="contact-form" style={{ padding: '20px' ,width:'100%'}}>
      
        <h4 style={{ color: ' rgba(0, 0, 0, 0.52)',backgroundColor:"white",marginLeft:"33%" }}><strong>ENVOYEZ MESSAGE </strong></h4>
        <br/>
        <br/>
      <form onSubmit={handleSubmit}>
        <label style={{ color: '#607AD6',marginRight: '90%' }}>Nom :</label>
        <input type="text" value={name} onChange={e => setName(e.target.value)} /><br/>
        <label style={{ color: '#607AD6',marginRight: '90%' }}>Email :</label>
        <input type="email" value={email} onChange={e => setEmail(e.target.value)} /><br/>
        <label style={{ color: '#607AD6',marginRight: '87%' }}>Message :</label>
        <textarea value={message} onChange={e => setMessage(e.target.value)} /><br/>
        <button type="submit" >Envoyez</button>
      </form>
    </div>
  );
};

export default ContactForm;
