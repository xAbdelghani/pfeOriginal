import { jwtDecode } from 'jwt-decode';
import Keycloak from 'keycloak-js';
import React, { createContext, useContext, useEffect, useState } from 'react';
const keycloakConfig = {
  url: 'http://localhost:8180',
  realm: 'Digitalisation',
  clientId: 'Digitalisation-attestation',
  clientSecret: 'c4xjxPfDXsX2OEsTQrwiCVoJNMq4KAjq',
};
const KeycloakContext = createContext(null);
export const KeycloakProvider = ({ children }) => {
  const [keycloak, setKeycloak] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRoles, setUserRoles] = useState([]);
  useEffect(() => {
    const initializeKeycloak = async () => {
      const storedToken = localStorage.getItem('token');
      const storedRefreshToken = localStorage.getItem('refreshToken');
      const keycloakInstance = new Keycloak(keycloakConfig);
      if (storedToken && storedRefreshToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          keycloakInstance.token = storedToken;
          keycloakInstance.tokenParsed = decodedToken;
          keycloakInstance.refreshToken = storedRefreshToken;
          keycloakInstance.authenticated = true;
          setKeycloak(keycloakInstance);
          setIsAuthenticated(true);
          setUserRoles(decodedToken.realm_access.roles || []);
        } catch (error) {
          console.error('Invalid token', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
        }
      } else {
        setKeycloak(keycloakInstance);
      }
      setLoading(false);
    };
    initializeKeycloak();
    const interval = setInterval(checkTokenValidity, 60000); // Check token validity every minute
    return () => clearInterval(interval);
  }, []);
  const login = async (username, password) => {
    const params = new URLSearchParams();
    params.append('client_id', keycloakConfig.clientId);
    params.append('client_secret', keycloakConfig.clientSecret);
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);
    try {
      const response = await fetch(
        `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        }
      );
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const decodedToken = jwtDecode(data.access_token);
      const keycloakInstance = new Keycloak(keycloakConfig);
      keycloakInstance.token = data.access_token;
      keycloakInstance.tokenParsed = decodedToken;
      keycloakInstance.authenticated = true;
      keycloakInstance.refreshToken = data.refresh_token;
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      setKeycloak(keycloakInstance);
      setIsAuthenticated(true);
      setUserRoles(decodedToken.realm_access.roles || []);
      return true;
    } catch (err) {
      console.error('Failed to login', err);
      setIsAuthenticated(false);
      return false;
    }
  };
  const logout = async () => {
    if (!keycloak) {
      console.error('Keycloak instance is not initialized');
      return;
    }
    const storedToken = keycloak.token;
    if (!storedToken) {
      console.error('No token found for logout');
      return;
    }
    const params = new URLSearchParams();
    params.append('client_id', keycloakConfig.clientId);
    params.append('client_secret', keycloakConfig.clientSecret);
    params.append('refresh_token', keycloak.refreshToken);
    try {
      await fetch(
        `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        }
      );
    } catch (err) {
      console.error('Failed to logout', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      setIsAuthenticated(false);
      setUserRoles([]);
      const logoutUrl =  `http://localhost:3000/Login`;
      window.location.href = logoutUrl;
    }
  };
  const refreshToken = async () => {
    const storedRefreshToken = localStorage.getItem('refreshToken');
    if (!storedRefreshToken) {
      window.location.href = '/Login';
      return false;
    }

    const params = new URLSearchParams();
    params.append('client_id', keycloakConfig.clientId);
    params.append('client_secret', keycloakConfig.clientSecret);
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', storedRefreshToken);

    try {
      const response = await fetch(
        `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        }
      );

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      const decodedToken = jwtDecode(data.access_token);
      const keycloakInstance = new Keycloak(keycloakConfig);
      keycloakInstance.token = data.access_token;
      keycloakInstance.tokenParsed = decodedToken;
      keycloakInstance.authenticated = true;
      keycloakInstance.refreshToken = data.refresh_token;
      localStorage.setItem('token', data.access_token);
      localStorage.setItem('refreshToken', data.refresh_token);
      setKeycloak(keycloakInstance);
      setIsAuthenticated(true);
      setUserRoles(decodedToken.realm_access.roles || []);
      return true;
    } catch (err) {
      console.error('Failed to refresh token', err);
      window.location.href = '/Login';
      return false;
    }
  };

  const getEmail = () => {
    const decodedToken = keycloak.tokenParsed;
    return decodedToken.email; 
  };
  const checkTokenValidity = async () => {
    const accessToken = localStorage.getItem('token');
    if (!accessToken) {
      logout();
      return;
    }
    const params = new URLSearchParams();
    params.append('client_id', keycloakConfig.clientId);
    params.append('client_secret', keycloakConfig.clientSecret);
    params.append('token', accessToken);
    try {
      const response = await fetch(
        `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/token/introspect`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: params,
        }
      );
      if (!response.ok) {
        throw new Error('Failed to introspect token');
      }
      const data = await response.json();
      if (!data.active) {
        const refreshed = await refreshToken();
        if (!refreshed) {
          logout();
        }
      }
    } catch (err) {
      console.error('Failed to introspect token', err);
      logout();
    }
   
  };
  return (
    <KeycloakContext.Provider value={{ keycloak, isAuthenticated, login, logout, loading, userRoles, refreshToken, checkTokenValidity,getEmail  }}>
      {children}
    </KeycloakContext.Provider>
  );
};
export const useKeycloak = () => useContext(KeycloakContext);