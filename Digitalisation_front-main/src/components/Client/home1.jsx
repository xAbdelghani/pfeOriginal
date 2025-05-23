import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CarOutlined, ContactsOutlined, ContainerOutlined, UserOutlined, DollarOutlined, AppstoreOutlined,PhoneOutlined,DiffOutlined } from '@ant-design/icons';
import './home1.css';

const Home1 = () => {
  const navigate = useNavigate();

  const tiles = [
    { label:  (
      <div className="company-section"> 
      <div className="company-info">
        <UserOutlined className="tile-icon" />
      </div>
      <div className="company-text">
        <span>Profil</span>
      </div>
        
      </div>
    ), className: 'compagnie', route: '/client/Profil' },
    { label: 'Mes abonnements', icon: <DollarOutlined className="tile-icon" />, className: 'abonnement', route: '/admin/Abonnements' },
    { label: 'Mes Prepaiements', icon: <DiffOutlined className="tile-icon" />, className: 'prepaiement', route: '/client/prepaiement' },
    { label: (
      <div className="company-section">
      <div className="company-info">
        <CarOutlined className="tile-icon" />
      </div>
      <div className="company-text">
        <span>Attestations Disponibles</span>
      </div>
       
      </div>
    ), className: 'vehicule', route: '/admin/Vehicule' },
   
    { label: 'Mes factures', icon: <ContainerOutlined className="tile-icon" />, className: 'facture', route: '/admin/Facture' },
    { label: 'Mes Contacts', icon: <ContactsOutlined className="tile-icon" />, className: 'contact', route: '/client/Contact' },
    { label: 'Contactez-vous', icon: <PhoneOutlined className="tile-icon" />, className: 'contactez', route: '/client/Contact' },
    
    { label:  (
      <div className="company-section">
      <div className="company-info">
        <AppstoreOutlined className="tile-icon" />
      </div>
      <div className="company-text">
        <span>Dashbord </span>
      </div>
       
      </div>
    ), className: 'table_reference', route: '/client/compagnies' },
  ];

  return (
    <>
    <h1 style={{marginTop:"2%",marginLeft:"24%",color:'red'}}>Gestion digitalisée des attestations automobiles</h1>
    <br/>
    <div className="home-containere">
   
      {tiles.map((tile, index) => (
        <div
          key={index}
          className={`tile ${tile.className}`}
          onClick={() => navigate(tile.route)}
        >
          {tile.icon}
          <div className="tile-label">{tile.label}</div>
        </div>
      ))}
         </div>
  </>
  );
};

export default Home1;
