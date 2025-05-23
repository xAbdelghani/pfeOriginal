// src/components/ModeleVehicules.js

import React, { useEffect, useState, useRef } from "react";
import { Table, Dropdown, Space, Tooltip, Alert, Modal, Input, Button, Drawer,Checkbox,Menu, Row, Col } from "antd";
import axiosInstance from "../../core/axiosConfig";
import { Link, useNavigate } from 'react-router-dom';
import { SearchOutlined, EditOutlined, DeleteOutlined, MenuUnfoldOutlined, SettingOutlined  } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const ModeleVehicules = () => {
    const [modelevehicules, setModelevehicules] = useState([]);
    const [modelevehiculeIdToDelete, setModelevehiculeIdToDelete] = useState(null);
    const [modelevehiculeId, setId] = useState('');
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
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drawerData, setDrawerData] = useState([]);
    const [vehiculeIdToDelete, setVehiculeIdToDelete] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState(["designation", "type", "marque", "annee", "puissanceFiscale", "carburant", "actions"]);
    const [columnSelectionMenuVisible, setColumnSelectionMenuVisible] = useState(false);

    useEffect(() => {
        loadmodelevehicules();
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

    async function loadmodelevehicules() {
        try {
            const result = await axiosInstance.get("http://localhost:8080/api/v1/modele/getall");
            setModelevehicules(result.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des modèles de véhicules :", error);
        }
    }

    const fetchVehicules = async (modeleVehiculeId) => {
        try {
            const response = await axiosInstance.get(`http://localhost:8080/api/v1/vehicule/modele/${modeleVehiculeId}`);
            setDrawerData(response.data);
            setDrawerVisible(true);
        } catch (error) {
            console.error("Erreur lors de la récupération des véhicules :", error);
        }
    };

    const showDrawer = (record) => {
        fetchVehicules(record.id);
    };

    function handleEditmodelevehicule(modelevehicule) {
        navigate("/admin/EditM", { state: { modelevehicule } });
    }

    async function deletemodelevehicule() {
        setAlertVisible(true);
        await axiosInstance.delete("http://localhost:8080/api/v1/modele/delete/" + modelevehiculeIdToDelete);
        loadmodelevehicules();
        setTimeout(() => {
            setAlertVisible(false);
        }, 3000);
    }

    function handleEditvehicule(vehicule) {
        navigate("/admin/EditV", { state: { vehicule } });
    }

    async function deletevehicule() {
        setAlertVisible(true);
        await axiosInstance.delete("http://localhost:8080/api/v1/vehicule/delete/" + vehiculeIdToDelete);
        setTimeout(() => {
            setAlertVisible(false);
        }, 3000);
    }

    async function modell(modelevehiculeId) {
        setModalVisible(true);
        setModelevehiculeIdToDelete(modelevehiculeId);
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
    const handleColumnChange = (checkedValues) => {
        setSelectedColumns(checkedValues);
    };
    const columnSelectionMenu = (
        <Menu>
            <Menu.Item>
                <Checkbox.Group value={selectedColumns} onChange={handleColumnChange}>
                    <Row>
                        <Col span={7}><Checkbox value="designation">Designation</Checkbox></Col>
                        <Col span={7}><Checkbox value="type">Type</Checkbox></Col>
                        <Col span={7}><Checkbox value="marque">Marque</Checkbox></Col>
                        <Col span={7}><Checkbox value="annee">Annee</Checkbox></Col>
                        <Col span={7}><Checkbox value="puissanceFiscale">Puissance Fiscale</Checkbox></Col>
                        <Col span={7}><Checkbox value="carburant">Carburant</Checkbox></Col>
                        <Col span={7}><Checkbox value="actions">Actions</Checkbox></Col>
                    </Row>
                </Checkbox.Group>
            </Menu.Item>
        </Menu>
    );


    const columns = [
        {
            title: <span style={{ color: '#607AD6' }}>Designation</span>,
            dataIndex: 'designation',
            key: 'designation',
            ...getColumnSearchProps('designation'),
            onCell: (record) => ({
                onClick: () => showDrawer(record),
            }),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Type</span>,
            dataIndex: 'type',
            key: 'type',
            ...getColumnSearchProps('type'),
            onCell: (record) => ({
                onClick: () => showDrawer(record),
            }),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Marque</span>,
            dataIndex: 'marque',
            key: 'marque',
            ...getColumnSearchProps('marque'),
            onCell: (record) => ({
                onClick: () => showDrawer(record),
            }),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Annee</span>,
            dataIndex: 'annee',
            key: 'annee',
            ...getColumnSearchProps('annee'),
            onCell: (record) => ({
                onClick: () => showDrawer(record),
            }),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Puissance Fiscale</span>,
            dataIndex: 'puissanceFiscale',
            key: 'puissanceFiscale',
            ...getColumnSearchProps('puissanceFiscale'),
            onCell: (record) => ({
                onClick: () => showDrawer(record),
            }),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Carburant</span>,
            dataIndex: 'carburant',
            key: 'carburant',
            ...getColumnSearchProps('carburant'),
            onCell: (record) => ({
                onClick: () => showDrawer(record),
            }),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Actions</span>,
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Supprimer">
                        <span className="compagnie-bg" onClick={() => modell(record.id)}>
                            <DeleteOutlined style={{ color: '#DC143C' }} />
                        </span>
                    </Tooltip>
                    <Tooltip title="Liste vehicule">
                        <span className="compagnie-bg" onClick={() => showDrawer(record)}>
                            <MenuUnfoldOutlined style={{ color: '#607AD6' }} />
                        </span>
                    </Tooltip>
                    {modalVisible && (
                        <Modal
                            title="Confirmation"
                            open={modalVisible}
                            onOk={() => { deletemodelevehicule(record.id); setModalVisible(false); }}
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
    const selectedColumnsConfig = columns.filter(column => selectedColumns.includes(column.key) || column.key === 'settings');
    return (
        <>
            {updateMessage && (
                <Alert
                    message="Success Update"
                    description="Mise à jour description and advice about successful copywriting."
                    type="success"
                    showIcon
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            )}
            {errorupdateMessage && (
                <Alert
                    message="Echec de modification"
                    description="Error lors de la mise à jour."
                    type="error"
                    showIcon
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            )}
            {successMessage && (
                <Alert
                    message="Success Submit"
                    description="Ajoute description and advice about successful copywriting."
                    type="success"
                    showIcon
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            )}
            {errorsuccessMessage && (
                <Alert
                    message="Error Submit"
                    description="Ajoute description and advice about successful copywriting."
                    type="error"
                    showIcon
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            )}
            {cancelMessage && (
                <Alert
                    message="Annulation"
                    description={cancelMessage}
                    type="info"
                    showIcon
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            )}
            {alertVisible && (
                <Alert
                    message="Success Delete"
                    description="Detailed description and advice about successful copywriting."
                    type="success"
                    showIcon
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            )}
            <div className="container">
                <br />
                <br />
                <Table
                    columns={selectedColumnsConfig}
                    dataSource={Array.isArray(modelevehicules) ? modelevehicules.map((modelevehicule) => ({ ...modelevehicule, key: modelevehicule.id })) : []}
                    pagination={{ pageSize: 25 }}
                    size="small"
                />
                <Drawer
                    title="Liste des Vehicules"
                    width={800}
                    onClose={() => setDrawerVisible(false)}
                    visible={drawerVisible}
                >
                    <Table
                        columns={[
                            {
                                title: <span style={{ color: '#607AD6' }}>Immatriculation</span>,
                                dataIndex: 'immatriculation',
                                key: 'immatriculation',
                                ...getColumnSearchProps('immatriculation'),
                            },
                            {
                                title: <span style={{ color: '#607AD6' }}>Date Immatriculation</span>,
                                dataIndex: 'date_Immatriculation',
                                key: 'date_Immatriculation',
                                ...getColumnSearchProps('date_Immatriculation'),
                            },
                            {
                                title: <span style={{ color: '#607AD6' }}>Actions</span>,
                                key: 'actions',
                                render: (text, record) => (
                                    <Space size="middle">
                                        <Tooltip title="Supprimer">
                                            <span className="compagnie-bg" onClick={() => modell(record.id)}>
                                                <DeleteOutlined style={{ color: '#DC143C' }} />
                                            </span>
                                        </Tooltip>
                                        {modalVisible && (
                                            <Modal
                                                title="Confirmation"
                                                open={modalVisible}
                                                onOk={() => { deletevehicule(record.id); setModalVisible(false); }}
                                                onCancel={() => setModalVisible(false)}
                                            >
                                                <p>Êtes-vous sûr de vouloir supprimer ce type ?</p>
                                            </Modal>
                                        )}
                                    </Space>
                                ),
                            },
                        ]}
                        dataSource={drawerData}
                        pagination={{ pageSize: 7 }}
                        size="small"
                    />
                </Drawer>
            </div>
        </>
    );
};

export default ModeleVehicules;
