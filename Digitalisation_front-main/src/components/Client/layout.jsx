import React, { useState } from 'react';
import { CarOutlined, DiffOutlined, ContainerOutlined, UserOutlined, DollarOutlined,PhoneOutlined, AppstoreOutlined,ContactsOutlined } from '@ant-design/icons';
import { Button, Layout, Menu } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import '../../App.css'; // Import the custom CSS file
import { useKeycloak } from '../KeycloakContext';
import Breadcrumbs from "../Admin/breadcrumbNameMap";

const { Sider, Header, Content } = Layout; 

const Navbar = () => {
  const [collapsed, setCollapsed] = useState(true); // Initialiser à true pour que la barre de navigation soit fermée par défaut
  const [current, setCurrent] = useState('1');
  const navigate = useNavigate();
  const { logout } = useKeycloak();

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const items = [
    {
      key: 'sub1',
      label: 'Profil',
      icon: <UserOutlined />,
      onClick: () => navigate('/client/Profil?companyId=${getCompanyId()}'),
    },
    {
      key: 'sub2',
      label: 'Mes abonnements',
      icon: <DollarOutlined />,
      onClick: () => navigate('/client/abon') ,
      
    },
    {
      key: 'sub9',
      label: 'Mes prepaiements',
      icon: <DiffOutlined />,
      onClick: () => navigate('/client/prepaiement') ,
      
    },
    {
      key: 'sub5',
      label: 'Attestations Disponibles',
      icon: <CarOutlined />,
      onClick: () => navigate('/client/autorises') ,
      
    },
    {
      key: 'sub6',
      label: 'Mes factures',
      icon: <ContainerOutlined />,
     onClick: () => navigate('/client/facture')
    },
    {
      key: 'sub8',
      label: 'Mes Contacts',
      icon: <ContactsOutlined />,
      onClick: () => navigate('/client/Contact') ,
    },
    {
      key: 'sub10',
      label: 'Contactez-vouz',
      icon: <PhoneOutlined />,
      onClick: () => navigate('/client/Contactez') ,
    },

    
    {
      key: 'sub7',
      label: 'Dashbord',
      icon: <AppstoreOutlined />,
    },
  ];

  return (
    <Layout style={{ height: '100vh', display: 'flex', flexDirection: 'row' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={230}
        collapsedWidth={60}
        className="site-layout-background custom-collapse-button"
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          onClick={onClick}
          style={{ height: '110%', backgroundColor: '#001529' }}
          selectedKeys={[current]}
          mode="inline"
        >
          {items.map(item => (
            item.children ? (
              <Menu.SubMenu
                key={item.key}
                icon={item.icon}
                title={collapsed ? null : item.label}
              >
                {item.children.map(child => (
                  <Menu.Item key={child.key} onClick={child.onClick}>
                    {child.label}
                  </Menu.Item>
                ))}
              </Menu.SubMenu>
            ) : (
              <Menu.Item key={item.key} icon={item.icon} onClick={item.onClick}>
                {item.label}
              </Menu.Item>
            )
          ))}
        </Menu>
      </Sider>
      <Layout style={{ flex: 1 }}>
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
          <Breadcrumbs />
          {/*<Button onClick={logout} type='primary' style={{ backgroundColor: 'rgba(96, 122, 214, 0.7)' , marginTop: '85%'}}>Se déconnecter</Button>*/}
        </Header>
        <Content style={{ background: '#fff', margin: 0, padding: '24px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Navbar;
