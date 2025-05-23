// src/components/Errors/Forbidden.js
import React from 'react';
import { Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useKeycloak } from './KeycloakContext';
const Forbidden = () => {
    const navigate = useNavigate();
    const { logout } = useKeycloak();
   

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1 style={{ fontSize: '3em', color: '#607AD6' }}>403 - Accès Refusé</h1>
            <p style={{ fontSize: '1.5em', color: '#555' }}>Vous n'avez pas la permission d'accéder à cette page.</p>
            <Button type="primary" onClick={logout} style={{ backgroundColor: '#607AD6' }}>
                Retour à l'accueil
            </Button>
        </div>
    );
};

export default Forbidden;
