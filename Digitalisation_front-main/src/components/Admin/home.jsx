import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CarOutlined, DiffOutlined, ContainerOutlined, PicCenterOutlined, DollarOutlined, AppstoreOutlined } from '@ant-design/icons';
import './home.css';

const Home = () => {
  const navigate = useNavigate(); 

  const tiles = [
    { label:  (
      <div className="company-section"> 
      <div className="company-info">
        <PicCenterOutlined className="tile-icon" />
      </div>
      <div className="company-text">
        <span>Compagnie</span>
      </div>
        <div className="category-list" style={{ fontSize: '10px' }}>
          Compagnies - Courtiers - Agences - Contacts - Comptes
        </div>
      </div>
    ), className: 'compagnie', route: '/admin/compagnies' },
    { label: 'Abonnement', icon: <DollarOutlined className="tile-icon" />, className: 'abonnement', route: '/admin/Abonnements' },
    { label: 'Prepaiement', icon: <DiffOutlined className="tile-icon" />, className: 'prepaiement', route: '/admin/solde' },
    { label: (
      <div className="company-section">
      <div className="company-info">
        <CarOutlined className="tile-icon" />
      </div>
      <div className="company-text">
        <span>Attestation</span>
      </div>
        <div className="category-list" style={{ fontSize: '10px' }}>
          Attestations -Type Attestation - Vehicules- Modele Vehicule
        </div>
      </div>
    ), className: 'vehicule', route: '/admin/Vehicule' },
    { label: 'Facture', icon: <ContainerOutlined className="tile-icon" />, className: 'facture', route: '/admin/Facture' },
    { label:  (
      <div className="company-section">
      <div className="company-info">
        <AppstoreOutlined className="tile-icon" />
      </div>
      <div className="company-text">
        <span>Parametrage</span>
      </div>
        <div className="category-list" style={{ fontSize: '10px' }}>
          Statuts(Abonnement/Courtier)-Types-Fonction
        </div>
      </div>
    ), className: 'table_reference', route: '/admin/fonction' },
  ];

  return (
    <>
    <h1 style={{marginTop:"2%",marginLeft:"24%",color:'red'}}>Gestion digitalisée des attestations automobiles</h1>
    <br/>
    <div className="home-container">
   
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

export default Home;
