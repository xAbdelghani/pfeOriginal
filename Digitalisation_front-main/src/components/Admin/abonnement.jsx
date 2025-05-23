import React, { useEffect, useState, useRef } from "react";
import { Table, Tag, Space, Tooltip, Alert, Modal, Input, Button } from "antd";

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, AppstoreAddOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axiosInstance from "../../core/axiosConfig";

const Abonnements = () => {
    const [abonnements, setAbonnements] = useState([]);
    const [filteredAbonnements, setFilteredAbonnements] = useState([]);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const [filterTypes, setFilterTypes] = useState(null);
    const [abonnementIdToDelete, setAbonnementIdToDelete] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [cancelMessage, setCancelMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [errorupdateMessage, setErrorupdateMessage] = useState('');
    const [errorsuccessMessage, setErrorsuccessMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [compagnies, setCompagnies] = useState({});
    const [selectedAbonnement, setSelectedAbonnement] = useState(null);

    const searchInput = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const tyavance = location.state;

    useEffect(() => {
        loadAbonnements();
        const filter = tyavance ? (tyavance.Avance ? 'AVANCE' : 'Caution') : null;
        setFilterTypes(filter);
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

    const loadAbonnements = async () => {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/abonnement/getall");
        const groupedData = result.data.reduce((acc, abonnement) => {
            // Extract the latest libellep from statutHistorique
            const latestLibellep = abonnement.statutHistorique
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(hist => hist.libellep)[0] || 'N/A';
            
            // Add the latest libellep to the abonnement object
            const abonnementWithLibellep = { ...abonnement, latestLibellep };
            
            if (!acc[abonnement.compagnieId]) {
                acc[abonnement.compagnieId] = {
                    compagnieId: abonnement.compagnieId,
                    raison_social: abonnement.raison_social,
                    abonnements: []
                };
            }
            acc[abonnement.compagnieId].abonnements.push(abonnementWithLibellep);
            return acc;
        }, {});
        setAbonnements(Object.values(groupedData));
        setFilteredAbonnements(Object.values(groupedData)); // Initial setting to display all abonnements
    };

    function handleEditAbonnement(abonnement) {
        navigate("/admin/EditAb", { state: { abonnement } });
    }

    async function deleteAbonnement() {
        setAlertVisible(true);
        await axiosInstance.delete("http://localhost:8080/api/v1/abonnement/delete/" + abonnementIdToDelete);
        loadAbonnements();
        setTimeout(() => {
            setAlertVisible(false);
        }, 3000);
    }

    async function modell(abonnementId) {
        setModalVisible(true);
        setAbonnementIdToDelete(abonnementId);
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

    useEffect(() => {
        filterAbonnements(filterTypes);
    }, [filterTypes, abonnements]);

    function filterAbonnements(libelle) {
        if (libelle === "AVANCE") {
            setFilteredAbonnements(
                abonnements.filter(compagnie => 
                    compagnie.abonnements.some(abonnement => abonnement.libelle === "Avance")
                )
            );
        } else if (libelle === 'Caution') {
            setFilteredAbonnements(
                abonnements.filter(compagnie => 
                    compagnie.abonnements.some(abonnement => abonnement.libelle === 'Caution')
                )
            );
        } else if (libelle === 'PREPAIEMENT') {
            navigate('/admin/solde');
        } else {
            setFilteredAbonnements(abonnements);
        }
    }

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

    const handleExpand = (expanded, record) => {
        const keys = expanded ? [...expandedRowKeys, record.compagnieId] : expandedRowKeys.filter(key => key !== record.compagnieId);
        setExpandedRowKeys(keys);
    };

    const expandedRowRender = (record) => ( 
        <Table
            columns={[
                {
                    title: 'Type Abonnement',
                    dataIndex: 'libelle',
                    key: 'libelle',
                    ...getColumnSearchProps('libelle'),
                    render: (text) => <span style={{ fontWeight: 'bold', color: '#6495ED' }}>{text}</span>,
                },
                {
                    title: 'Date Abonnement',
                    dataIndex: 'date_Abonnement',
                    key: 'date_Abonnement',
                    ...getColumnSearchProps('date_Abonnement'),
                },
                {
                    title: 'Date Fin',
                    dataIndex: 'date_Fin',
                    key: 'date_Fin',
                    ...getColumnSearchProps('date_Fin'),
                },
                {
                    title: 'Montant',
                    dataIndex: 'montant',
                    key: 'montant',
                    ...getColumnSearchProps('montant'),
                    render: (montant, record) => (
                        <span>
                            {montant !== null ? montant.toFixed(2) : 'N/A'} {record.devise}
                        </span>
                    ),
                },
                {
                    title: 'Statut',
                    dataIndex: 'latestLibellep', // Changed to use latestLibellep
                    key: 'latestLibellep',
                    ...getColumnSearchProps('latestLibellep'),
                    render: (text) => (
                        <Tag color={text.toUpperCase() === 'ACTIF' ? 'green' : 'red'}>
                            {text.toUpperCase()}
                        </Tag>
                    ),
                },
                {
                    title: 'Actions',
                    key: 'actions',
                    render: (text, record) => (
                        <Space size="middle">
                            <Tooltip title="Modifier">
                                <span className="compagnie-bg" onClick={() => handleEditAbonnement(record)}>
                                    <EditOutlined style={{ color: '#607AD6' }} />
                                </span>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                                <span className="compagnie-bg" onClick={() => modell(record.id)}>
                                    <DeleteOutlined style={{ color: '#607AD6' }} />
                                </span>
                            </Tooltip>
                            <Tooltip title="Aperçu">
                                <Link to={`/admin/viewAbonnement/${record.id}`}>
                                    <EyeOutlined style={{ color: '#607AD6' }} />
                                </Link>
                            </Tooltip>
                        </Space>
                    ),
                },
            ]}
            dataSource={record.abonnements}
            pagination={false}
            bordered
            style={{ margin: '20px 0', background: '#f5f5f5', borderRadius: '8px' }}
        />
    );

    const columns = [
        {
            title: 'Compagnie',
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
    ];

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
                <br />
                <div className="row justify-content-end">
                    <div className="col-lg-2">
                        <Link to="/admin/createAb">
                            <span className="btn btn-sm mb-3 custom-btn-color" style={{ color: '#ffffff',marginLeft:"50%",backgroundColor:"rgba(96, 122, 214, 0.70)"  }}>
                                <AppstoreAddOutlined style={{ color: '#ffffff' }} /> AJOUTER
                            </span>
                        </Link>
                    </div>
                </div>
                <br />
                <div style={{ marginBottom: 16 ,marginLeft:"37%" }}>
                    <Button
                        onClick={() => setFilterTypes('AVANCE')}
                        style={{
                            backgroundColor: filterTypes === 'AVANCE' ? 'rgba(96, 122, 214, 0.7)' : 'transparent',
                            color: filterTypes === 'AVANCE' ? '#ffffff' : 'rgba(96, 122, 214, 0.80)',
                            marginRight: 8,
                        }}
                    >
                        AVANCE
                    </Button>
                    <Button
                        onClick={() => setFilterTypes('Caution')}
                        style={{
                            backgroundColor: filterTypes === 'Caution' ? 'rgba(96, 122, 214, 0.7)' : 'transparent',
                            color: filterTypes === 'Caution' ? '#ffffff' : 'rgba(96, 122, 214, 0.80)',
                            marginRight: 8,
                        }}
                    >
                        CAUTION
                    </Button>
                    <Button
                        onClick={() => setFilterTypes(null)}
                        style={{
                            backgroundColor: filterTypes === null ? 'rgba(96, 122, 214, 0.7)' : 'transparent',
                            color: filterTypes === null ? '#ffffff' : 'rgba(96, 122, 214, 0.80)',
                            marginRight: 8,
                        }}
                    >
                        TOUT
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={filteredAbonnements.map((abonnement) => ({ ...abonnement, key: abonnement.compagnieId }))}
                    expandedRowKeys={expandedRowKeys}
                    onExpand={handleExpand}
                    expandedRowRender={expandedRowRender}
                    pagination={{ pageSize: 4 }}
                    size="middle"
                    bordered
                    className="custom-table"
                />
                {modalVisible && (
                    <Modal
                        title="Confirmation"
                        open={modalVisible}
                        onOk={deleteAbonnement}
                        onCancel={() => setModalVisible(false)}
                    >
                        <p>Êtes-vous sûr de vouloir supprimer cette compagnie ?</p>
                    </Modal>
                )}
            </div>
        </>
    );
}

export default Abonnements;
