import React, { useState, useRef,useEffect } from "react";
import { Table, Dropdown, Menu, Checkbox,Tooltip, Input, Button, Space } from "antd";
import { SearchOutlined, SettingOutlined ,UserAddOutlined,CloseCircleOutlined,EditOutlined,UserDeleteOutlined} from "@ant-design/icons";
import { useNavigate, useParams, Link } from 'react-router-dom';
import Highlighter from "react-highlight-words";
import axiosInstance from "../../core/axiosConfig";

const Contactclient = ({ contacts }) => {
  const [selectedColumnsContacts, setSelectedColumnsContacts] = useState(["nomc","prenomc" ,"qualite", "fax", "emailc", "telephonec", "raison_social", "actions"]);
  const [columnSelectionMenuVisibleContacts, setColumnSelectionMenuVisibleContacts] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [companyDetails, setCompanyDetails] = useState({
  
    contactDto: []
   
  });
  const navigate = useNavigate();
  const companyId = localStorage.getItem('companyId');
  useEffect(() => {
    
  const companyId = localStorage.getItem('companyId');
  if (companyId) {
    axiosInstance.get(`http://localhost:8080/api/v1/compagnie/${companyId}`)
      .then(response => {
        setCompanyDetails(response.data);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des détails de la compagnie', error);
      });
  }
}, []);
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  const showModal = (contact) => {
    setContactToDelete(contact);
    setModalVisible(true);
  };
  const handleEditContact = (contact) => {
    navigate(`/client/contacte/${companyId}`, { state: { contact } });
  };

  const deleteContact = async () => {
    setAlertVisible(true);
    await axiosInstance.delete("http://localhost:8080/api/v1/contact/delete/" + contactToDelete.id);
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
    setContactToDelete(null);
    setModalVisible(false);
  };

  const columnSelectionMenuContacts = (
    <Menu>
      <Menu.Item>
        <Checkbox.Group value={selectedColumnsContacts} onChange={(checkedValues) => setSelectedColumnsContacts(checkedValues)}>
       
           <Checkbox value="nomc">Nom</Checkbox>
           <Checkbox value="prenomc">Prenom</Checkbox>
           <Checkbox value="qualite">Fonction</Checkbox>
            <Checkbox value="fax">Fixe</Checkbox>
            <Checkbox value="emailc">Email</Checkbox>
            <Checkbox value="telephonec">Téléphone</Checkbox>
            <Checkbox value="actions">Actions</Checkbox>
          
      
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );

  const columnsContacts = [
    {
        title: <span style={{ color: '#607AD6' }}>Nom</span>,
        dataIndex: 'nomc',
        key: 'nomc',
        ...getColumnSearchProps('nomc'),
       
      },
      {
        title: <span style={{ color: '#607AD6' }}>Prenom</span>,
        dataIndex: 'prenomc',
        key: 'prenomc',
        ...getColumnSearchProps('prenonc'),
       
      },
      {
        title: <span style={{ color: '#607AD6' }}>Fonction</span>,
        dataIndex: 'qualite',
        key: 'qualite',
        ...getColumnSearchProps('qualite'),
   
      },
      {
        title: <span style={{ color: '#607AD6' }}>Fixe</span>,
        dataIndex: 'fax',
        key: 'fax',
        ...getColumnSearchProps('fax'),
      
      },
      {
        title: <span style={{ color: '#607AD6' }}>Email</span>,
        dataIndex: 'emailc',
        key: 'emailc',
        ...getColumnSearchProps('emailc'),
       
      },
      {
        title: <span style={{ color: '#607AD6' }}>Téléphone</span>,
        dataIndex: 'telephonec',
        key: 'telephonec',
        ...getColumnSearchProps('telephonec'),
       
      },
      {
        title: <span style={{ color: '#607AD6' }}>Actions</span>,
        key: 'actions',
        render: (text, record) => (
          <Space size="middle">
            <Tooltip title="Modifier">
              <span className="contact-bg" onClick={() => handleEditContact(record)}>
                <EditOutlined style={{ color: '#228B22' }} />
              </span>
            </Tooltip>
            <Tooltip title="Supprimer">
              <span className="contact-bg" onClick={() => showModal(record)}>
                <UserDeleteOutlined style={{ color: '#B22222' }} />
              </span>
            </Tooltip>
          </Space>
        ),
      },
     
    {
      title: (
        <Dropdown overlay={columnSelectionMenuContacts} trigger={['click']} visible={columnSelectionMenuVisibleContacts} onVisibleChange={setColumnSelectionMenuVisibleContacts}>
          <SettingOutlined style={{ cursor: 'pointer' }} />
        </Dropdown>
      ),
      key: 'settings',
      align: 'right',
      width: 50,
    },
  ];

  const selectedColumnsConfigContacts = columnsContacts.filter(column => selectedColumnsContacts.includes(column.key) || column.key === 'settings');

  return (
    <>
    <div className="container"> 
    <br />
    <br />
    <div className="row justify-content-end">
    <div className="col-lg-2">
      <Link to={`/client/contact/add/${companyId}`}>
      <span className="btn btn-sm mb-3 custom-btn-color" style={{ color: '#ffffff',backgroundColor:"rgba(96, 122, 214, 0.70)"  }}>
                          <UserAddOutlined style={{ color: '#ffffff' }} /> AJOUTER
                      </span>

      </Link>
    </div>
  </div>
  <br />
    <Table 
      columns={selectedColumnsConfigContacts} 
      dataSource={companyDetails.contactDto} 
      rowKey="id" 
      pagination={{ pageSize: 8 }} 
    
      size="small" 
    />
         </div>
    </>
  );
};

export default Contactclient;
