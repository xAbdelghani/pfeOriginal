// src/components/Client/Login.js
import React, { useEffect, useState } from 'react';
import { Form, Input, Button, message,Layout } from 'antd';
import { MailOutlined, KeyOutlined } from '@ant-design/icons';
import Log from "../../assets/Log.png";
import { useKeycloak } from '../KeycloakContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../core/axiosConfig";
import orsyss from "../../assets/orsyss.png";
import '../../App.css';

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
        <div>
          <Header className="custom-header">
                <div className="demo-logo" />
                <div className="navbar-brand">
                    <img src={orsyss} alt="" style={{ height: '40px', marginLeft: "42%" }} />
                </div>
            </Header>
        <div style={{ display: 'flex' }}>
            <div className="navbar-brand">
                <br />
                <img src={Log} alt="" style={{ height: '100%', marginRight: 10, marginLeft: -200 }} />
            </div>

            <div className='container'>
                <br />
                <br />
                <br />
                <br />
                <br />
                <h1 style={{ color: '#607AD6', marginLeft: 150, marginTop: "10%" }}><strong>Connexion</strong></h1>

                <Form
                    name="basic"
                    labelCol={{ span: 10 }}
                    wrapperCol={{ span: 22 }}
                    style={{ maxWidth: 700, marginTop: "8%" }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <label style={{fontSize: "16px", marginLeft: "7%"}}>Identifiant</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        
                        <MailOutlined style={{ color: '#607AD6', fontSize: '30px', marginRight: 10, marginLeft: 5 }} />
                        <div style={{ flex: 2 }}>
                            <Form.Item
                                style={{ marginBottom: 0 }}
                                title="Identifiant"
                                name="email"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Entrez votre username!',
                                    },
                                ]}
                            >
                                <Input onChange={(e) => setEmail(e.target.value)} />
                            </Form.Item>
                        </div>
                    </div>
                    
                    <label style={{ marginLeft: "7%",fontSize: "16px" }}>Mot de passe</label>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <KeyOutlined style={{ color: '#607AD6', fontSize: '30px', marginRight: 10, marginLeft: 5 }} />
                        <div style={{ flex: 1 }}>
                            <Form.Item
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Entrez votre mot de passe!',
                                    },
                                ]}
                            >
                                <Input.Password onChange={(e) => setPassword(e.target.value)} />
                            </Form.Item>
                        </div>
                    </div>

                    <Form.Item
                        wrapperCol={{ offset: 8, span: 16 }}
                    >
                        <br />
                        <Button type="primary" htmlType="submit" style={{ backgroundColor: '#607AD6', marginLeft: 20, marginTop: "3%" }}>
                            Se connecter
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
        </div>
    );
};

export default Login;
{/*
    .login-container {
  display: flex;
  height: 100vh;
  overflow: hidden; 
}

.login-form {
  width: 50%;
  padding: 20px 40px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.logo-image {
  height: 50px;
  margin-bottom: 20px;
}

.login-form h2 {
  margin-bottom: 20px;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 5px;
}

.input-group input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.login-button {
  width: 100%;
  padding: 15px;
  background-color: #4169E1;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 18px;
}

.login-button:hover {
  background-color: #0056b3;
}

.login-banner {
  width: 50%;
  background-color: #f5f7fa;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.login-banner h3 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.banner-image {
  width: 100%;
  display: flex;
  justify-content: center;
}

.digi-image {
 
}
*/}