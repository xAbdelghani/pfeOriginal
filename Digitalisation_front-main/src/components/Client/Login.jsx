import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message, Layout } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
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
      let isMounted = true;

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
  
      <div className="login-background">
    <div className="login-container">
      <div className="login-form">
        <div className="logo">
          <img src={orsyss} alt="Orsyss logo" style={{ height: '50px' }} />
        </div>
        <h2><strong>Connexion</strong></h2>
        <p>Bienvenue à nouveau ! Veuillez saisir votre login et votre mot de passe</p>
        <Form onFinish={onFinish}>
          <Form.Item name="email">
            <Input
              prefix={<MailOutlined style={{ marginRight: '4px' }} />}
              placeholder=" Login"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item name="password">
            <Input.Password
              prefix={<LockOutlined style={{ marginRight: '4px' }} />}
              placeholder=" Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Item>
          <Form.Item>
            <button type="submit" className="login-btn">
              <strong>Se connecter</strong>
            </button>
          </Form.Item>
        </Form>
      </div>
    </div>
    </div>
  );
};

export default Login;
