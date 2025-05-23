import React, { useEffect, useState, useRef } from "react";
import { Table, Tag, Space, Tooltip, Alert, Modal, Input, Button, Checkbox, Dropdown, Menu, Row, Col } from "antd";

import { Link, useNavigate } from 'react-router-dom';
import { SearchOutlined, EditOutlined, DeleteOutlined, FolderAddOutlined, CloseCircleOutlined, UndoOutlined, SettingOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axiosInstance from "../../core/axiosConfig"

const Agences = () => {
    const [agences, setAgences] = useState([]);
    const [agenceIdToDelete, setAgenceIdToDelete] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [cancelMessage, setCancelMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [errorupdateMessage, setErrorupdateMessage] = useState('');
    const [errorsuccessMessage, setErrorsuccessMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [selectedColumns, setSelectedColumns] = useState(["noma", "raison_social", "adressea", "telephonea", "date_Debuta", "date_fina","status", "actions"]);
    const [columnSelectionMenuVisible, setColumnSelectionMenuVisible] = useState(false);
    const searchInput = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadAgences();
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

    async function rePartenariat(agenceId) {
        setAlertVisible(true);
        try {
            await axiosInstance.put(`http://localhost:8080/api/v1/agence/reestablishCompany/${agenceId}`);
            loadAgences();
            setTimeout(() => {
                setAlertVisible(false);
            }, 3000);
        } catch (error) {
            console.error("Error re-establishing partnership", error);
        }
    }

 /*   async function anuller(agenceId) {
        setAlertVisible(true);
        try {
            const response = await axiosInstance.put(`http://localhost:8080/api/v1/agence/removeCompany/${agenceId}`);
            setCompagnieIdBeforeCancellation(response.data);
            loadAgences();
            setTimeout(() => {
                setAlertVisible(false);
            }, 3000);
        } catch (error) {
            console.error("Error deleting point vente", error);
        }
    }*/

    async function loadAgences() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/agence/getall");
        setAgences(result.data);
    }

    function handleEditAgence(agence) {
        navigate("/admin/EditAg", { state: { agence } });
    }

    async function deleteAgence() {
        setAlertVisible(true);
        await axiosInstance.delete("http://localhost:8080/api/v1/agence/delete/" + agenceIdToDelete);
        loadAgences();
        setTimeout(() => {
            setAlertVisible(false);
        }, 3000);
    }

    async function modell(agenceId) {
        setModalVisible(true);
        setAgenceIdToDelete(agenceId);
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
                    <Row>
                        <Col span={8}><Checkbox value="noma">Raison social</Checkbox></Col>
                        <Col span={8}><Checkbox value="raison_social">Compagnie</Checkbox></Col>
                        <Col span={8}><Checkbox value="adressea">Adresse</Checkbox></Col>
                        <Col span={8}><Checkbox value="telephonea">Telephone</Checkbox></Col>
                        <Col span={8}><Checkbox value="date_Debuta">Date Debut</Checkbox></Col>
                        <Col span={8}><Checkbox value="date_fina">Date Fin</Checkbox></Col>
                        <Col span={8}><Checkbox value="status">Statut </Checkbox></Col>
                        <Col span={8}><Checkbox value="actions">Actions</Checkbox></Col>
                    </Row>
                </Checkbox.Group>
            </Menu.Item>
        </Menu>
    );

    const allColumns = [
        {
            title: <span style={{ color: '#607AD6' }}>Raison social</span>,
            dataIndex: 'noma',
            key: 'noma',
            ...getColumnSearchProps('noma'),
            render: (text, record) => (
                <span style={{ color: record.date_fina ? '#ccc' : 'inherit' }}>{text}</span>
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
            title: <span style={{ color: '#607AD6' }}>Adresse</span>,
            dataIndex: 'adressea',
            key: 'adressea',
            ...getColumnSearchProps('adressea'),
            render: (text, record) => (
                <span style={{ color: record.date_fina ? '#ccc' : 'inherit' }}>{text}</span>
            ),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Telephone</span>,
            dataIndex: 'telephonea',
            key: 'telephonea',
            ...getColumnSearchProps('telephonea'),
            render: (text, record) => (
                <span style={{ color: record.date_fina ? '#ccc' : 'inherit' }}>{text}</span>
            ),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Date Debut</span>,
            dataIndex: 'date_Debuta',
            key: 'date_Debuta',
            ...getColumnSearchProps('date_Debuta'),
            render: (text, record) => (
                <span style={{ color: record.date_fina ? '#ccc' : 'inherit' }}>{text}</span>
            ),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Date Fin</span>,
            dataIndex: 'date_fina',
            key: 'date_fina',
            ...getColumnSearchProps('date_fina'),
            render: (text, record) => (
                <span style={{ color: record.date_fina ? '#ccc' : 'inherit' }}>{text}</span>
            ),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Statut</span>,
            dataIndex: 'status',
            key: 'status',
            ...getColumnSearchProps('status'),
            render: (text) => (
                <Tag color={text.toUpperCase() === 'OUVERT' ? 'green' : 'red'}>
                    {text.toUpperCase()}
                </Tag>
            ),
        
        },
        {
            title: <span style={{ color: '#607AD6' }}>Actions</span>,
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Modifier">
                        <span className="compagnie-bg" onClick={() => handleEditAgence(record)}>
                            <EditOutlined style={{ color: '#228B22' }} />
                        </span>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <span className="compagnie-bg" onClick={() => modell(record.id)}>
                            <DeleteOutlined style={{ color: '#DC143C' }} />
                        </span>
                    </Tooltip>
                    <Tooltip title="Re-partenariat">
                        <span className="compagnie-bg">
                            <UndoOutlined style={{ color: '#FFA500' }} onClick={() => rePartenariat(record.id)} />
                        </span>
                    </Tooltip>
                    {modalVisible && (
                        <Modal
                            title="Confirmation"
                            open={modalVisible}
                            onOk={() => { deleteAgence(record.id); setModalVisible(false); }}
                            onCancel={() => setModalVisible(false)}
                        >
                            <p>Êtes-vous sûr de vouloir supprimer ce type ?</p>
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
    ];

    const selectedColumnsConfig = allColumns.filter(column => selectedColumns.includes(column.key) || column.key === 'settings');

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
                description="Error lorsque de Mise à jour."
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
                <br />
                <Row justify="end" gutter={[16, 16]}>
                   
                    <Col>
                        <Link to="/admin/createAg">
                            <Button type="primary" icon={<FolderAddOutlined />} style={{ backgroundColor: "rgba(96, 122, 214, 0.70)" }}>AJOUTER</Button>
                        </Link>
                    </Col>
                </Row>
                <br />
                <Table
                    columns={selectedColumnsConfig}
                    dataSource={agences ? agences.map((agence) => ({ ...agence, key: agence.id })) : []}
                    pagination={{ pageSize: 5 }}
                    size="small"
                />
            </div>
        </>
    );
}

export default Agences;
