import React, { useEffect, useState, useRef } from "react";
import { Select, Table, Tag, Space, Tooltip, Alert, Modal, Input, Button, Dropdown, Menu, Checkbox, Row, Col, Tabs } from "antd";
import { Link, useNavigate } from 'react-router-dom';
import { SearchOutlined, UserAddOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FileTextOutlined, ContactsOutlined, SettingOutlined, UnorderedListOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import axiosInstance from "../../core/axiosConfig";

const Compagnies = () => {
    const [compagnies, setCompagnies] = useState([]);
    const [filteredCompagnies, setFilteredCompagnies] = useState([]);
    const [filterStatus, setFilterStatus] = useState(null);
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
    const [filteredAbonnements, setFilteredAbonnements] = useState([]);
    const [filterTypes, setFilterTypes] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState(["raison_social", "email", "telephone", "adresse", "statut", "actions", "moreActions"]);
    const [nom, setNom] = useState(''); 
    const [selectedCompagnieId, setSelectedCompagnieId] = useState(null); 
    const [modalAccountVisible, setModalAccountVisible] = useState(false);

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
        const result = await axiosInstance.get("http://localhost:8080/api/v1/compagnie/getall");
        setCompagnies(result.data);
        setFilteredCompagnies(result.data); 
    }

    useEffect(() => {
        filterCompagnies(filterStatus);
    }, [filterStatus, compagnies]);

    function filterCompagnies(status) {
        if (status === "ACTIVE") {
            setFilteredCompagnies(compagnies.filter(compagnie => {
                const isAbonnementActif = compagnie.abonnement && compagnie.abonnement.some(abonnement => abonnement.statut === "Actif");
                const isSoldePrepayeActif = compagnie.soldePrepayeDto && compagnie.soldePrepayeDto.some(solde => solde.statut === "Actif");
                return isAbonnementActif || isSoldePrepayeActif;
            }));
        } else if (status === 'INACTIVE') {
            setFilteredCompagnies(compagnies.filter(compagnie => {
                const isAbonnementInactif = compagnie.abonnement && compagnie.abonnement.every(abonnement => abonnement.statut !== "Actif");
                const isSoldePrepayeInactif = compagnie.soldePrepayeDto && compagnie.soldePrepayeDto.every(solde => solde.statut !== "Actif");
                return isAbonnementInactif && isSoldePrepayeInactif;
            }));
        } else if (status === 'SANS_ABONNNEMENT') {
            setFilteredCompagnies(compagnies.filter(compagnie => !compagnie.abonnement || compagnie.abonnement.length === 0));
        } else {
            setFilteredCompagnies(compagnies);
        }
    }

    function handleEditCompagnie(compagnie) {
        navigate("/admin/Edit", { state: { compagnie } });
    }

    async function deleteCompagnie() {
        setAlertVisible(true);
        await axiosInstance.delete("http://localhost:8080/api/v1/compagnie/delete/" + compagnieIdToDelete);
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

    function viewContacts(compagnieId){
        navigate(`/admin/contacts/${compagnieId}`);
    }

    function viewFactures(compagnieId){
        navigate(`/admin/factures/${compagnieId}`);
    }

    function view(compagnieId){
        navigate(`/admin/Apercu/${compagnieId}`);
    }

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

    const handleAccountModalOpen = (compagnieId) => {
        setSelectedCompagnieId(compagnieId);
        setModalAccountVisible(true);
    };

    const handleAccountModalOk = async () => {
        if (selectedCompagnieId && nom) {
            try {
                await axiosInstance.put(`http://localhost:8080/api/v1/compagnie/update-login/${selectedCompagnieId}`, { nom });
                setSuccessMessage('Le login a été mis à jour et un nouveau mot de passe a été envoyé par email.');
                setModalAccountVisible(false);
            } catch (error) {
                setErrorupdateMessage('Erreur lors de la mise à jour du login.');
            }
        }
    };

    const handleAccountModalCancel = () => {
        setModalAccountVisible(false);
    };

    const handleColumnChange = (checkedValues) => {
        setSelectedColumns(checkedValues);
    };

    const columnSelectionMenu = (
        <Menu>
            <Menu.Item>
                <Checkbox.Group value={selectedColumns} onChange={handleColumnChange}>
                    <Checkbox value="raison_social">Raison sociale</Checkbox>
                    <Checkbox value="email">Email</Checkbox>
                    <Checkbox value="telephone">Telephone</Checkbox>
                    <Checkbox value="adresse">Adresse</Checkbox>
                    <Checkbox value="statut">Statut</Checkbox>
                    <Checkbox value="actions">Actions</Checkbox>
                    <Checkbox value="moreActions">Plus d'actions</Checkbox>
                </Checkbox.Group>
            </Menu.Item>
        </Menu>
    );

    const moreActionsMenu = (record) => (
        <Menu>
            <Menu.Item key="facture">
                <Tooltip title="Voir factures">
                    <FileTextOutlined style={{ color: '#607AD6' }} onClick={() => viewFactures(record.id)} />
                </Tooltip>
            </Menu.Item>
            <Menu.Item key="contact">
                <Tooltip title="Voir contacts">
                    <ContactsOutlined style={{ color: '#607AD6' }} onClick={() => viewContacts(record.id)} />
                </Tooltip>
            </Menu.Item>
            <Menu.Item key="account">
                <Tooltip title="Creercompte">
                    <UserAddOutlined
                        style={{ color: record.nom !== null ? 'gray' : '#607AD6', cursor: record.nom !== null ? 'not-allowed' : 'pointer' }}
                        onClick={record.nom !== null ? null : () => handleAccountModalOpen(record.id)}
                    />
                </Tooltip>
            </Menu.Item>
        </Menu>
    );

    const columns = [
        {
            title: <span style={{ color: '#607AD6' }}>Raison sociale</span>,
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
            title: <span style={{ color: '#607AD6' }}>Email</span>,
            dataIndex: 'email',
            key: 'email',
            ...getColumnSearchProps('email'),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Telephone</span>,
            dataIndex: 'telephone',
            key: 'telephone',
            ...getColumnSearchProps('telephone'),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Adresse</span>,
            dataIndex: 'adresse',
            key: 'adresse',
            ...getColumnSearchProps('adresse'),
        },
        {/*
            title: <span style={{ color: '#607AD6' }}>Statut</span>,
            dataIndex: "statut",
            key: "statut",
            ...getColumnSearchProps("statut"),
            render: (text, record) => {
                const isAbonnementActif = record.abonnement && record.abonnement.some(abonnement => abonnement.statut === "Actif");
                const isSoldePrepayeActif = record.soldePrepayeDto && record.soldePrepayeDto.some(solde => solde.statut === "Actif");
                const isActive = isAbonnementActif || isSoldePrepayeActif;
                
                return (
                    <Tag color={isActive ? "green" : "red"}>
                        {isActive ? "ACTIVE" : "INACTIVE"}
                    </Tag>
                );
            }, 
        */},
       
        {
            title: <span style={{ color: '#607AD6' }}>Actions</span>,
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Aperçu">
                        <EyeOutlined style={{ color: '#607AD6' }} onClick={() => view(record.id)} />
                    </Tooltip>
                    <Tooltip title="Modifier">
                        <EditOutlined style={{ color: '#607AD6' }} onClick={() => handleEditCompagnie(record)} />
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <DeleteOutlined style={{ color: '#607AD6' }} onClick={() => modell(record.id)} />
                    </Tooltip>
                    <Dropdown overlay={moreActionsMenu(record)}>
                    
                    <Tooltip title="Autres actions">
                    <UnorderedListOutlined   style={{ fontSize: '11px',color:"#607AD6" }}/>
                    </Tooltip>
                
                </Dropdown>
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
            {updateMessage && <Alert
                message="Success Update"
                description="Mise à jour description and advice about successful copywriting."
                type="success"
                showIcon
                style={{ position: 'absolute', bottom: 20, right: 20 }}
            />}
            {errorupdateMessage && <Alert
                message="Echec de modification"
                description="Erreur lors de la Mise à jour."
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
             {modalVisible && (
                <Modal
                    title="Confirmation"
                    open={modalVisible}
                    onOk={deleteCompagnie}
                    onCancel={() => setModalVisible(false)}
                >
                    <p>Êtes-vous sûr de vouloir supprimer cette compagnie ?</p>
                </Modal>
            )}
            <div className="container">
                <br/>
                <Row justify="end" gutter={[17, 16]}>
                    <Col>
                        <Link to="/admin/create"> 
                            <Button type="primary" icon={<UserAddOutlined /> } style={{backgroundColor:"rgba(96, 122, 214, 0.70)"}}>AJOUTER</Button>
                        </Link>
                    </Col>
                </Row>
                <br />
                {/*
                <div style={{ marginBottom: 16, marginLeft: "37%" }}>
                    <Button
                        onClick={() => setFilterStatus('ACTIVE')}
                        style={{
                            backgroundColor: filterStatus === 'ACTIVE' ? 'rgba(96, 122, 214, 0.95)' : 'transparent',
                            color: filterStatus === 'ACTIVE' ? '#ffffff' : 'rgba(96, 122, 214, 0.80)',
                            marginRight: 8,
                        }}
                    >
                        ACTIVE
                    </Button>
                    <Button
                        onClick={() => setFilterStatus('INACTIVE')}
                        style={{
                            backgroundColor: filterStatus === 'INACTIVE' ? 'rgba(96, 122, 214, 0.95)' : 'transparent',
                            color: filterStatus === 'INACTIVE' ? '#ffffff' : 'rgba(96, 122, 214, 0.80)',
                            marginRight: 8,
                        }}
                    >
                        INACTIVE
                    </Button>
                    <Button
                        onClick={() => setFilterStatus(null)}
                        style={{
                            backgroundColor: filterStatus === null ? 'rgba(96, 122, 214, 0.95)' : 'transparent',
                            color: filterStatus === null ? '#ffffff' : 'rgba(96, 122, 214, 0.80)',
                            marginRight: 8,
                        }}
                    >
                        TOUT
                    </Button>
                </div>*/ }
                <Table
                    columns={selectedColumnsConfig}
                    dataSource={filteredCompagnies ? filteredCompagnies.map((compagnie) => ({ ...compagnie, key: compagnie.id })) : []}
                    pagination={{ pageSize: 8 }}
                    size="small"
                />
            </div>
            {modalAccountVisible && (
                <Modal
                    title="Creer compte"
                    visible={modalAccountVisible}
                    onOk={handleAccountModalOk}
                    onCancel={handleAccountModalCancel}
                >
                    <Input
                        placeholder="Nouveau login"
                        value={nom}
                        onChange={(e) => setNom(e.target.value)}
                    />
                </Modal>
            )}
        </>
    );
}

export default Compagnies;
