import React, { useState, useEffect, useRef } from 'react';
import { Table, Select, message, Modal, Input, Space, Button } from 'antd';
import axiosInstance from "../../core/axiosConfig";
import Highlighter from 'react-highlight-words';
import { SearchOutlined,CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const AttestationsAutorisees = () => {
    const [compagnies, setCompagnies] = useState([]);
    const [autorisations, setAutorisations] = useState([]);
    const [filteredAutorisations, setFilteredAutorisations] = useState([]);
    const [typeAttestations, setTypeAttestations] = useState([]);
    const [selectedCompagnie, setSelectedCompagnie] = useState(null);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
    const searchInput = useRef(null);

    useEffect(() => {
        loadCompagnies();
        loadTypeAttestations();
        loadAutorisations();
    }, []);

    useEffect(() => {
        if (selectedCompagnie) {
            const filtered = autorisations.filter(aut => aut.raison_social === selectedCompagnie);
            setFilteredAutorisations(filtered);
        } else {
            setFilteredAutorisations(autorisations);
        }
    }, [selectedCompagnie, autorisations]);

    const loadCompagnies = async () => {
        const result = await axiosInstance.get('http://localhost:8080/api/v1/compagnie/getall');
        setCompagnies(result.data);
    };

    const loadTypeAttestations = async () => {
        const result = await axiosInstance.get('http://localhost:8080/api/v1/typeattestation/getall');
        setTypeAttestations(result.data);
    };

    const loadAutorisations = async () => {
        const result = await axiosInstance.get('http://localhost:8080/api/v1/attestationAutorisees/getall');
        setAutorisations(result.data);
    };

    const handleCompagnieChange = (value) => {
        setSelectedCompagnie(value);
    };

    const toggleFlag = async (id) => {
        setCurrentId(id);
        setConfirmVisible(true);
    };

    const handleConfirmToggle = async () => {
        setConfirmVisible(false);
        try {
            await axiosInstance.put(`http://localhost:8080/api/v1/attestationAutorisees/toggleFlag`, [currentId.idcompagnie, currentId.idtypeattestation]);
            setAutorisations(prev => prev.map(aut => aut.id === currentId ? { ...aut, flag: !aut.flag } : aut));
            message.success("Le statut a été mis à jour avec succès");
        } catch (error) {
            message.error("Erreur lors de la mise à jour du statut");
        }
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
        onFilter: (value, record) => record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
        render: (text) => searchedColumn === dataIndex ? (
            <Highlighter
                highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text ? text.toString() : ''}
            />
        ) : (text),
    });

    const handleExpand = (expanded, record) => {
        const keys = expanded ? [...expandedRowKeys, record.raison_social] : expandedRowKeys.filter(key => key !== record.raison_social);
        setExpandedRowKeys(keys);
    };

    const expandedRowRender = (record) => (
        <Table
            columns={[
                {
                    title: "Types d'attestations",
                    dataIndex: 'libelle',
                    key: 'libelle',
                    ...getColumnSearchProps('libelle'),
                },
                {
                    title: 'Autorisé',
                    dataIndex: 'flag',
                    key: 'flag',
                    render: (flag, record) => (
                        <span 
                            style={{ color: flag ? 'green' : 'red', cursor: 'pointer' }} 
                            onClick={() => toggleFlag(record.id)}
                        >
                            {flag ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
                        </span>
                    ),
                }
                
            ]}
            dataSource={record.attestations}
            pagination={false}
            rowKey="id"
        />
    );

    const groupedData = filteredAutorisations.reduce((acc, aut) => {
        const { raison_social, libelle, flag, id } = aut;
        if (!acc[raison_social]) {
            acc[raison_social] = { raison_social, attestations: [] };
        }
        acc[raison_social].attestations.push({ libelle, flag, id });
        return acc;
    }, {});

    const columns = [
        {
            title: <span style={{ color: '#607AD6' }}>Compagnie</span>,
            dataIndex: 'raison_social',
            key: 'raison_social',
            ...getColumnSearchProps('raison_social'),
        }
    ];

    return (
        <>
            <div className="container">
                <Select
                    style={{ width: 200, marginBottom: 16 }}
                    placeholder="Sélectionner une compagnie"
                    onChange={handleCompagnieChange}
                    allowClear
                >
                    <Option value={null}>Afficher tous</Option>
                    {compagnies.map(comp => (
                        <Option key={comp.id} value={comp.raison_social}>
                            {comp.raison_social}
                        </Option>
                    ))}
                </Select>
                <br />
                <Table
                    columns={columns}
                    dataSource={Object.values(groupedData)}
                    rowKey="raison_social"
                    expandedRowKeys={expandedRowKeys}
                    onExpand={handleExpand}
                    expandedRowRender={expandedRowRender}
                    pagination={{ pageSize: 15 }}
                     size="small"
                />
            </div>
            <Modal
                title="Confirmation"
                visible={confirmVisible}
                onOk={handleConfirmToggle}
                onCancel={() => setConfirmVisible(false)}
                okText="Oui"
                cancelText="Non"
            >
                <p>Êtes-vous sûr de vouloir changer le statut de cette autorisation ?</p>
            </Modal>
        </>
    );
};

export default AttestationsAutorisees;
