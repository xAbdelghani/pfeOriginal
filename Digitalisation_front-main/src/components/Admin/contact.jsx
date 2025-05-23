import React, { useEffect, useState, useRef } from "react";
import { Table, Space, Tooltip, Alert, Modal, Input, Button, Checkbox, Dropdown, Menu, Row, Col } from "antd";
import axiosInstance from "../../core/axiosConfig";
import { useNavigate, useParams, Link } from 'react-router-dom';
import { SearchOutlined, UserAddOutlined, EditOutlined, UserDeleteOutlined, SettingOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const Contact = () => {
  const [contacts, setContacts] = useState([]);
  const [alertVisible, setAlertVisible] = useState(false);
  const [cancelMessage, setCancelMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [updateMessage, setUpdateMessage] = useState('');
  const [errorupdateMessage, setErrorupdateMessage] = useState('');
  const [errorsuccessMessage, setErrorsuccessMessage] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const [contactToDelete, setContactToDelete] = useState(null);
  const [selectedColumns, setSelectedColumns] = useState(["nomc", "qualite", "fax", "emailc", "telephonec", "raison_social", "actions"]);
  const [columnSelectionMenuVisible, setColumnSelectionMenuVisible] = useState(false);
  const searchInput = useRef(null);
  const navigate = useNavigate();
  const { compagnieId } = useParams(); // Obtenir l'ID de la compagnie à partir de l'URL

  useEffect(() => {
    loadContacts();
  }, [compagnieId]);

  const loadContacts = async () => {
    try {
      const result = await axiosInstance.get("http://localhost:8080/api/v1/contact/getall");
      setContacts(result.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts :", error);
    }
  };

  async function anuller(contactId) {
    setAlertVisible(true);
    try {
      await axiosInstance.put(`http://localhost:8080/api/v1/contact/removeCompany/${contactId}`);
      // Rechargez la liste des compagnies après la mise à jour
      loadContacts();
      setTimeout(() => {
        setAlertVisible(false);
      }, 3000);
    } catch (error) {
      console.error("Error deleting point vente", error);
    }
  }

  const handleEditContact = (contact) => {
    navigate(`/admin/contacte`, { state: { contact } });
  };

  const deleteContact = async () => {
    setAlertVisible(true);
    await axiosInstance.delete("http://localhost:8080/api/v1/contact/delete/" + contactToDelete.id);
    loadContacts();
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);
    setContactToDelete(null);
    setModalVisible(false);
  };

  const showModal = (contact) => {
    setContactToDelete(contact);
    setModalVisible(true);
  };

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
          placeholder={`Chercher ${dataIndex}`}
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
            Chercher
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Annuler
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

  const handleColumnChange = (checkedValues) => {
    setSelectedColumns(checkedValues);
  };

  const columnSelectionMenu = (
    <Menu>
      <Menu.Item>
        <Checkbox.Group value={selectedColumns} onChange={handleColumnChange}>
          <Row> 
            <Col span={8}><Checkbox value="nomc">Nom</Checkbox></Col>
            <Col span={8}><Checkbox value="qualite">Fonction</Checkbox></Col>
            <Col span={8}><Checkbox value="fax">Fixe</Checkbox></Col>
            <Col span={8}><Checkbox value="emailc">Email</Checkbox></Col>
            <Col span={8}><Checkbox value="telephonec">Téléphone</Checkbox></Col>
            <Col span={8}><Checkbox value="raison_social">Compagnie</Checkbox></Col>
            <Col span={8}><Checkbox value="actions">Actions</Checkbox></Col>
          </Row>
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );

  const allColumns = [
    {
      title: <span style={{ color: '#607AD6' }}>Nom</span>,
      dataIndex: 'nomc',
      key: 'nomc',
      ...getColumnSearchProps('nomc'),
      render: (text, record) => (
        <span style={{ color: record.raison_social ? 'inherit' : '#ccc' }}>{text}</span>
      ),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Fonction</span>,
      dataIndex: 'qualite',
      key: 'qualite',
      ...getColumnSearchProps('qualite'),
      render: (text, record) => (
        <span style={{ color: record.raison_social ? 'inherit' : '#ccc' }}>{text}</span>
      ),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Fixe</span>,
      dataIndex: 'fax',
      key: 'fax',
      ...getColumnSearchProps('fax'),
      render: (text, record) => (
        <span style={{ color: record.raison_social ? 'inherit' : '#ccc' }}>{text}</span>
      ),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Email</span>,
      dataIndex: 'emailc',
      key: 'emailc',
      ...getColumnSearchProps('emailc'),
      render: (text, record) => (
        <span style={{ color: record.raison_social ? 'inherit' : '#ccc' }}>{text}</span>
      ),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Téléphone</span>,
      dataIndex: 'telephonec',
      key: 'telephonec',
      ...getColumnSearchProps('telephonec'),
      render: (text, record) => (
        <span style={{ color: record.raison_social ? 'inherit' : '#ccc' }}>{text}</span>
      ),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Compagnie</span>,
      dataIndex: 'raison_social',
      key: 'raison_social',
      ...getColumnSearchProps('raison_social'),
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <Link to={`/admin/Apercu/${record.id}`} style={{ textDecoration: 'none' }}>
                <span style={{ fontWeight: 'bold', color: '#F08080', marginLeft: 8 }}>{text}</span>
            </Link>
        </div>
    ),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Actions</span>,
      key: 'actions',
      render: (text, record) => (
        <Space size="middle">
          <Tooltip title="Modifier">
            <span className="compagnie-bg" onClick={() => handleEditContact(record)}>
              <EditOutlined style={{ color: '#7CFC00' }} />
            </span>
          </Tooltip>
          <Tooltip title="Supprimer">
            <span className="contact-bg" onClick={() => showModal(record)}>
              <UserDeleteOutlined style={{ color: '#FF0000' }} />
            </span>
          </Tooltip>
        </Space>
      ),
    },
    {
      title: (
        <Dropdown overlay={columnSelectionMenu} trigger={['click']} visible={columnSelectionMenuVisible} onVisibleChange={setColumnSelectionMenuVisible}>
          <SettingOutlined style={{ cursor: 'pointer' }} />
        </Dropdown>
      ),
      key: 'settings',
      align: 'center',
      width: 50,
    },
  ];

  const selectedColumnsConfig = allColumns.filter(column => selectedColumns.includes(column.key) || column.key === 'settings');

  return (
    <>
      {updateMessage && <Alert
        message="Mise à jour réussie"
        description="Le contact a été mis à jour avec succès."
        type="success"
        showIcon
        style={{ position: 'absolute', bottom: 20, right: 20 }}
      />}
      {errorupdateMessage && <Alert
        message="Échec de la mise à jour"
        description="La mise à jour du contact a échoué."
        type="error"
        showIcon
        style={{ position: 'absolute', bottom: 20, right: 20 }}
      />}
      {successMessage && <Alert
        message="Ajout réussi"
        description="Le contact a été ajouté avec succès."
        type="success"
        showIcon
        style={{ position: 'absolute', bottom: 20, right: 20 }}
      />}
      {errorsuccessMessage && <Alert
        message="Échec de l'ajout"
        description="L'ajout du contact a échoué."
        type="error"
        showIcon
        style={{ position: 'absolute', bottom: 20, right: 20 }}
      />}
      {cancelMessage && (
        <Alert
          message="Annulation"
          description={cancelMessage}
          type="info"
          showIcon
          style={{ position: 'absolute', bottom: 20, right: 20 }}
        />
      )}
      {alertVisible && <Alert
        message="Suppression réussie"
        description="Le contact a été supprimé avec succès."
        type="success"
        showIcon
        style={{ position: 'absolute', bottom: 20, right: 20 }}
      />}
      <div className="container">
        <br />
        <Row justify="end" gutter={[16, 16]}>
        <Link to={`/admin/Createcontact`}>
                            <Button type="primary" icon={<UserAddOutlined />} style={{ backgroundColor: "rgba(96, 122, 214, 0.70)" }}>AJOUTER</Button>
                        </Link>
        </Row>
        <br />
        <Table
          columns={selectedColumnsConfig}
          dataSource={contacts ? contacts.map((contact) => ({ ...contact, key: contact.id })) : []}
          pagination={{ pageSize: 5 }}
          size="small"
        />
      </div>
      {contactToDelete && (
        <Modal
          title="Confirmation"
          visible={modalVisible}
          onOk={deleteContact}
          onCancel={() => setModalVisible(false)}
        >
          <p>Êtes-vous sûr de vouloir supprimer ce contact ?</p>
        </Modal>
      )}
    </>
  );
}

export default Contact;
