import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useKeycloak } from '../components/KeycloakContext'; // Import refreshToken and logout functions
const apiUrl = 'http://localhost:8080/api/v1';
const  { refreshToken, logout } = useKeycloak ;
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
},
});
axiosInstance.interceptors.request.use(
  async (config) => {
    let token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp > currentTime) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          const refreshed = await refreshToken();
          if (refreshed) {
            token = localStorage.getItem('token');
            config.headers.Authorization = `Bearer ${token}`;
          } else {
            await logout();
            throw new Error('Token expired and failed to refresh');
          }
        }
      } catch (error) {
        console.error('Invalid token', error);
        localStorage.removeItem('token');
        throw error;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 403) {
      // Rediriger vers la page de login en cas d'erreur 403
      window.location.href = '/Login';
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;