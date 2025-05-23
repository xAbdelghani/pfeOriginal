import React, { useState } from 'react';
import { CarOutlined, DiffOutlined, ContainerOutlined, PicCenterOutlined, DollarOutlined, AppstoreOutlined } from '@ant-design/icons';
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
      label: 'Compagnie',
      icon: <PicCenterOutlined />,
      children: [
        { key: '1', label: 'Compagnies', onClick: () => navigate('/admin/compagnies') },
        { key: '2', label: 'Courtiers', onClick: () => navigate('/admin/Point') },
        { key: '20', label: 'Agences', onClick: () => navigate('/admin/Agence') },
        { key: '3', label: 'Contacts', onClick: () => navigate('/admin/Contactall') },
        { key: '21', label: 'Comptes', onClick: () => navigate('/admin/Compte') },
      ],
    },
    {
      key: 'sub2',
      label: 'Abonnement',
      icon: <DollarOutlined />,
      children: [
        { key: '5', label: 'Abonnements', onClick: () => navigate('/admin/Abonnements') },
      ],
    },
    {
      key: 'sub4',
      label: 'Prepaiement',
      icon: <DiffOutlined />,
      children: [
        { key: '18', label: 'Prepaiement', onClick: () => navigate('/admin/solde') },
      ],
    },
    {
      key: 'sub5',
      label: 'Attestation',
      icon: <CarOutlined />,
      children: [
        { key: '24', label: 'Attestation', onClick: () => navigate('/admin/attestation')},
        { key: '7', label: 'Type Attestation', onClick: () => navigate('/admin/typeattestation') },
        { key: '8', label: 'Attestation Autorisé', onClick: () => navigate('/admin/Autorise')}, 
        { key: '9', label: 'Vehicule' , onClick: () => navigate('/admin/Vehicule') },   
        { key: '10', label: 'Modele_Vehicule' , onClick: () => navigate('/admin/Modele')},  
       
      ],
    },
    {
      key: 'sub6',
      label: 'Facture',
      icon: <ContainerOutlined />,
      children: [
        { key: '19', label: 'Facture', onClick: () => navigate('/admin/Facture') },
      ],
    },
    {
      key: 'sub7',
      label: 'Table_reference',
      icon: <AppstoreOutlined />,
      children: [
        { key: '6', label: 'Type_Abonnements', onClick: () => navigate('/admin/Nvtype') },
        { key: '13', label: 'Fonction', onClick: () => navigate('/admin/fonction') },
        { key: '4', label: 'Types', onClick: () => navigate('/admin/Type') },
        { key: '14', label: 'Statut Abonnement', onClick: () => navigate('/admin/Statut') },
        { key: '25', label: 'Statut Courtier', onClick: () => navigate('/admin/StatutC') },
        { key: '21', label: 'Statut Attestation', onClick: () => navigate('/admin/StatutA') },
        { key: '15', label: 'Type Facture' },
      ],
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
          theme="dark" // Change to dark theme for better contrast
          onClick={onClick}
          style={{ height: '120%', backgroundColor: '#001529' }} // Consistent dark background color
          selectedKeys={[current]}
          mode="inline"
        >
          {items.map(item => (
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
          ))}
        </Menu>
      </Sider>
      <Layout style={{ flex: 1 }}>
        <Header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'white' }}>
          <Breadcrumbs />
          {/*<Button onClick={logout} type='primary' style={{ backgroundColor: 'rgba(96, 122, 214, 0.7)', marginTop: '85%' }}>Se deconnecter</Button>*/}
        </Header>
        <Content style={{ background: '#fff', margin: 0, padding: '24px' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Navbar;
