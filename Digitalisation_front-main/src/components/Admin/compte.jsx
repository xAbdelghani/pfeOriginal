import React, { useEffect, useState, useRef } from "react";
import { Select ,Table, Tag, Space, Tooltip, Alert, Modal, Input, Button, Dropdown, Menu, Checkbox, Row, Col,Tabs  } from "antd";

import { Link, useNavigate } from 'react-router-dom';
import { SearchOutlined, UserAddOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FileTextOutlined, ContactsOutlined, SettingOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axiosInstance from "../../core/axiosConfig";

const Compte = () => {
    const [compagnies, setCompagnies] = useState([]);
   
    const [compagnieIdToDelete, setCompagnieIdToDelete] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [cancelMessage, setCancelMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [errorupdateMessage, setErrorupdateMessage] = useState('');
    const [errorsuccessMessage, setErrorsuccessMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const searchInput = useRef(null);
    const navigate = useNavigate();
    const [columnSelectionMenuVisible, setColumnSelectionMenuVisible] = useState(false);
   
    const [selectedColumns, setSelectedColumns] = useState(["raison_social", "nom", "actions"]);

    useEffect(() => {
        loadCompagnies();
    }, []);

    useEffect(() => {
        const message = localStorage.getItem('cancelMessage');
        if (message) {
            setCancelMessage(message);
            localStorage.removeItem('cancelMessage');
        }
        setTimeout(() => {
            setCancelMessage(false);
        }, 3000);
    }, []);

    useEffect(() => {
        const message = localStorage.getItem('successMessage');
        if (message) {
            setSuccessMessage(message);
            localStorage.removeItem('successMessage');
        }
        setTimeout(() => {
            setSuccessMessage(false);
        }, 3000);
    }, []);

    useEffect(() => {
        const message = localStorage.getItem('updateMessage');
        if (message) {
            setUpdateMessage(message);
            localStorage.removeItem('updateMessage');
        }
        setTimeout(() => {
            setUpdateMessage(false);
        }, 3000);
    }, []);

    useEffect(() => {
        const message = localStorage.getItem('errorupdateMessage');
        if (message) {
            setErrorupdateMessage(message);
            localStorage.removeItem('errorupdateMessage');
        }
        setTimeout(() => {
            setErrorupdateMessage(false);
        }, 3000);
    }, []);

    useEffect(() => {
        const message = localStorage.getItem('errorsuccessMessage');
        if (message) {
            setErrorsuccessMessage(message);
            localStorage.removeItem('errorsuccessMessage');
        }
        setTimeout(() => {
            setErrorsuccessMessage(false);
        }, 3000);
    }, []);

    async function loadCompagnies() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/compagnie/Login");
        setCompagnies(result.data);
      
    }

    async function deleteCompagnie() {
        setAlertVisible(true);
        await axiosInstance.put("http://localhost:8080/api/v1/compagnie/transfer/" + compagnieIdToDelete);
        loadCompagnies();
        setTimeout(() => {
            setAlertVisible(false);
        }, 3000);
    }

    async function modell(compagnieId) {
        setModalVisible(true);
        setCompagnieIdToDelete(compagnieId);
    }

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
                    <Checkbox value="raison_social">Compagnie</Checkbox>
                    <Checkbox value="nom">Nom</Checkbox>
                    <Checkbox value="actions">Actions</Checkbox>
                </Checkbox.Group>
            </Menu.Item>
        </Menu>
    );

    const columns = [
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
            title: <span style={{ color: '#607AD6' }}>Nom</span>,
            dataIndex: 'nom',
            key: 'nom',
            ...getColumnSearchProps('nom'),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Actions</span>,
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Supprimer">
                        <span className="compagnie-bg" onClick={() => modell(record.id)}>
                            <DeleteOutlined style={{ color: '#607AD6' }} />
                        </span>
                    </Tooltip>
                    {modalVisible && (
                        <Modal
                            title="Confirmation"
                            open={modalVisible}
                            onOk={() => { deleteCompagnie(record.id); setModalVisible(false) }}
                            onCancel={() => setModalVisible(false)}
                        >
                            <p>Êtes-vous sûr de vouloir supprimer cette compagnie ?</p>
                        </Modal>
                    )}
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
    ]; const selectedColumnsConfig = columns.filter(column => selectedColumns.includes(column.key) || column.key === 'settings');
    

   

    return (
        <>
            {updateMessage && <Alert
                message="Success Update"
                description="Mise à jour description and advice about successful copywriting."
                type="success"
                showIcon
                style={{ position: 'absolute', bottom: 20, right: 20 }}
            />}
            {errorupdateMessage && <Alert
                message="Echec de modification"
                description="Error lorsque de Mise à jour ."
                type="error"
                showIcon
                style={{ position: 'absolute', bottom: 20, right: 20 }}
            />}
            {successMessage && <Alert
                message="Success Submit"
                description="Ajoute description and advice about successful copywriting."
                type="success"
                showIcon
                style={{ position: 'absolute', bottom: 20, right: 20 }}
            />}
            {errorsuccessMessage && <Alert
                message="Error Submit"
                description="Ajoute description and advice about successful copywriting."
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
                message="Success Delete"
                description="Detailed description and advice about successful copywriting."
                type="success"
                showIcon
                style={{ position: 'absolute', bottom: 20, right: 20 }}
            />}
            <div className="container">
                <br/>
                <Row justify="end" gutter={[17, 16]}>
                   
                    <Col>
                        <Link to="/admin/CreateCompte"> 
                            <Button type="primary" icon={<UserAddOutlined /> } style={{backgroundColor:"rgba(96, 122, 214, 0.70)"}}>AJOUTER</Button>
                        </Link>
                    </Col>
                </Row>
                <br />
               
                <Table
    columns={columns}
    dataSource={compagnies ? compagnies.map((compagnie) => ({ ...compagnie, key: compagnie.id })) : []}
    pagination={{ pageSize: 5 }}
     size="small"
/>
            </div>
        </>
    );
}

export default Compte;
