import React, { useState, useEffect } from 'react';
import { Layout, Menu, Dropdown, Avatar, Badge, List } from 'antd';
import { BellOutlined, UserOutlined, LogoutOutlined, FullscreenOutlined, FullscreenExitOutlined , StarOutlined } from '@ant-design/icons';
import orsyss from "../assets/orsyss.png";
import '../App.css';
import { useKeycloak } from '../components/KeycloakContext';
import axiosInstance from "../core/axiosConfig";

const { Header } = Layout;

const AppHeader = () => {
  const { keycloak, logout } = useKeycloak();
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [favorites, setFavorites] = useState([]);
  let username = 'User';

  try {
    username = keycloak.tokenParsed ? keycloak.tokenParsed.preferred_username : 'User';
  } catch (error) {
    console.error('Error accessing tokenParsed', error);
    window.location.href = '/Login';
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const companyId = localStorage.getItem('companyId');
        const response = companyId 
          ? await axiosInstance.get(`http://localhost:8080/api/v1/notification/compagnie/${companyId}`)
          : await axiosInstance.get('http://localhost:8080/api/v1/notification/getall');
        setNotifications(response.data);
        setNotificationCount(response.data.length);
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    fetchNotifications();

    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement !== null);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  const notificationMenu = (
    <div
      style={{
        width: 300,
        backgroundColor: 'white',
        border: '1px solid #e8e8e8',
        borderRadius: '4px',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
        maxHeight: '400px',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#888 #e8e8e8',
      }}
    >
      <style>
        {`
          .notification-menu::-webkit-scrollbar {
            width: 8px;
          }

          .notification-menu::-webkit-scrollbar-track {
            background: #e8e8e8;
          }

          .notification-menu::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 10px;
            border: 2px solid #e8e8e8;
          }
        `}
      </style>
      <List
        className="notification-menu"
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={item => (
          <List.Item style={{ padding: '10px 8px' }}>
            <List.Item.Meta
              title={<div style={{ fontWeight: 'bold' }}>{item.messagen}</div>}
              description={
                <div style={{ marginTop: '2px' }}>
                  <div>{item.description}</div>
                  <div style={{ fontSize: '1px', color: 'gray', marginTop: '5px' }}>{item.timestamp}</div>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </div>
  );

  const userMenu = (
    <Menu>
      <Menu.Item key="0">
        <UserOutlined style={{ color: "#006400" }} />
        <span><strong> Login : {username}</strong></span>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="1" onClick={logout}>
        <LogoutOutlined style={{ color: "red" }} />
        <span><strong> Se déconnecter</strong></span>
      </Menu.Item>
    </Menu>
  );

  const favoritesMenu = (
    <div
      style={{
        width: 300,
        backgroundColor: 'white',
        border: '1px solid #e8e8e8',
        borderRadius: '4px',
        boxShadow: '0 3px 6px rgba(0, 0, 0, 0.1)',
        maxHeight: '400px',
        overflowY: 'auto',
        scrollbarWidth: 'thin',
        scrollbarColor: '#888 #e8e8e8',
      }}
    >
      <style>
        {`
          .favorites-menu::-webkit-scrollbar {
            width: 8px;
          }

          .favorites-menu::-webkit-scrollbar-track {
            background: #e8e8e8;
          }

          .favorites-menu::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 10px;
            border: 2px solid #e8e8e8;
          }
        `}
      </style>
      <List
        className="favorites-menu"
        itemLayout="horizontal"
        dataSource={favorites}
        renderItem={item => (
          <List.Item style={{ padding: '10px 8px' }}>
            <List.Item.Meta
              title={<div style={{ fontWeight: 'bold' }}>{item.name}</div>}
              description={<div style={{ marginTop: '2px' }}>{item.description}</div>}
            />
          </List.Item>
        )}
      />
    </div>
  );

  return (
    <Header className="custom-header">
      <div className="navbar-brand">
        <img src={orsyss} alt="" style={{ height: '40px', marginLeft: "1%" }} />
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>

      {/*<Dropdown overlay={favoritesMenu} trigger={['click']} placement="bottomRight">
          <StarOutlined style={{ fontSize: '18px', color: '#FFD700', marginRight: '2px', cursor: 'pointer' }} />
        </Dropdown>

        <div style={{ height: '17px', width: '1px', backgroundColor: '#87CEEB', margin: '0 10px' }}></div>*/}
        {isFullscreen ? (
          <FullscreenExitOutlined 
            style={{ fontSize: '18px', color: '#ADD8E6', cursor: 'pointer', marginRight: '2px' }} 
            onClick={toggleFullscreen} 
          />
        ) : (
          <FullscreenOutlined 
            style={{ fontSize: '18px', color: '#ADD8E6', cursor: 'pointer', marginRight: '2px' }} 
            onClick={toggleFullscreen} 
          />
        )}
        <div style={{ height: '17px', width: '1px', backgroundColor: '#87CEEB', margin: '0 10px' }}></div>
        <Dropdown overlay={notificationMenu} trigger={['click']} placement="bottomRight">
          <BellOutlined style={{ fontSize: '18px', color: '#DAA520', marginRight: '-1px', cursor: 'pointer' }} />
        </Dropdown>
        <div style={{ height: '17px', width: '1px', backgroundColor: '#87CEEB', margin: '0 10px' }}></div>
        <span style={{ marginRight: '3px', fontWeight: 'bold' }}>{username}</span>
        <Dropdown overlay={userMenu} trigger={['click']} placement="bottomRight">
          <Avatar style={{ backgroundColor: 'white', cursor: 'pointer', marginRight: '22px', height:"1%"}} icon={<UserOutlined style={{color:"#A9A9A9",fontSize: '18px'}}/>} />
        </Dropdown>
      </div>
    </Header>
  );
};

export default AppHeader;
