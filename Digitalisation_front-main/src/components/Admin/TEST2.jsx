import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message,Layout } from 'antd';
import { MailOutlined, KeyOutlined } from '@ant-design/icons';
import Log from "../../assets/Log.png";
import { useKeycloak } from '../KeycloakContext';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Assuming you have some CSS for styling
import orsyss from "../../assets/orsyss.png";
import digi from "../../assets/testt.webp";

const { Content, Sider, Header } = Layout;
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        // Implement your login logic here
        console.log('Login with:', email, password);
    };

    return (
        <div className="login-container">
            <div className="login-form">
            
                    <img src={orsyss} alt="" style={{ height: '50px', marginLeft: "-0.2%",marginRight:"65%",marginTop:"-10%" }} />
              <br/>
              <br/>
              <br/>
              <br/>

           
             
                <h2><strong>Login</strong></h2>
                <p>Bienvenue à nouveau ! Veuillez saisir votre login et votre mot de passe</p>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label><strong>Login</strong></label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            rules={[
                                {
                                    required: true,
                                    message: 'Entrez votre username!',
                                },
                            ]}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <label><strong>Mot de passe</strong></label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                   <br/>
                    <button type="submit" className="login-button"><strong>Se connecter</strong></button>
                </form>
               
            </div>
            <div className="login-banner">
                <h3 style={{marginTop :"-14%" ,backgroundColor:"#4169E1"}}>Digitalisez les attestations automobile pour les compagnies d'assurance</h3>
                <div className="banner-image">
                <img src={digi} alt="" style={{ height: '95%', marginRight: "1%", marginLeft: "1%",marginTop :"6%"}} />
                </div>
            </div>
        </div>
    );
};

export default Login;
{/*
    import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message,Layout } from 'antd';
import { MailOutlined, KeyOutlined } from '@ant-design/icons';
import Log from "../../assets/Log.png";
import { useKeycloak } from '../KeycloakContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../core/axiosConfig";
import orsyss from "../../assets/orsyss.png";
import '../../App.css';
import './Login.css';

const { Content, Sider, Header } = Layout;
const Login = () => {
  const { login, isAuthenticated, userRoles, loginError, getEmail } = useKeycloak();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyId, setCompanyId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
      let isMounted = true; // Flag pour empêcher les mises à jour d'état après démontage du composant

      const fetchCompanyId = async () => {
          const email = getEmail();
          console.log(email);
          try {
              const response = await axiosInstance.get(`/compagnie/id-by-email?email=${email}`);
              
              if (isMounted) {
                  const companyId = response.data;
                  setCompanyId(companyId);
                  localStorage.setItem('companyId', companyId);
              }
          } catch (error) {
              console.error('Erreur lors de la récupération du companyId', error);
          }
      };

      if (isAuthenticated && !companyId && userRoles.includes('client-abonnement')) {
          fetchCompanyId();
      }

      return () => {
          isMounted = false;
      };
  }, [isAuthenticated, companyId, getEmail, userRoles]);

  useEffect(() => {
      if (userRoles.includes('admin')) {
          navigate("/admin");
      } else if (companyId) {
          if (userRoles.includes('client-abonnement')) {
              navigate(`/client?companyId=${companyId}`);
          } else {
              navigate('/403');
          }
      }
  }, [companyId, userRoles, navigate]);

  useEffect(() => {
      if (loginError) {
          message.error(loginError);
      }
  }, [loginError]);

  const onFinish = async () => {
      const success = await login(email, password);
      if (!success) {
          console.error('Echec de connexion');
      }
  };
  return (
    <body>
    <div className="login-container">
      <div className="login-form">
        <div className="logo">
        <img src={orsyss} alt="" style={{ height: '50px'}} />
        </div>
        <h2>Connexion</h2>
        <p>Bienvenue à nouveau ! Veuillez saisir votre login et votre mot de passe</p>
        <form>
          <input  name="email" type="text" placeholder="Login" required />
          
          <input name="password" type="password" placeholder="Mot de passe" required />
         
          <button type="submit" className="login-btn"><strong>Se connecter</strong></button>
        </form>
        
        
      </div>
     
    </div>
    </body>
  );
};

export default Login;
*/}

