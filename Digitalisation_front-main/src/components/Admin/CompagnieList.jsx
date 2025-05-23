import React, { useEffect, useState, useRef } from "react";
import { Table, Tag, Space, Tooltip, Alert, Modal, Input, Button } from "antd";
import axiosInstance from "../../core/axiosConfig";
import { Link, useNavigate ,useParams} from 'react-router-dom';
import { SearchOutlined, UserAddOutlined, EditOutlined, UserDeleteOutlined, CloseCircleOutlined, FileTextOutlined ,ContactsOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const CompagnieList = () => {
    const [compagnies, setCompagnies] = useState([]);
    const [pointventes, setPointventes] = useState([]);
    const [filteredCompagnies, setFilteredCompagnies] = useState([]);
    const [filterStatus, setFilterStatus] = useState(null);
    const [compagnieId, setId] = useState('');
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
    const [pointventeIdToDelete, setPointventeIdToDelete] = useState(null);
    const searchInput = useRef(null);
    const navigate = useNavigate();
    const { pointventeId } = useParams();

    useEffect(() => {
        loadCompagnies();
        loadPointventes();
    }, [pointventeId]);

    async function loadPointventes() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/pointvente/getall");
        setPointventes(result.data);
        // Initialement, affiche toutes les compagnies
    }

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
        const result = await axiosInstance.get(`http://localhost:8080/api/v1/compagnie/getall/${pointventeId}`);
        setCompagnies(result.data);
       // Initialement, affiche toutes les compagnies
    }

    function handleEditCompagnie(compagnie) {
        navigate(`/Editc/${pointventeId}`, { state: { compagnie } });
    }

    async function deleteCompagnie() {
        setAlertVisible(true);
        await axiosInstance.delete("http://localhost:8080/api/v1/compagnie/delete/" + compagnieIdToDelete);
        loadCompagnies();
        setTimeout(() => {
            setAlertVisible(false);
        }, 3000);
    }
 
    async function anuller(compagnieId) {
        setAlertVisible(true);
        try {
            // Mettre à jour les compagnies ayant ce point de vente pour mettre leur pointventeId à null
            await axiosInstance.put(`http://localhost:8080/api/v1/compagnie/annulePointventeId/${compagnieId}`);
            // Rechargez la liste des compagnies après la mise à jour
            loadCompagnies();
            setTimeout(() => {
                setAlertVisible(false);
            }, 3000);
        } catch (error) {
            console.error("Error deleting point vente", error);
        }
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
            record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '', // Assurez-vous que la recherche est effectuée dans le bon champ
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

    const columns = [
       
        {
            title: <span style={{ color: '#607AD6' }}>Raison sociale</span>,
            dataIndex: 'raison_social',
            key: 'raison_social',
            ...getColumnSearchProps('raison_social'),
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
       

        {
            title: <span style={{ color: '#607AD6' }}>Statut</span>,
    dataIndex: "statut",
    key: "statut",
    ...getColumnSearchProps("statut"),
    render: (text, record) => {
        const isAbonnementActif = record.abonnement && record.abonnement.some(abonnement => abonnement.statut === "Actif");
        const isSoldePrepayeActif = record.soldePrepayeDto && record.soldePrepayeDto.some(solde => solde.statut === "Actif");
        
        // Vérification du statut actif pour les abonnements et les soldes prépayés
        const isActive = isAbonnementActif || isSoldePrepayeActif;
        
        return (
            <Tag color={isActive ? "green" : "red"}>
                {isActive ? "ACTIVE" : "INACTIVE"}
            </Tag>
        );
    },
        },
  
        {
            title: <span style={{ color: '#607AD6' }}>Actions</span>,
            key: 'actions',
            render: (text, record) => (
                <Space size="middle">
                    <Tooltip title="Modifier">
                        <span className="compagnie-bg" onClick={() => handleEditCompagnie(record)}>
                            <EditOutlined style={{ color: '#607AD6' }} />
                        </span>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <span className="compagnie-bg" onClick={() => modell(record.id)}>
                            <UserDeleteOutlined style={{ color: '#607AD6' }} />
                        </span>
                    </Tooltip>

                    <Tooltip title="Annuler relation">
                        <span className="compagnie-bg" onClick={() => anuller(record.id)}>
                            <CloseCircleOutlined style={{ color: '#607AD6' }} />
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
    ];

    return (
        <div style={{marginTop :"7%"}} >
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
              
    <Table
          columns={columns}
          dataSource={compagnies ? compagnies.map((compagnie) => ({ ...compagnie, key: compagnie.id })) : []}
          pagination={{ pageSize: 3 }}
        />
            </div>
        </div>
    );
}

export default CompagnieList;
