import React, { useEffect, useState, useRef } from "react";
import { Table, Select, Space, Tooltip, Alert, Modal, Input, Button, Dropdown, Menu, Checkbox, Row, Col, Drawer } from "antd";
import axiosInstance from "../../core/axiosConfig";
import { Link, useNavigate } from 'react-router-dom';
import { SearchOutlined, PlusCircleOutlined, EditOutlined, MinusCircleOutlined, MenuUnfoldOutlined, PauseOutlined, SettingOutlined, HistoryOutlined, CloseOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import "./model.css";
import 'react-phone-input-2/lib/style.css';

const Pointventes = () => {
    const [compagnieId, setCompagnieId] = useState('');
    const [dateDebut, setDateDebut] = useState(null);
    const [dateFin, setDateFin] = useState(null);

    const [pointventes, setPointventes] = useState([]);
    const [statutCId, setStatutCId] = useState('');
    const [statutCs, setStatutCs] = useState([]);
    const [pointventeId, setPointventeId] = useState('');
    const [pointventeIdToDelete, setPointventeIdToDelete] = useState(null);
    const [pointIdToDelete, setPointIdToDelete] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [cancelMessage, setCancelMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [updateMessage, setUpdateMessage] = useState('');
    const [errorupdateMessage, setErrorupdateMessage] = useState('');
    const [errorsuccessMessage, setErrorsuccessMessage] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisibl, setModalVisibl] = useState(false);
    const [modalVisibll, setModalVisibll] = useState(false);
    const [raison, setRaison] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');

    const [selectedCompagnies, setSelectedCompagnies] = useState([]);
    const [compagnies, setCompagnies] = useState([]);
    const [modalVisiblee, setModalVisiblee] = useState(false);
    const [addCompagnieModalVisible, setAddCompagnieModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [selectedColumns, setSelectedColumns] = useState(["nomp", "emailp", "telephonep", "actions"]);
    const [historyModalVisible, setHistoryModalVisible] = useState(false);
    const [historique, setHistorique] = useState([]);
    const [statusHistoryModalVisible, setStatusHistoryModalVisible] = useState(false);
    const [selectedStatusHistory, setSelectedStatusHistory] = useState([]);
    const [isNewPointvente, setIsNewPointvente] = useState(true);
    const [columnSelectionMenuVisible, setColumnSelectionMenuVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [drawerData, setDrawerData] = useState([]);
    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmRecord, setConfirmRecord] = useState(null);
    const [confirmTitle, setConfirmTitle] = useState('');
    const [confirmContent, setConfirmContent] = useState('');

    const { Option } = Select;
    const searchInput = useRef(null);
    const navigate = useNavigate();
    const defaultStatutC = statutCs.find(statutC => statutC.libellec === "En cours");
    const defaultStatutCId = defaultStatutC ? defaultStatutC.id : null;

    useEffect(() => {
        if (defaultStatutCId) {
            setStatutCId(defaultStatutCId);
        }
    }, [defaultStatutCId]);
    useEffect(() => {

        loadPointventes();
        loadStatutCs();
        load()
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
    const fetchActiveCompagnies = async (pointventeId) => {
        try {
            const response = await axiosInstance.get(`http://localhost:8080/api/v1/relationcp/getCompagniesByPointvente/${pointventeId}`);
            setDrawerData(response.data);
            setDrawerVisible(true);
            console.log(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des compagnies actives :", error);
        }
    };

    const showStatusHistory = (statutHistoriqueC) => {
        setSelectedStatusHistory(statutHistoriqueC);
        setStatusHistoryModalVisible(true);
    };
    async function loadStatutCs() {
        try {
            const result = await axiosInstance.get("http://localhost:8080/api/v1/statutC/getall");
            setStatutCs(result.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des types d'abonnement:", error);
        }
    }
    async function load() {
        try {
            const result = await axiosInstance.get("http://localhost:8080/api/v1/relationcp/getall");
            setStatutCs(result.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des types d'abonnement:", error);
        }
    }

    const showAddCompagnieModal = async (pointventeId) => {
        setPointventeId(pointventeId);
        try {
            const existingRelationsResponse = await axiosInstance.get(`http://localhost:8080/api/v1/relationcp/getCompagniesNonLiees/${pointventeId}`);
            const existingRelations = existingRelationsResponse.data;

            if (existingRelations.length > 0) {
                setIsNewPointvente(false);
                setCompagnies(existingRelations);
            } else {
                setIsNewPointvente(true);
                const result = await axiosInstance.get(`http://localhost:8080/api/v1/compagnie/getall`);
                setCompagnies(result.data);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération des compagnies non liées:", error);
        }
        setAddCompagnieModalVisible(true);
    };

    const handleAddCompagnie = async () => {
        try {
            await axiosInstance.post(`http://localhost:8080/api/v1/relationcp/save/${statutCId}`, {
                compagnie: { id: compagnieId },
                pointvente: { id: pointventeId },
                dateDebut,
                dateFin,
                active: true,
                status: statutCId
            });
            localStorage.setItem('successMessage', 'La nouvelle compagnie a été sauvegardée avec succès.');
            loadPointventes();
        } catch (error) {
            console.error("Erreur lors de l'ajout de la compagnie :", error);
        }
        setAddCompagnieModalVisible(false);
    };

    async function loadPointventes() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/pointvente/getall");
        const pointventesWithStatus = result.data.map(pointvente => {
            pointvente.relationPointventeCompagnieDto = pointvente.relationPointventeCompagnieDto.map(relation => {
                const today = moment().startOf('day');
                const dateFin = moment(relation.dateFin).startOf('day');
                relation.status = dateFin.isBefore(today) ? 'Terminée' : relation.active ? 'En cours' : 'Suspendue';
                return relation;
            });
            return pointvente;
        });
        setPointventes(pointventesWithStatus);
    }

    async function handleSuspend(recordId) {
        setSelectedId(recordId);
        setModalVisibll(true);
    }

    async function handleSuspendConfirm() {
        console.log(selectedId);

        if (selectedId !== null && raison) {
            try {
                const { data: statuses } = await axiosInstance.get('http://localhost:8080/api/v1/statutC/getall');
                const expireeStatus = statuses.find(status => status.libellec === 'Suspendu');

                if (!expireeStatus) {
                    throw new Error("Status 'expirée' not found");
                }

                const response = await axiosInstance.put(`http://localhost:8080/api/v1/relationcp/changeStatutEtRaison/${selectedId}`, {
                    statutCId: expireeStatus.id, // ID du statut "Suspendu", assurez-vous de le changer selon votre logique
                    raison: raison
                });
                setModalVisibll(false);
                setRaison('');
                setSelectedId(null);
                load();
                // Mettez à jour votre interface utilisateur ici après la suspension
            } catch (error) {
                console.error("There was an error suspending the record!", error);
            }
        }
    }

    function handleEditPointvente(pointvente) {
        navigate("/admin/EditP", { state: { pointvente } });
    }

    async function deletePointvente() {
        setAlertVisible(true);
        try {
            await axiosInstance.delete(`http://localhost:8080/api/v1/pointvente/delete/${pointventeIdToDelete}`);
            loadPointventes();
            setTimeout(() => {
                setAlertVisible(false);
            }, 3000);
        } catch (error) {
            console.error("Error deleting point vente", error);
        }
    }

    async function deletePoint() {
        setAlertVisible(true);
        try {
            await axiosInstance.delete(`http://localhost:8080/api/v1/relationcp/delete/${pointIdToDelete}`);
            loadPointventes();
            setTimeout(() => {
                setAlertVisible(false);
            }, 3000);
        } catch (error) {
            console.error("Error deleting point", error);
        }
    }
    const annulerCourtier = async (courtierId) => {
        try {
            const { data: statuses } = await axiosInstance.get('http://localhost:8080/api/v1/statutC/getall');
            const expireeStatus = statuses.find(status => status.libellec === 'Résilié');

            if (!expireeStatus) {
                throw new Error("Status 'expirée' not found");
            }

            const todayDate = getTodayDate();

            await axiosInstance.put(`http://localhost:8080/api/v1/relationcp/edit/${courtierId}`, {
                dateFin: todayDate,
                statutCId: expireeStatus.id
            });

            load();
        } catch (error) {
            console.error("Error cancelling courtier:", error);
        }
    };
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };
    async function modell(pointventeId) {
        setModalVisible(true);
        setPointventeIdToDelete(pointventeId);
    }

    async function model(Id) {
        setModalVisibl(true);
        setPointIdToDelete(Id);
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

    const handleSave = async (record) => {
        try {
            const updatedDateDebut = dateDebut || record.dateDebut;
            const updatedDateFin = dateFin || record.dateFin;
            const updatedStatutCId = statutCId || record.statutCId;
            console.log(updatedDateDebut);
            console.log(updatedDateFin);
            console.log(updatedStatutCId);
            console.log('Saving changes for:', record.id);
            const response = await axiosInstance.put(`http://localhost:8080/api/v1/relationcp/edit/${record.id}`, {
                dateDebut: updatedDateDebut,
                dateFin: updatedDateFin,
                statutCId: updatedStatutCId,
                status: updatedStatutCId
            });
            console.log('Response:', response.data);
            load();
            loadPointventes();
            setIsEditing(false);
            setEditingRecord(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour des dates :", error);
        }
    };

    const filterCompagnies = (compagnies) => {
        const compagnieMap = new Map();

        compagnies.forEach((compagnie) => {
            if (!compagnieMap.has(compagnie.raison_social) || compagnie.active) {
                compagnieMap.set(compagnie.raison_social, compagnie);
            }
        });

        return Array.from(compagnieMap.values());
    };

    const fetchHistorique = async (compagnieId, pointventeId) => {
        try {
            const response = await axiosInstance.get(`http://localhost:8080/api/v1/relationcp/compagniesMemePointVente/${compagnieId}/${pointventeId}`);
            const historiqueWithStatus = response.data.map(relation => {
                const today = moment().startOf('day');
                const dateFin = moment(relation.dateFin).startOf('day');
                relation.status = dateFin.isBefore(today) ? 'Terminée' : relation.active ? 'En cours' : 'Suspendue';
                return relation;
            });
            setHistorique(historiqueWithStatus);
            setHistoryModalVisible(true); // Afficher la modal une fois les données récupérées
        } catch (error) {
            console.error("Erreur lors de la récupération de l'historique :", error);
        }
    };

    const showDrawer = (record) => {
        fetchActiveCompagnies(record.id);
    };
    const handleColumnChange = (checkedValues) => {
        setSelectedColumns(checkedValues);
    };

    const columnSelectionMenu = (
        <Menu>
            <Menu.Item>
                <Checkbox.Group value={selectedColumns} onChange={handleColumnChange}>
                    <Checkbox value="nomp">Courtier</Checkbox>
                    <Checkbox value="emailp">Email</Checkbox>
                    <Checkbox value="telephonep">Telephone</Checkbox>
                    <Checkbox value="actions">Actions</Checkbox>
                </Checkbox.Group>
            </Menu.Item>
        </Menu>
    );
    const columns = [
        {
            title: <span style={{ color: '#607AD6' }}>Courtier</span>,
            dataIndex: 'nomp',
            key: 'nomp',
            ...getColumnSearchProps('nomp'),
            render: (text, record) => (
                <span style={{ color: record.relationPointventeCompagnieDto.length === 0 ? '#ccc' : 'inherit' }}>
                    {text}
                </span>
            ),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Email</span>,
            dataIndex: 'emailp',
            key: 'emailp',
            ...getColumnSearchProps('emailp'),
            render: (text, record) => (
                <span style={{ color: record.relationPointventeCompagnieDto.length === 0 ? '#ccc' : 'inherit' }}>
                    {text}
                </span>
            ),
        },
        {
            title: <span style={{ color: '#607AD6' }}>Telephone</span>,
            dataIndex: 'telephonep',
            key: 'telephonep',
            ...getColumnSearchProps('telephonep'),
            render: (text, record) => (
                <span style={{ color: record.relationPointventeCompagnieDto.length === 0 ? '#ccc' : 'inherit' }}>
                    {text}
                </span>
            ),
        },

        {
            title: <span style={{ color: '#607AD6' }}>Actions</span>,
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Ajouter Compagnie">
                        <span className="compagnie-bg" onClick={() => showAddCompagnieModal(record.id)}>
                            <PlusCircleOutlined style={{ color: '#607AD6' }} />
                        </span>
                    </Tooltip>
                    <Tooltip title="Modifier">
                        <span className="compagnie-bg" style={{ color: record.status === 'En cours' ? '#ccc' : '#607AD6', pointerEvents: record.status === 'En cours' ? 'none' : 'auto' }} onClick={() => handleEditPointvente(record)}>
                            <EditOutlined />
                        </span>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <span className="compagnie-bg" onClick={() => modell(record.id)}>
                            <MinusCircleOutlined style={{ color: '#607AD6' }} />
                        </span>
                    </Tooltip>
                    <Tooltip title="Liste compagnie">
                        <span className="compagnie-bg" onClick={() => showDrawer(record)}>
                            <MenuUnfoldOutlined style={{ color: '#607AD6' }} />
                        </span>
                    </Tooltip>


                    {modalVisible && (
                        <Modal
                            title="Confirmation"
                            open={modalVisible}
                            onOk={() => { deletePointvente(); setModalVisible(false); }}
                            onCancel={() => setModalVisible(false)}
                        >
                            <p>Êtes-vous sûr de vouloir supprimer ce point de vente ?</p>
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
            width: 50, // Réduire la largeur de la colonne des paramètres
        },
    ].filter(column => selectedColumns.includes(column.key) || column.key === 'settings');

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
                <Row justify="end" gutter={[16, 16]}>
                    <Col>
                        <Link to="/admin/createP">
                            <Button type="primary" icon={<PlusCircleOutlined />} style={{ backgroundColor: "rgba(96, 122, 214, 0.70)" }}>AJOUTER</Button>
                        </Link>
                    </Col>
                </Row>
                <br />
                <Modal
                    title="Ajouter "
                    visible={addCompagnieModalVisible}
                    onCancel={() => setAddCompagnieModalVisible(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setAddCompagnieModalVisible(false)}>
                            Annuler
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleAddCompagnie}>
                            Ajouter
                        </Button>,
                    ]}
                >
                    <div className="form-group">
                        <label>Raison social</label>
                        <Select
                            className="custom-select"
                            showSearch
                            placeholder="Choisir Raison"
                            optionFilterProp="children"
                            onChange={(value) => setCompagnieId(value)}
                        >
                            {compagnies.map((compagnie) => (
                                <Option key={compagnie.id} value={compagnie.id}>
                                    {compagnie.raison_social}
                                </Option>
                            ))}
                        </Select>
                    </div>
                    <label className="text-start">Date debut</label>
                    <input type="date" className="form-control" value={dateDebut} onChange={(event) => setDateDebut(event.target.value)} />
                    <label className="text-start">Date fin</label>
                    <input type="date" className="form-control" value={dateFin} onChange={(event) => setDateFin(event.target.value)} />
                    <div className="form-group">
                        <label>Statut</label>
                        <Select
                            className="custom-select"
                            showSearch
                            placeholder="Choisir Statut"
                            optionFilterProp="children"
                            value={statutCId}
                            onChange={(value) => setStatutCId(value)}
                        >
                            {statutCs.map((statutC) => (
                                <Option key={statutC.id} value={statutC.id}>
                                    {statutC.libellec}
                                </Option>
                            ))}
                        </Select>
                    </div>

                </Modal>
                <Modal
                    title="Historique"
                    visible={historyModalVisible}
                    onCancel={() => setHistoryModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setHistoryModalVisible(false)}>
                            Fermer
                        </Button>
                    ]}
                >
                    <Table
                        columns={[
                            { title: 'Date Début', dataIndex: 'dateDebutc', key: 'dateDebutc', render: (text) => text ? moment(text).format('YYYY-MM-DD') : 'N/A' },
                            { title: 'Date Fin', dataIndex: 'dateFinc', key: 'dateFinc', render: (text) => text ? moment(text).format('YYYY-MM-DD') : 'N/A' },
                            { title: 'Statut', dataIndex: 'libellec', key: 'libellec' },
                            { title: 'Date de Changement', dataIndex: 'dateChangement', key: 'dateChangement', render: (text) => moment(text).format('YYYY-MM-DD') },
                            {
                                title: 'Raison de la suspension', dataIndex: 'raison', key: 'raison',
                                render: (text, record) => record.libellec === 'Suspendue' ? <span>{text}</span> : null,
                            }
                        ]}
                        dataSource={historique.map((item) => ({ ...item, key: item.id }))}
                        pagination={false}
                    />
                </Modal>
                <Modal
                    title="Motif de la suspension"
                    visible={modalVisibll}
                    onCancel={() => setModalVisibll(false)}
                    footer={[
                        <Button key="cancel" onClick={() => setModalVisibll(false)}>
                            Annuler
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleSuspendConfirm}>
                            OK
                        </Button>,
                    ]}
                >
                    <Input
                        placeholder="Entrez le motif"
                        value={raison}
                        onChange={(e) => setRaison(e.target.value)}
                    />
                </Modal>
                <Table
                    columns={columns}
                    dataSource={pointventes.map((pointvente) => ({ ...pointvente, key: pointvente.id }))}
                    pagination={{ pageSize: 5 }}
                    size="small"
                />
                <Drawer
                    title="Liste des Compagnies"
                    width={1000}
                    onClose={() => setDrawerVisible(false)}
                    visible={drawerVisible}
                >
                    <Table
                        columns={[
                            {
                                title: 'Compagnie',
                                dataIndex: 'raison_social',
                                key: 'raison_social',
                                render: (text, record) => (
                                    <Link to={`/admin/Apercu/${record.compagnieId}`}>
                                        <span style={{ fontWeight: 'bold', color: '#F08080' }}>{text}</span>
                                    </Link>
                                ),
                            },
                            {
                                title: 'Date Debut',
                                dataIndex: 'dateDebut',
                                key: 'dateDebut',
                                render: (text, record) => (
                                    isEditing && editingRecord === record.id ? (
                                        <Input
                                            type="date"
                                            value={dateDebut || text}
                                            onChange={(e) => setDateDebut(e.target.value)}
                                        />
                                    ) : (
                                        text ? moment(text).format('YYYY-MM-DD') : ''
                                    )
                                ),
                            },
                            {
                                title: 'Date Fin',
                                dataIndex: 'dateFin',
                                key: 'dateFin',
                                render: (text, record) => (
                                    isEditing && editingRecord === record.id ? (
                                        <Input
                                            type="date"
                                            value={dateFin || text}
                                            onChange={(e) => setDateFin(e.target.value)}
                                        />
                                    ) : (
                                        text ? moment(text).format('YYYY-MM-DD') : ''
                                    )
                                ),
                            },

                            {
                                title: 'Statut',
                                dataIndex: 'latestLibellec',
                                key: 'latestLibellec',
                                render: (text, record) => (
                                    isEditing && editingRecord === record.id ? (
                                        <Select
                                            className="custom-select"
                                            showSearch

                                            optionFilterProp="children"
                                            value={statutCId || record.latestLibellec}
                                            onChange={(value) => setStatutCId(value)}
                                        >
                                            {statutCs.map((StatutC) => (
                                                <Option key={StatutC.id} value={StatutC.id}>
                                                    {StatutC.libellec}
                                                </Option>
                                            ))}
                                        </Select>
                                    ) : (
                                        <span >
                                            {text}
                                        </span>
                                    )
                                ),

                            },
                            {
                                title: 'Actions',
                                key: 'actions',
                                render: (text, record) => (
                                    <Space size="middle">
                                        {isEditing && editingRecord === record.id ? (
                                            <>
                                                <Button onClick={() => handleSave(record)}>Save</Button>
                                                <Button onClick={() => { setIsEditing(false); setEditingRecord(null); }}>Cancel</Button>
                                            </>
                                        ) : (
                                            <>
                                                <Tooltip title="Modifier">
                                                    <span
                                                        className="compagnie-bg"
                                                        onClick={() => {
                                                            if (record.status !== 'En cours') {
                                                                setIsEditing(true);
                                                                setEditingRecord(record.id);
                                                                setDateDebut(record.dateDebut);
                                                                setDateFin(record.dateFin);
                                                            }
                                                        }}
                                                        style={{
                                                            color: record.status === 'En cours' ? '#ccc' : '#006400',
                                                            pointerEvents: record.status === 'En cours' ? 'none' : 'auto'
                                                        }}
                                                    >
                                                        <EditOutlined />
                                                    </span>
                                                </Tooltip>

                                                <Tooltip title="Suspendu">
                                                    <span className="compagnie-bg">
                                                        <PauseOutlined style={{ color: 'orange' }} onClick={() => handleSuspend(record.id)} />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="Résilier">
                                                    <span className="compagnie-bg">
                                                        <MinusCircleOutlined style={{ fontSize: '12px', color: "red" }}

                                                            onClick={() => {
                                                                setConfirmTitle("Annuler Courtier");
                                                                setConfirmContent("Êtes-vous sûr de vouloir annuler cet enregistrement?");
                                                                setConfirmAction(() => () => annulerCourtier(record.id));
                                                                setConfirmRecord(record);
                                                                setConfirmModalVisible(true);
                                                            }} />
                                                    </span>
                                                </Tooltip>
                                                <Tooltip title="Voir Historique">
                                                    <span className="compagnie-bg">
                                                        <HistoryOutlined style={{ color: '#607AD6' }} onClick={() => showStatusHistory(record.statutHistoriqueC)} />
                                                    </span>
                                                </Tooltip>
                                            </>
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
                <Modal
                    title="Historique des Statuts"
                    visible={statusHistoryModalVisible}
                    onCancel={() => setStatusHistoryModalVisible(false)}
                    footer={[
                        <Button key="close" onClick={() => setStatusHistoryModalVisible(false)}>
                            Fermer
                        </Button>
                    ]}
                >
                    <Table
                        columns={[
                            { title: 'Date Début', dataIndex: 'dateDebutc', key: 'dateDebutc', render: (text) => text ? moment(text).format('YYYY-MM-DD') : 'N/A' },
                            { title: 'Date Fin', dataIndex: 'dateFinc', key: 'dateFinc', render: (text) => text ? moment(text).format('YYYY-MM-DD') : 'N/A' },
                            { title: 'Date de Changement', dataIndex: 'dateChangement', key: 'dateChangement', render: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : 'N/A' },
                            { title: 'Statut', dataIndex: 'libellec', key: 'libellec' }
                        ]}
                        dataSource={selectedStatusHistory.map((item) => ({ ...item, key: item.id }))}
                        pagination={{ pageSize: 7 }}
                        size="small"
                    />
                </Modal>

                <Modal
                    title={confirmTitle}
                    visible={confirmModalVisible}
                    onOk={() => {
                        if (confirmAction) {
                            confirmAction();
                        }
                        setConfirmModalVisible(false);
                        setConfirmAction(null);
                        setConfirmRecord(null);
                    }}
                    onCancel={() => {
                        setConfirmModalVisible(false);
                        setConfirmAction(null);
                        setConfirmRecord(null);
                    }}
                >
                    <p>{confirmContent}</p>
                </Modal>
            </div>
        </>
    );
};

export default Pointventes;
