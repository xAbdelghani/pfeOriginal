// src/components/Profil.js
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../core/axiosConfig";
import { Tabs, Table, Button, Space, Tooltip, Modal, Form, Dropdown, message, Checkbox, Input, Menu, Select } from "antd";
import './Profil.css';
import { CloseOutlined, PlusOutlined, CaretDownOutlined, CaretUpOutlined, SettingOutlined, SearchOutlined, RedoOutlined, PauseOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';

const { TabPane } = Tabs;

const Profil = () => {
  const [companyDetails, setCompanyDetails] = useState({
    nom: "",
    raison_social: "",
    adresse: "",
    telephone: "",
    email: "",
    statut: "",
    pointventeDto: [],
    abonnement: [],
    contactDto: [],
    soldePrepayeDto: [],
    agenceDto: [],
    attestationsAutoriseesDto: []
  });

  const [showCourtier, setShowCourtier] = useState(true);
  const [showAgences, setShowAgences] = useState(true);
  const [showContacts, setShowContacts] = useState(true);
  const [showAbonnements, setShowAbonnements] = useState(true);
  const [showSoldes, setShowSoldes] = useState(true);
  const [showAutorises, setShowAutorises] = useState(true);

  const [selectedColumnsCourtier, setSelectedColumnsCourtier] = useState(['nomp', 'dateDebut', 'dateFin', "latestLibellec", "actions"]);
  const [columnSelectionMenuVisibleCourtier, setColumnSelectionMenuVisibleCourtier] = useState(false);

  const [selectedColumnsAgences, setSelectedColumnsAgences] = useState(['noma', 'date_Debuta', 'date_fina', 'adressea', 'telephonea', "status", "actions"]);
  const [columnSelectionMenuVisibleAgences, setColumnSelectionMenuVisibleAgences] = useState(false);

  const [selectedColumnsContacts, setSelectedColumnsContacts] = useState(['nomc', 'prenomc', 'fax', 'telephonec', 'emailc', 'fonctionDto', "actions"]);
  const [columnSelectionMenuVisibleContacts, setColumnSelectionMenuVisibleContacts] = useState(false);

  const [selectedColumnsAbonnements, setSelectedColumnsAbonnements] = useState(['libelle', 'date_Abonnement', 'date_Fin', 'montant', "actions"]);
  const [columnSelectionMenuVisibleAbonnements, setColumnSelectionMenuVisibleAbonnements] = useState(false);

  const [selectedColumnsSoldes, setSelectedColumnsSoldes] = useState(['type', 'date_Abonnement', 'solde', 'Montant', "actions"]);
  const [columnSelectionMenuVisibleSoldes, setColumnSelectionMenuVisibleSoldes] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [scrollingDown, setScrollingDown] = useState(false);
  const navigate = useNavigate();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [autorisations, setAutorisations] = useState([]);
  const companyId = localStorage.getItem('companyId');
    useEffect(() => {
      load();
    const companyId = localStorage.getItem('companyId');
    if (companyId) {
      axiosInstance.get(`http://localhost:8080/api/v1/compagnie/${companyId}`)
        .then(response => {
          setCompanyDetails(response.data);
        })
        .catch(error => {
          console.error('Erreur lors de la récupération des détails de la compagnie', error);
        });
    }
  }, []);
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

async function load() {
  const result = await axiosInstance.get(`http://localhost:8080/api/v1/attestationAutorisees/byCompagnieAndFlagTrue/${companyId}`);
  setAutorisations(result.data);

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

  const columnSelectionMenuCourtier = (
    <Menu>
      <Menu.Item>
        <Checkbox.Group value={selectedColumnsCourtier} onChange={(checkedValues) => setSelectedColumnsCourtier(checkedValues)}>
          <Checkbox value="nomp">Login</Checkbox>
          <Checkbox value="dateDebut">Date début</Checkbox>
          <Checkbox value="dateFin">Date fin</Checkbox>
          <Checkbox value="actions">Actions</Checkbox>
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );

  const columnsCourtier = [
    {
      title: 'Nom',
      dataIndex: 'nomp',
      key: 'nomp',
      ...getColumnSearchProps('nomp'),
    },
    {
      title: 'Date début',
      dataIndex: 'dateDebut',
      key: 'dateDebut',
      ...getColumnSearchProps('dateDebut'),
    },
    {
      title: 'Date de fin',
      dataIndex: 'dateFin',
      key: 'dateFin',
      ...getColumnSearchProps('dateFin'),
    },
    {
      title: 'Statut',
      dataIndex: 'latestLibellec',
      key: 'latestLibellec',
    },
    {
      title: (
        <Dropdown overlay={columnSelectionMenuCourtier} trigger={['click']} visible={columnSelectionMenuVisibleCourtier} onVisibleChange={setColumnSelectionMenuVisibleCourtier}>
          <SettingOutlined style={{ cursor: 'pointer' }} />
        </Dropdown>
      ),
      key: 'settings',
      align: 'right',
      width: 50,
    },
  ];

  const selectedColumnsConfigCourtier = columnsCourtier.filter(column => selectedColumnsCourtier.includes(column.key) || column.key === 'settings');

  const columnSelectionMenuAgences = (
    <Menu>
      <Menu.Item>
        <Checkbox.Group value={selectedColumnsAgences} onChange={(checkedValues) => setSelectedColumnsAgences(checkedValues)}>
          <Checkbox value="noma">Raison Sociale</Checkbox>
          <Checkbox value="date_Debuta">Date Début</Checkbox>
          <Checkbox value="date_fina">Date Fin</Checkbox>
          <Checkbox value="adressea">Adresse</Checkbox>
          <Checkbox value="telephonea">Téléphone</Checkbox>
          <Checkbox value="actions">Actions</Checkbox>
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );

  const columnsAgences = [
    {
      title: 'Raison Sociale',
      dataIndex: 'noma',
      key: 'noma',
      ...getColumnSearchProps('noma'),
    },
    {
      title: 'Date Début',
      dataIndex: 'date_Debuta',
      key: 'date_Debuta',
      ...getColumnSearchProps('date_Debuta'),
    },
    {
      title: 'Date Fin',
      dataIndex: 'date_fina',
      key: 'date_fina',
      ...getColumnSearchProps('date_fina'),
    },
    {
      title: 'Adresse',
      dataIndex: 'adressea',
      key: 'adressea',
      ...getColumnSearchProps('adressea'),
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephonea',
      key: 'telephonea',
      ...getColumnSearchProps('telephonea'),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
    },
    {
      title: (
        <Dropdown overlay={columnSelectionMenuAgences} trigger={['click']} visible={columnSelectionMenuVisibleAgences} onVisibleChange={setColumnSelectionMenuVisibleAgences}>
          <SettingOutlined style={{ cursor: 'pointer' }} />
        </Dropdown>
      ),
      key: 'settings',
      align: 'right',
      width: 50,
    },
  ];

  const selectedColumnsConfigAgences = columnsAgences.filter(column => selectedColumnsAgences.includes(column.key) || column.key === 'settings');

  const columnSelectionMenuContacts = (
    <Menu>
      <Menu.Item>
        <Checkbox.Group value={selectedColumnsContacts} onChange={(checkedValues) => setSelectedColumnsContacts(checkedValues)}>
          <Checkbox value="nomc">Nom</Checkbox>
          <Checkbox value="prenomc">Prenom</Checkbox>
          <Checkbox value="fax">Faxe</Checkbox>
          <Checkbox value="telephonec">Téléphone</Checkbox>
          <Checkbox value="emailc">Email</Checkbox>
          <Checkbox value="fonctionDto">Fonction</Checkbox>
          <Checkbox value="actions">Actions</Checkbox>
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );

  const columnsContacts = [
    {
      title: 'Nom',
      dataIndex: 'nomc',
      key: 'nomc',
      ...getColumnSearchProps('nomc'),
    },
    {
      title: 'Prenom',
      dataIndex: 'prenomc',
      key: 'prenomc',
      ...getColumnSearchProps('prenomc'),
    },
    {
      title: 'Fixe',
      dataIndex: 'fax',
      key: 'fax',
      ...getColumnSearchProps('fax'),
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephonec',
      key: 'telephonec',
      ...getColumnSearchProps('telephonec'),
    },
    {
      title: 'Email',
      dataIndex: 'emailc',
      key: 'emailc',
      ...getColumnSearchProps('emailc'),
    },
    {
      title: 'Fonction',
      dataIndex: 'fonctionDto',
      key: 'fonctionDto',
      ...getColumnSearchProps('fonctionDto'),
    },
    {
      title: (
        <Dropdown overlay={columnSelectionMenuContacts} trigger={['click']} visible={columnSelectionMenuVisibleContacts} onVisibleChange={setColumnSelectionMenuVisibleContacts}>
          <SettingOutlined style={{ cursor: 'pointer' }} />
        </Dropdown>
      ),
      key: 'settings',
      align: 'right',
      width: 50,
    },
  ];

  const selectedColumnsConfigContacts = columnsContacts.filter(column => selectedColumnsContacts.includes(column.key) || column.key === 'settings');

  const columnsAttestationautorises = [
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
             
          >
              {flag ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          </span>
      ),
  }
  ];
  const toggleFlag = async (id) => {
    setCurrentId(id);
    setConfirmVisible(true);
};
  const columnSelectionMenuAbonnements = (
    <Menu>
      <Menu.Item>
        <Checkbox.Group value={selectedColumnsAbonnements} onChange={(checkedValues) => setSelectedColumnsAbonnements(checkedValues)}>
          <Checkbox value="libelle">Type</Checkbox>
          <Checkbox value="date_Abonnement">Date début</Checkbox>
          <Checkbox value="date_Fin">Date fin</Checkbox>
          <Checkbox value="montant">Montant abonnement</Checkbox>
          <Checkbox value="actions">Actions</Checkbox>
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );

  const columnsAbonnements = [
    {
      title: 'Type',
      dataIndex: 'libelle',
      key: 'libelle',
      ...getColumnSearchProps('libelle'),
    },
    {
      title: 'Date début',
      dataIndex: 'date_Abonnement',
      key: 'date_Abonnement',
      ...getColumnSearchProps('date_Abonnement'),
    },
    {
      title: 'Date fin',
      dataIndex: 'date_Fin',
      key: 'date_Fin',
      ...getColumnSearchProps('date_Fin'),
    },
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      ...getColumnSearchProps('montant'),
    },
    {
      title: (
        <Dropdown overlay={columnSelectionMenuAbonnements} trigger={['click']} visible={columnSelectionMenuVisibleAbonnements} onVisibleChange={setColumnSelectionMenuVisibleAbonnements}>
          <SettingOutlined style={{ cursor: 'pointer' }} />
        </Dropdown>
      ),
      key: 'settings',
      align: 'right',
      width: 50,
    },
  ];

  const selectedColumnsConfigAbonnements = columnsAbonnements.filter(column => selectedColumnsAbonnements.includes(column.key) || column.key === 'settings');

  const columnSelectionMenuSoldes = (
    <Menu>
      <Menu.Item>
        <Checkbox.Group value={selectedColumnsSoldes} onChange={(checkedValues) => setSelectedColumnsSoldes(checkedValues)}>
          <Checkbox value="type">Type</Checkbox>
          <Checkbox value="date_Abonnement">Date Abonnement</Checkbox>
          <Checkbox value="solde">Solde_Prepayé</Checkbox>
          <Checkbox value="solde_attestation">Solde</Checkbox>
          <Checkbox value="actions">Actions</Checkbox>
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );

  const columnsSoldes = [
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      ...getColumnSearchProps('type'),
    },
    {
      title: ' Date Abonnement',
      dataIndex: 'date_Abonnement',
      key: 'date_Abonnement',
      ...getColumnSearchProps('date_Abonnement'),
    },
    {
      title: 'Coût',
      dataIndex: 'solde',
      key: 'solde',
      ...getColumnSearchProps('solde'),
    },
    {
      title: (
        <Dropdown overlay={columnSelectionMenuSoldes} trigger={['click']} visible={columnSelectionMenuVisibleSoldes} onVisibleChange={setColumnSelectionMenuVisibleSoldes}>
          <SettingOutlined style={{ cursor: 'pointer' }} />
        </Dropdown>
      ),
      key: 'settings',
      align: 'right',
      width: 50,
    },
  ];

  const selectedColumnsConfigSoldes = columnsSoldes.filter(column => selectedColumnsSoldes.includes(column.key) || column.key === 'settings');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate("/");
  };

  return (
    <div className="container">
      {scrollingDown && (
        <Button type="primary" className="scroll-to-top-button" onClick={scrollToTop} style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: "1000",
          backgroundColor: 'rgba(96, 122, 214, 0.99)'
        }}>
          Retour
        </Button>
      )}

      <h4>Compagnie</h4>
      <div className="card">
        <div className="card-body">
          <div className="card-item">
            <strong>Raison Sociale  : </strong> {companyDetails.raison_social}
          </div>
          <div className="card-item">
            <strong>Adresse :</strong> {companyDetails.adresse}
          </div>
          <div className="card-item">
            <strong>Téléphone :</strong> {companyDetails.telephone}
          </div>
          <div className="card-item">
            <strong>Email :</strong> {companyDetails.email}
          </div>
        </div>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Courtiers" key="1">
          <h4 className="text-start" onClick={() => setShowCourtier(!showCourtier)}>
            {showCourtier ? <CaretDownOutlined style={{ fontSize: '17px' }} /> : <CaretUpOutlined style={{ fontSize: '17px' }} />} Courtiers
          </h4>
          {showCourtier && (
            <div className="card">
              <div className="card-body">
                <Table columns={selectedColumnsConfigCourtier} dataSource={companyDetails.relationPointventeCompagnieDto} rowKey="id" pagination={false} scroll={{ y: 180 }} size="small" />
              </div>
            </div>
          )}
        </TabPane>

        <TabPane tab="Agences" key="2">
          <h4 className="text-start" onClick={() => setShowAgences(!showAgences)}>
            {showAgences ? <CaretDownOutlined style={{ fontSize: '17px' }} /> : <CaretUpOutlined style={{ fontSize: '17px' }} />} Agences
          </h4>
          {showAgences && (
            <div className="card">
              <div className="card-body">
                <Table columns={selectedColumnsConfigAgences} dataSource={companyDetails.agenceDto} rowKey="id" pagination={false} scroll={{ y: 180 }} size="small" />
              </div>
            </div>
          )}
        </TabPane>

        <TabPane tab="Contacts" key="3">
          <h4 className="text-start" onClick={() => setShowContacts(!showContacts)}>
            {showContacts ? <CaretDownOutlined style={{ fontSize: '17px' }} /> : <CaretUpOutlined style={{ fontSize: '17px' }} />} Contacts
          </h4>
          {showContacts && (
            <div className="card">
              <div className="card-body">
                <Table columns={selectedColumnsConfigContacts} dataSource={companyDetails.contactDto} rowKey="id" pagination={false} scroll={{ y: 180 }} size="small" />
              </div>
            </div>
          )}
        </TabPane>

        <TabPane tab="Abonnements" key="4">
          <h4 className="text-start" onClick={() => setShowAbonnements(!showAbonnements)}>
            {showAbonnements ? <CaretDownOutlined style={{ fontSize: '17px' }} /> : <CaretUpOutlined style={{ fontSize: '17px' }} />} Abonnements
          </h4>
          {showAbonnements && (
            <div className="card">
              <div className="card-body">
                <Table columns={selectedColumnsConfigAbonnements} dataSource={companyDetails.abonnement} rowKey="id" pagination={false} scroll={{ y: 180 }} size="small" />
              </div>
            </div>
          )}
        </TabPane>

        <TabPane tab="Soldes" key="5">
          <h4 className="text-start" onClick={() => setShowSoldes(!showSoldes)}>
            {showSoldes ? <CaretDownOutlined style={{ fontSize: '17px' }} /> : <CaretUpOutlined style={{ fontSize: '17px' }} />} Soldes
          </h4>
          {showSoldes && (
            <div className="card">
              <div className="card-body">
                <Table columns={selectedColumnsConfigSoldes} dataSource={companyDetails.soldePrepayeDto} rowKey="id" pagination={false} scroll={{ y: 180 }} size="small" />
              </div>
            </div>
          )}
        </TabPane>

        <TabPane tab="Attestations Autorisées" key="6">
          <h4 className="text-start" onClick={() => setShowAutorises(!showAutorises)}>
            {showAutorises ? <CaretDownOutlined style={{ fontSize: '17px' }} /> : <CaretUpOutlined style={{ fontSize: '17px' }} />} Attestations Autorisées
          </h4>
          {showAutorises && (
            <div className="card">
              <div className="card-body" style={{ marginTop: "1.9%" }}>
                <Table columns={columnsAttestationautorises} dataSource={autorisations ? autorisations.map((autorisation) => ({ ...autorisation, key: autorisation.id })) : []} rowKey="id" pagination={false} scroll={{ y: 180 }} size="small" />
              </div>
            </div>
          )}
        </TabPane>
      </Tabs>

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
    </div>
  );
};

export default Profil;
