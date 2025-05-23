import React, { useEffect, useState ,useRef} from "react";
import { Table, Tag, Space, Tooltip, Alert, Modal ,Input, Button } from "antd";
import axiosInstance from "../../core/axiosConfig";
import { Link, useNavigate } from 'react-router-dom';
import { SearchOutlined, EditOutlined, DeleteOutlined, FolderAddOutlined, FileTextOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';


const StatusAtt = () => {
    const [statutAtt, setStatutAtt] = useState([]); 
    const [statutAttIdToDelete, setStatutAttIdToDelete] = useState(null);
    const [statutAttId, setId] = useState('');
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

    useEffect(() => {
        loadstatutAs();
    }, []);
    useEffect(() => {
        // Récupération du message d'annulation depuis localStorage
        const message = localStorage.getItem('cancelMessage');
        if (message) {
            setCancelMessage(message);
            // Suppression du message une fois qu'il est affiché
            localStorage.removeItem('cancelMessage');

        }
        setTimeout(() => {
            setCancelMessage(false);
        }, 3000);

    }, []);
    useEffect(() => {
        // Récupération du message de succès depuis localStorage
        const message = localStorage.getItem('successMessage');
        if (message) {
            setSuccessMessage(message);
            // Suppression du message une fois qu'il est affiché
            localStorage.removeItem('successMessage');
        }
        setTimeout(() => {
            setSuccessMessage(false);
        }, 3000);
    }, []);
    useEffect(() => {
        // Récupération du message de succès depuis localStorage
        const message = localStorage.getItem('updateMessage');
        if (message) {
            setUpdateMessage(message);
            // Suppression du message une fois qu'il est affiché
            localStorage.removeItem('updateMessage');
        }
        setTimeout(() => {
            setUpdateMessage(false);
        }, 3000);
    }, []);

    useEffect(() => {
        // Récupération du message de succès depuis localStorage
        const message = localStorage.getItem('errorupdateMessage');
        if (message) {
            setErrorupdateMessage(message);
            // Suppression du message une fois qu'il est affiché
            localStorage.removeItem('errorupdateMessage');
        }
        setTimeout(() => {
            setErrorupdateMessage(false);
        }, 3000);
    }, []);

    useEffect(() => {
        // Récupération du message de succès depuis localStorage
        const message = localStorage.getItem('errorsuccessMessage');
        if (message) {
            setErrorsuccessMessage(message);
            // Suppression du message une fois qu'il est affiché
            localStorage.removeItem('errorsuccessMessage');
        }
        setTimeout(() => {
            setErrorsuccessMessage(false);
        }, 3000);
    }, []);

    async function loadstatutAs() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/statutAtt/getall");
        setStatutAtt(result.data);
    }

    function handleEditstatutA(statutAtt) {
        navigate("/admin/EditStA", { state: { statutAtt } });
    }

    async function deletestatutA() {
        setAlertVisible(true);
        await axiosInstance.delete("http://localhost:8080/api/v1/statutAtt/delete/" + statutAttIdToDelete);
    
        
        loadstatutAs();
        setTimeout(() => {
            setAlertVisible(false);
        }, 3000);

    }

    async function modell(statutAttId) {
        setModalVisible (true);
        setStatutAttIdToDelete(statutAttId);
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
                title: <span style={{ color: '#607AD6' }}>Libelle</span>,
                dataIndex: 'libelles',
                key: 'libelles',
                ...getColumnSearchProps('libelles'),
               
            },
            
        {
            title: <span style={{ color: '#607AD6' }}>Actions</span>,
            key: 'actions',
            render: (text, record) => (
                
                <Space size="middle">
                   
                    <Tooltip title="Modifier">
                        <span className="compagnie-bg" onClick={() => handleEditstatutA(record)}>
                            <EditOutlined style={{ color: '#228B22' }} />
                        </span>
                    </Tooltip>
                    <Tooltip title="Supprimer">
                        <span className="compagnie-bg" onClick={() => modell(record.id)}>
                            <DeleteOutlined style={{ color: '#DC143C' }} />
                        </span>
                    </Tooltip>
                   
                    {modalVisible && ( 
                <Modal
                    title="Confirmation"
                    open={modalVisible}
                    onOk={() =>{deletestatutA(record.id);setModalVisible(false)
                    }} 
                    onCancel={() => setModalVisible(false)}
                >
                    <p>Êtes-vous sûr de vouloir supprimer ce type ?</p>
                </Modal>
            )}
                </Space>
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
                style={{ position: 'absolute', bottom: 20, right: 20 }} // Positionnement en bas à droite
            />}
            {errorupdateMessage && <Alert
                message="Echec de modification"
                description="Error lorsque de Mise à jour ."
                type="error"
                showIcon
                style={{ position: 'absolute', bottom: 20, right: 20 }} // Positionnement en bas à droite
            />}

            {successMessage && <Alert
                message="Success Submit"
                description="Ajoute description and advice about successful copywriting."
                type="success"
                showIcon
                style={{ position: 'absolute', bottom: 20, right: 20 }} // Positionnement en bas à droite
            />}

            {errorsuccessMessage && <Alert
                message="Error Submit"
                description="Ajoute description and advice about successful copywriting."
                type="error"
                showIcon
                style={{ position: 'absolute', bottom: 20, right: 20 }} // Positionnement en bas à droite
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
                description="Detailed  description and advice about successful copywriting."
                type="success"
                showIcon
                style={{ position: 'absolute', bottom: 20, right: 20 }} // Positionnement en bas à droite
            />}
            <div className="container">
        
                <br />
                <div className="row justify-content-end">
                    <div className="col-lg-2">
                        <Link to="/admin/createStAtt">
                            <span className="btn btn-sm mb-3 custom-btn-color" style={{ color: '#ffffff' ,marginLeft:"50%",backgroundColor:"rgba(96, 122, 214, 0.70)"}}>
                                <FolderAddOutlined style={{ color: '#ffffff' }} /> AJOUTER
                            </span>
                        </Link>
                    </div>
                </div>


                <br />


                <Table
    columns={columns}
    dataSource={statutAtt ? statutAtt.map((statutAtt) => ({ ...statutAtt, key: statutAtt.id })) : []}
    pagination={{ pageSize: 5 }}
     size="small"
/>





            </div>
        </>
    );
}

export default StatusAtt;
