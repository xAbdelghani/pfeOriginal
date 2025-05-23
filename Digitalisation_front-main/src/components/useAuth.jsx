import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import { useKeycloak } from '../components/KeycloakContext'; // Assurez-vous que le chemin est correct
const useAuth = () => {
  const { keycloak, isAuthenticated: keycloakAuthenticated, userRoles: keycloakRoles, refreshToken, logout } = useKeycloak();
  const [isAuthenticated, setIsAuthenticated] = useState(keycloakAuthenticated);
  const [userRoles, setUserRoles] = useState(keycloakRoles);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!keycloakAuthenticated && storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          const currentTime = Date.now() / 1000;
          if (decodedToken.exp > currentTime) {
            setIsAuthenticated(true);
            setUserRoles(decodedToken.realm_access.roles || []);
            setAccessToken(storedToken);
          } else {
            const refreshed = await refreshToken();
            if (refreshed) {
              const newToken = localStorage.getItem('token');
              const newDecodedToken = jwtDecode(newToken);
              setIsAuthenticated(true);
              setUserRoles(newDecodedToken.realm_access.roles || []);
              setAccessToken(newToken);
            } else {
              await logout();
            }
          }
        } catch (error) {
          console.error('Failed to decode token', error);
          await logout();
        }
      } else if (keycloakAuthenticated) {
        setIsAuthenticated(true);
        setUserRoles(keycloak.tokenParsed.realm_access.roles || []);
        setAccessToken(keycloak.token);
      }
      setIsLoading(false);
    };
    checkAuth();
  }, [keycloak, keycloakAuthenticated, refreshToken, logout]);
  console.log("useAuth", { isAuthenticated, userRoles, isLoading, accessToken });
  return { isAuthenticated, userRoles, isLoading, accessToken };
};
export default useAuth;