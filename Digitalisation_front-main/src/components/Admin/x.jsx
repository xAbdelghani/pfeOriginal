import React, { useState } from 'react';
import { CarOutlined, DiffOutlined, ContainerOutlined  ,PicCenterOutlined, MailOutlined, SolutionOutlined, DashboardOutlined, FileTextOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { Layout, Menu, theme } from 'antd';
import { BrowserRouter as Router, Link, Route, Navigate } from "react-router-dom";
import orsyss from "../../assets/orsyss.png";
import '../../App.css'; // Import the custom CSS file
import { useNavigate  } from 'react-router-dom';

const { Header, Content, Sider } = Layout;

const Navbar = () => {
  const [themeType, setThemeType] = useState('dark');
  const [current, setCurrent] = useState('1');
  const navigate = useNavigate();

  const changeTheme = (value) => {
    setThemeType(value ? 'dark' : 'light');
  };

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

  const items = [
    {
      key: 'sub1',
      label: 'Menu Compagnie',
      icon: <PicCenterOutlined />,
     
      children: [
        {
          key: '1',
          label: 'Compagnie',
          onClick: () =>navigate ('/'),
        },
        {
          key: '2',
          label: 'Point_vente',
        },
        {
          key: '3',
          label: 'Contact',
        },
        {
          key: '4',
          label: 'Type',
        },
      ],
    },
    {
      key: 'sub2',
      label: 'Menu Abonnement',
      icon: <DiffOutlined />,
    
      children: [
        {
          key: '5',
          label: 'Abonnement',
          onClick: () =>navigate ('/Abonnements'),
        },
        {
          key: '6',
          label: 'Type_Abonnement',
          onClick: () =>navigate ('/Nvtype'),
        },
        {
          key: 'sub3',
          label: 'Submenu',
          children: [
            {
              key: '7',
              label: 'Option 7',
            },
            {
              key: '8',
              label: 'Option 8',
            },
          ],
        },
      ],
    },
    {
      key: 'sub4',
      label: 'Menu Vehicule',
      icon: <CarOutlined />,
   
      children: [
        {
          key: '9',
          label: 'Vehicule',
        },
        {
          key: '10',
          label: 'Modele_Vehicule',
        },
        {
          key: '11',
          label: 'Option 11',
        },
        {
          key: '12',
          label: 'Option 12',
        },
      ],
    },
    {
      key: 'sub5',
      label: 'Menu Facture',
      icon: <ContainerOutlined />,
     
      children: [
        {
          key: '18',
          label: 'Facture',
          onClick: () =>navigate ('/Facture'),
        },
        {
          key: '19',
          label: 'Type Facture',
          onClick: () =>navigate ('/Nvtype'),
        },
      ],
    },
    {
      key: 'sub6',
      label: 'Menu Table_reference',
      icon: <AppstoreOutlined />,
      children: [
        {
          key: '13',
          label: 'Facture',
        },
        {
          key: '14',
          label: 'Type Facture',
        },

        {
          key: '15',
          label: 'Attestation',
        },
        {
          key: 'sub3',
          label: 'Submenu',
          children: [
            {
              key: '16',
              label: 'Option 7',
            },
            {
              key: '17',
              label: 'Option 8',
            },
          ],
        },
      ],
    },
  ];

  const { colorBgContainer, borderRadiusLG } = theme.useToken().token;

  return (
    <>
    <Layout style={{ height: '90vh' }}>
    
      <Layout>
        <Sider theme={theme === 'light' ? 'light' : 'light'} width={280}>
          <Menu
            theme={theme === 'light' ? 'light' : 'light'}
            onClick={onClick}
            style={{ height: '100%', backgroundColor: 'white' }}
            selectedKeys={[current]}
            mode="inline"
            items={items}
            className={theme === 'dark' ? 'custom-menu' : ''}
          />
        </Sider>
  
      </Layout>
    </Layout>
    </>
  );
};

export default Navbar;
