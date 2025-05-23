import React, { useEffect, useState, useRef } from "react";
import { Table, Card, Collapse, Tag, Space, Tooltip, Alert, Drawer, Modal, Input, Button, InputNumber, Select, List, Switch, Form } from "antd";
import axiosInstance from "../../core/axiosConfig";
import { Link, useNavigate } from 'react-router-dom';
import { SearchOutlined, EyeOutlined, EditOutlined, DeleteOutlined, AppstoreAddOutlined, WalletOutlined, LoadingOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import currencyCodes from 'currency-codes';

const SoldePrepayes = () => {
    const { Panel } = Collapse;
    const [soldePrepayes, setSoldePrepayes] = useState([]);
    const [attestations, setAttestations] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [cancelMessage, setCancelMessage] = useState('');
    const [soldePrepayeIdToDelete, setSoldePrepayeIdToDelete] = useState(null);
    const [solde, setSolde] = useState(0.00);
    const [date_Abonnement, setDate_Abonnement] = useState("");
    const [type, setType] = useState("Prepaiement");
    const [devise, setDevise] = useState("");
    const [currentCompagnieId, setCurrentCompagnieId] = useState(null);
    const [soldeCompagnie, setSoldeCompagnie] = useState(null);
    const [isSoldeModalVisible, setIsSoldeModalVisible] = useState(false);
    const [toggleState, setToggleState] = useState(true);
    const [selectedRow, setSelectedRow] = useState(null); // New state for selected row
    const [searchCompany, setSearchCompany] = useState(null); // New state for search select
    const searchInput = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        loadAbonnements();
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

    async function loadAbonnements() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/solde/getall");
        const groupedData = result.data.reduce((acc, soldePrepaye) => {
            const latestLibellep = soldePrepaye.statutHistorique
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(hist => hist.libellep)[0] || 'N/A';
            const abonnementWithLibellep = { ...soldePrepaye, latestLibellep };
            if (!acc[soldePrepaye.compagnieId]) {
                acc[soldePrepaye.compagnieId] = {
                    compagnieId: soldePrepaye.compagnieId,
                    raison_social: soldePrepaye.raison_social,
                    soldeCompagnie: soldePrepaye.soldeCompagnie,
                    soldePrepayes: []
                };
            }
            acc[soldePrepaye.compagnieId].soldePrepayes.push(abonnementWithLibellep);
            return acc;
        }, {});
        setSoldePrepayes(Object.values(groupedData));
    }

    async function loadAttestationsByCompanyId(companyId) {
        const result = await axiosInstance.get(`http://localhost:8080/api/v1/attestation/getbycompanyid/${companyId}`);
        return result.data;
    }

    const handleCompanySelect = async (compagnie) => {
        const attestations = await loadAttestationsByCompanyId(compagnie.compagnieId);
        setSelectedCompany({
            ...compagnie,
            attestations: attestations
        });
        setSelectedRow(compagnie.compagnieId); // Set the selected row
    };

    const handleSyncClick = (compagnieId) => {
        setCurrentCompagnieId(compagnieId);
        setDrawerVisible(true);
    };

    const handleDrawerOk  = async () => {
        await axiosInstance.post("http://localhost:8080/api/v1/solde/save", {
            devise: devise,
            solde: solde,
            date_Abonnement: date_Abonnement,
            type: type,
            ownerso: { id: currentCompagnieId },
        });
        loadAbonnements();
        setDrawerVisible(false);
        setSolde(0.00);
        setDate_Abonnement("");
        setDevise("");
        setType("Prepaiement");
    };

    const handleDrawerCancel = () => {
        setDrawerVisible(false);
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

    const handleEditAbonnement = (record) => {
        navigate("/admin/EditSo", { state: { abonnement: record } });
    };

    const modell = (soldePrepayeId) => {
        setModalVisible(true);
        setSoldePrepayeIdToDelete(soldePrepayeId);
    };

    const deleteAbonnement = async () => {
        await axiosInstance.delete(`http://localhost:8080/api/v1/solde/delete/${soldePrepayeIdToDelete}`);
        loadAbonnements();
        setModalVisible(false);
    };

    const handleDollarClick = (compagnieId) => {
        const compagnie = soldePrepayes.find(c => c.compagnieId === compagnieId);
        if (compagnie) {
            setSoldeCompagnie(compagnie);
            setIsSoldeModalVisible(true);
        }
    };

    const handleSoldeModalOk = () => {
        setIsSoldeModalVisible(false);
        setSoldeCompagnie(null);
    };

    const handleSoldeModalCancel = () => {
        setIsSoldeModalVisible(false);
        setSoldeCompagnie(null);
    };

    const currencyOptions = currencyCodes.codes().map(code => ({
        value: code,
        label: `${code} - ${currencyCodes.code(code).currency}`
    }));

    const prepayementTable = (record) => {
        const totalSolde = record.soldePrepayes.reduce((sum, prepaye) => sum + (prepaye.solde || 0), 0);
        return(
        <Table
            columns={[
                {
                    title: 'Type',
                    dataIndex: 'type',
                    key: 'type',
                    ...getColumnSearchProps('type'),
                },
                {
                    title: 'Date Approvisionnement',
                    dataIndex: 'date_Abonnement',
                    key: 'date_Abonnement',
                    ...getColumnSearchProps('date_Abonnement'),
                },
                {
                    title: 'Prepaiement',
                    dataIndex: 'solde',
                    key: 'solde',
                    ...getColumnSearchProps('solde'),
                    render: (solde, record) => (
                        <span>
                            {solde !== null && solde !== undefined
                                ? Number(solde).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : 'N/A'} {record.devise}
                        </span>
                    ),
                },
                {
                    title: 'Actions',
                    key: 'actions',
                    render: (text, record) => (
                        <Space size="middle">
                            <Tooltip title="Modifier">
                                <span onClick={() => handleEditAbonnement(record)}>
                                    <EditOutlined style={{ color: '#607AD6' }} />
                                </span>
                            </Tooltip>
                            <Tooltip title="Supprimer">
                                <span onClick={() => modell(record.id)}>
                                    <DeleteOutlined style={{ color: '#607AD6' }} />
                                </span>
                            </Tooltip>
                           {/* <Tooltip title="Aperçu">
                                <Link to={`/admin/viewSolde/${record.id}`}>
                                    <EyeOutlined style={{ color: '#607AD6' }} />
                                </Link>
                            </Tooltip>*/}
                        </Space>
                    ),
                },
            ]}
            dataSource={record.soldePrepayes}
            pagination={{ pageSize: 8 }}
            size="small"
            bordered
            summary={() => (
                <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={2}>Total Solde</Table.Summary.Cell>
                    <Table.Summary.Cell>
                        {totalSolde.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell colSpan={2} />
                </Table.Summary.Row>
            )}
            style={{ margin: '20px 0', background: '#f5f5f5', borderRadius: '8px' }}
        />
    );
}

    const attestationTable = (record) => {
        const totalConsommation = record.attestations.reduce((sum, attestation) => sum + (attestation.prix_unitaire || 0), 0);

        return (
        <Table
            columns={[
                {
                    title: 'Type Attestation',
                    dataIndex: 'libelle',
                    key: 'libelle',
                    ...getColumnSearchProps('libelle'),
                },
                {
                    title: 'Date Approvisionnement',
                    dataIndex: 'date_Generation',
                    key: 'date_Generation',
                    ...getColumnSearchProps('date_Generation'),
                },
                {
                    title: 'Prix_unitaire',
                    dataIndex: 'prix_unitaire',
                    key: 'prix_unitaire',
                    ...getColumnSearchProps('prix_unitaire'),
                },
               
            ]}
            dataSource={record.attestations}
            pagination={{ pageSize: 8 }}
            size="small"
            bordered
            summary={() => (
                <Table.Summary.Row>
                    <Table.Summary.Cell colSpan={2}>Total Consommation</Table.Summary.Cell>
                    <Table.Summary.Cell>
                        {totalConsommation.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Table.Summary.Cell>
                    <Table.Summary.Cell colSpan={3} />
                </Table.Summary.Row>
            )}
            style={{ margin: '20px 0', background: '#f5f5f5', borderRadius: '8px' }}
        />
    );
};
const getCompanyTitle = ({raison_social, id}) => (
    <Link to={`/admin/Apercu/${id}`} style={{ textDecoration: 'none' }}>
        <span style={{ fontWeight: 'bold', fontSize: '94%', color: '#F08080' }}>{raison_social}</span>
    </Link> 
);
    const handleSearchCompanyChange = (value) => {
        setSearchCompany(value);
        const compagnie = soldePrepayes.find(comp => comp.compagnieId === value);
        if (compagnie) {
            handleCompanySelect(compagnie);
        }
    };

    const columns = [
        {
            title:  <span style={{ color: '#607AD6' }}>Compagnie</span>,
            dataIndex: 'raison_social',
            key: 'raison_social',
           
        },
        {
            title: <span style={{ color: '#607AD6' }}>Solde</span>,
            dataIndex: 'soldeCompagnie',
            key: 'soldeCompagnie',
            render: (text, record) => (
                <span style={{ color: '#32CD32' }}>
                    <LoadingOutlined style={{ marginRight: 8 }} />
                    {text !== undefined && text !== null ? text.toFixed(2) : 'N/A'} {record.soldePrepayes.length > 0 ? record.soldePrepayes[0].devise : ''}
                </span>
            ),
        }
    ];

    return (
        <>
            <div className="row justify-content-end">
                <div className="col-lg-2">
                    <Link to="/admin/createSo">
                        <span className="btn btn-sm mb-3 custom-btn-color" style={{ color: '#ffffff', marginLeft: "50%", marginTop:"-40%",backgroundColor:"rgba(96, 122, 214, 0.70)" }}>
                            <AppstoreAddOutlined style={{ color: '#ffffff' }} /> AJOUTER
                        </span>
                    </Link>
                </div>
            </div>
            <div className="container" style={{ display: 'flex', flexDirection: 'column', marginTop: "-2%" }}>
                <Select
                    showSearch
                    placeholder="Chercher une compagnie"
                    optionFilterProp="children"
                    onChange={handleSearchCompanyChange}
                    filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                    style={{ width: '19%', marginBottom: '1px',marginLeft:"-3%" }}
                >
                    {soldePrepayes.map(compagnie => (
                        <Select.Option key={compagnie.compagnieId} value={compagnie.compagnieId}>
                            {compagnie.raison_social}
                        </Select.Option>
                    ))}
                </Select>
                <div style={{ display: 'flex', flexDirection: 'row' }}>
                    <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #f0f0f0', marginLeft: "-5%" }}>
                    <div style={{ flex: 1, padding: '20px', borderRight: '1px solid #f0f0f0', marginLeft: "-5%" }}>
                        <Table
                            columns={columns}
                            size="small"
                            dataSource={searchCompany ? soldePrepayes.filter(comp => comp.compagnieId === searchCompany) : soldePrepayes}
                            rowKey="compagnieId"
                            pagination={false}
                            onRow={(record) => ({
                                onClick: () => handleCompanySelect(record),
                                style: { cursor: 'pointer', backgroundColor: selectedRow === record.compagnieId ? '#F5F5F5' : 'white' }
                            })}
                        />
                    </div>
                    </div>
                    <div style={{ flex: 2, padding: '20px' }}>
                        {selectedCompany ? (
                            <Card
                            title={getCompanyTitle({ raison_social: selectedCompany.raison_social, id: selectedCompany.compagnieId })}
                                extra={
                                    <Space size="small">
                                        <Tooltip title="Recharger">
                                            <span onClick={() => handleSyncClick(selectedCompany.compagnieId)}>
                                                <WalletOutlined style={{ color: 'Tomato' }} />
                                            </span>
                                        </Tooltip>
                                        <Tooltip title="Prépayement/Consommation">
                                            <Switch
                                                checked={toggleState}
                                                onChange={setToggleState}
                                                checkedChildren="Prépayement"
                                                unCheckedChildren="Consommation"
                                            />
                                        </Tooltip>
                                    </Space>
                                }
                                style={{ marginBottom: 20, borderRadius: '8px'}}
                                headStyle={{ minHeight: '40px' }}
                            >
                                {toggleState ? prepayementTable(selectedCompany) : attestationTable(selectedCompany)}
                            </Card>
                        ) : (
                            <div>Sélectionnez une compagnie pour voir les prépaiements</div>
                        )}
                    </div>
                </div>
                {cancelMessage && (
                    <Alert
                        message="Annulation"
                        description={cancelMessage}
                        type="info"
                        showIcon
                        style={{ position: 'absolute', bottom: 20, right: 20 }}
                    />
                )}
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
                
                <Drawer
                    title="Saisir les informations de solde"
                    placement="right"
                    onClose={handleDrawerCancel}
                    open={drawerVisible}
                    width={400}
                >
                    <Form layout="vertical">
                        <Form.Item label="Type" required>
                            <Input
                                type="text"
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item label="Montant" required>
                            <InputNumber
                                min={0}
                                step={0.01}
                                value={solde}
                                onChange={value => setSolde(value)}
                                formatter={value => `${Number(value).toFixed(2)}`}
                                parser={value => parseFloat(value.replace(/[^0-9.]/g, ''))}
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item label="Devise" required>
                            <Select
                                options={currencyOptions}
                                value={devise}
                                onChange={(value) => setDevise(value)}
                                placeholder="Choisir Devise"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item label="Date Approvisionnement" required>
                            <Input
                                type="date"
                                value={date_Abonnement}
                                onChange={(event) => setDate_Abonnement(event.target.value)}
                                placeholder="Entrez Date"
                                style={{ width: '100%' }}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={handleDrawerOk}>
                                OK
                            </Button>
                        </Form.Item>
                    </Form>
                </Drawer>
              
                {isSoldeModalVisible && soldeCompagnie && (
                    <Modal
                        title="Solde Compagnie"
                        open={isSoldeModalVisible}
                        onOk={handleSoldeModalOk}
                        footer={[
                            <Button key="ok" type="primary" onClick={handleSoldeModalOk}>
                                OK
                            </Button>
                        ]}
                    >
                        <p>Solde de la compagnie {soldeCompagnie.raison_social} : {soldeCompagnie.soldeCompagnie !== undefined && soldeCompagnie.soldeCompagnie !== null ? soldeCompagnie.soldeCompagnie.toFixed(2) : 'N/A'}</p>
                    </Modal>
                )}
            </div>
        </>
    );
}

export default SoldePrepayes;
