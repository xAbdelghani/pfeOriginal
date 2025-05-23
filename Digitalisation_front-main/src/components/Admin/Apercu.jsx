import React, { useEffect, useState, useRef } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { Tabs, Tag, Table, Button, Space, Tooltip, Modal, Form, Dropdown,message, Checkbox, Input, Menu, Select } from "antd";
import { CloseOutlined, PlusOutlined, CaretDownOutlined, CaretUpOutlined, SettingOutlined, SearchOutlined, RedoOutlined,PauseOutlined,CheckCircleOutlined,CloseCircleOutlined } from "@ant-design/icons";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Highlighter from 'react-highlight-words';
import axiosInstance from "../../core/axiosConfig";

const { TabPane } = Tabs;
const { Option } = Select;

export default function Apercu() {
  const [compagnie, setCompagnie] = useState({
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

  const [statutCs, setStatutCs] = useState([]);
  const [showCompagnie, setShowCompagnie] = useState(true);
  const [showCourtier, setShowCourtier] = useState(true);
  const [showAgences, setShowAgences] = useState(true);
  const [showContacts, setShowContacts] = useState(true);
  const [showAbonnements, setShowAbonnements] = useState(true);
  const [showSoldes, setShowSoldes] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [form] = Form.useForm();
  const [updateMessage, setUpdateMessage] = useState('');
  const [errorUpdateMessage, setErrorUpdateMessage] = useState('');
  const [unrelatedCourtiers, setUnrelatedCourtiers] = useState([]);
  const [selectedCourtiers, setSelectedCourtiers] = useState([]);
  const [modalVisibll, setModalVisibll] = useState(false);
  const [raison, setRaison] = useState('');
  const [addAgenceModalVisible, setAddAgenceModalVisible] = useState(false);
  const [addContactModalVisible, setAddContactModalVisible] = useState(false);
  const [addCourtierModalVisible, setAddCourtierModalVisible] = useState(false);
  const [statutCId, setStatutCId] = useState('');
  const [noma, setNoma] = useState("");
  const [adressea, setAdressea] = useState("");
  const [telephonea, setTelephonea] = useState("");
  const [date_Debuta, setDate_Debuta] = useState("");
  const [date_fina, setDate_fina] = useState("");
  const [nomc, setNomc] = useState('');
  const [prenomc, setPrenomc] = useState('');
  const [fax, setFax] = useState('');
  const [emailc, setEmailc] = useState('');
  const [telephonec, setTelephonec] = useState('');
  const [contactId, setId] = useState('');
  const { compagnieId } = useParams();
  const [fonctions, setFonctions] = useState([]);
  const [pointventes, setPointventes] = useState([]);
  const [dateDebut, setDateDebut] = useState(null);
  const [dateFin, setDateFin] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [scrollingDown, setScrollingDown] = useState(false);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(null);
  const [editedDateDebut, setEditedDateDebut] = useState('');
  const [editedDateFin, setEditedDateFin] = useState('');
  const [editedStatut, setEditedStatut] = useState('');
  const [selectedColumnsCompagnie, setSelectedColumnsCompagnie] = useState(['nom', 'raison_social', 'adresse', 'telephone', 'email']);
  const [columnSelectionMenuVisibleCompagnie, setColumnSelectionMenuVisibleCompagnie] = useState(false);
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
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [confirmRecord, setConfirmRecord] = useState(null);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmContent, setConfirmContent] = useState('');
  const [selectedId, setSelectedId] = useState(null);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [autorisations, setAutorisations] = useState([]);
  const [showAutorises, setShowAutorises] = useState(true);
  useEffect(() => {
    const handleScroll = () => {
      const isScrolledDown = window.scrollY > 0;
      setScrollingDown(isScrolledDown);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    axiosInstance.get("http://localhost:8080/api/v1/fonction/getall")
      .then(response => {
        setFonctions(response.data);
      })
      .catch(error => {
        console.error('Error fetching fonctions:', error);
      }); 
  }, []);

  async function Load() {
    const result = await axiosInstance.get("http://localhost:8080/api/v1/fonction/getall");
    setFonctions(result.data);
  }

  async function loadPointventes() {
    const result = await axiosInstance.get("http://localhost:8080/api/v1/pointvente/getall");
    setPointventes(result.data);
  }

  useEffect(() => {
    loadUser();
    Load();
    loadPointventes();
    loadStatutCs();
  }, []);

  async function loadStatutCs() {
    try {
      const result = await axiosInstance.get("http://localhost:8080/api/v1/statutC/getall");
      setStatutCs(result.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des types d'abonnement:", error);
    }
  }

  const loadUser = async () => {
    try {
      const result = await axiosInstance.get(`http://localhost:8080/api/v1/compagnie/${compagnieId}`);
      setCompagnie(result.data);
      form.setFieldsValue(result.data);
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const showAddAgenceModal = () => {
    setAddAgenceModalVisible(true);
  };
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
                statutCId: 53, // ID du statut "Suspendu", assurez-vous de le changer selon votre logique
                raison: raison
            });
            setModalVisibll(false);
            setRaison('');
            setSelectedId(null);
            loadUser();
            // Mettez à jour votre interface utilisateur ici après la suspension
        } catch (error) {
            console.error("There was an error suspending the record!", error);
        }
    }
}
  const handleAddAgence = async () => {
    try {
      await axiosInstance.post("http://localhost:8080/api/v1/agence/save", {
        noma: noma,
        adressea: adressea,
        telephonea: telephonea,
        date_Debuta: date_Debuta,
        date_fina: date_fina,
        ownerag: { id: compagnieId }
      }).then(() => { setAddAgenceModalVisible(false); });
      setNoma("");
      setAdressea("");
      setTelephonea("");
      setDate_Debuta("");
      setDate_fina("");
      loadUser();
      localStorage.setItem('successMessage', 'La nouvelle compagnie a été sauvegardée avec succès.');
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'agence :", error);
    }
    setAddAgenceModalVisible(false);
  };

  const showAddContactModal = () => {
    setAddContactModalVisible(true);
  };

  const handleAddContact = async () => {
    try {
      await axiosInstance.post("http://localhost:8080/api/v1/contact/save", {
        nomc,
        prenomc,
        fax,
        emailc,
        telephonec,
        ownerco: { id: compagnieId },
        ownerfo: { id: contactId }
      }).then(() => { setAddCourtierModalVisible(false); });
      loadUser();
      localStorage.setItem('successMessage', 'La nouvelle compagnie a été sauvegardée avec succès.');
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'agence :", error);
    }
    setAddCourtierModalVisible(false);
  };

  const showAddCourtierModal = () => {
    setAddCourtierModalVisible(true);
  };

  const handleAddCourtier = async () => {
    try {
      await axiosInstance.post(`http://localhost:8080/api/v1/relationcp/save/${statutCId}`, {
        dateDebut,
        dateFin,
        compagnie: { id: compagnieId },
        pointvente: { id: contactId },
        status: statutCId
      }).then(() => { setAddCourtierModalVisible(false); });
      loadUser();
      localStorage.setItem('successMessage', 'La nouvelle compagnie a été sauvegardée avec succès.');
    } catch (error) {
      console.error("Erreur lors de l'ajout de l'agence :", error);
    }
    setAddContactModalVisible(false);
  };

  const restaurerCourtier = (courtier) => {
    setIsEditing(courtier.id);
    setEditedDateDebut(courtier.dateDebut);
    setEditedDateFin(courtier.dateFin);
    setEditedStatut("En cours");
  };
  async function handleSuspend(recordId) {
    setSelectedId(recordId);
    setModalVisibll(true);
}
  const saveCourtierChanges = async (id) => {
    try {
      const payload = {
        dateDebut: editedDateDebut,
        dateFin: editedDateFin,
        statutCId: editedStatut
      };

      await axiosInstance.put(`http://localhost:8080/api/v1/relationcp/edit/${id}`, payload);
      loadUser();
      setIsEditing(null);
    } catch (error) {
      console.error("Error saving courtier changes:", error);
    }
  };

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

      loadUser();
    } catch (error) {
      console.error("Error cancelling courtier:", error);
    }
  };

  const annulerAgence = async (agenceId) => {
    try {
      const response = await axiosInstance.put(`http://localhost:8080/api/v1/agence/updateDateFinToToday/${agenceId}`);
      console.log("Response from updateDateFinToToday:", response);
      loadUser();
    } catch (error) {
      console.error("Error cancelling agence:", error);
    }
  };

  const annulerContact = async (contactId) => {
    try {
      await axiosInstance.put(`http://localhost:8080/api/v1/contact/removeCompany/${contactId}`);
      loadUser();
    } catch (error) {
      console.error("Error cancelling contact:", error);
    }
  };

  async function rePartenariat(agenceId) {
    try {
      await axiosInstance.put(`http://localhost:8080/api/v1/agence/reestablishCompany/${agenceId}`);
      loadUser();
    } catch (error) {
      console.error("Error re-establishing partnership", error);
    }
  }

  const annulerAbonnement = async (abonnementId) => {
    try {
      await axiosInstance.put(`http://localhost:8080/api/v1/abonnement/removeCompany/${abonnementId}`);
      loadUser();
    } catch (error) {
      console.error("Error cancelling abonnement:", error);
    }
  };

  const annulerSolde = async (soldeId) => {
    try {
      await axiosInstance.put(`http://localhost:8080/api/v1/solde/removeCompany/${soldeId}`);
      loadUser();
    } catch (error) {
      console.error("Error cancelling solde:", error);
    }
  };
  const toggleFlag = async (id) => {
    setCurrentId(id);
    setConfirmVisible(true);
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

  const columnSelectionMenuCompagnie = (
    <Menu>
      <Menu.Item>
        <Checkbox.Group value={selectedColumnsCompagnie} onChange={(checkedValues) => setSelectedColumnsCompagnie(checkedValues)}>
          <Checkbox value="nom">Login</Checkbox>
          <Checkbox value="raison_social">Raison Sociale</Checkbox>
          <Checkbox value="adresse">Adresse</Checkbox>
          <Checkbox value="telephone">Téléphone</Checkbox>
          <Checkbox value="email">Email</Checkbox>
        </Checkbox.Group>
      </Menu.Item>
    </Menu>
  );

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const columnsCompagnie = [
    { title: 'Nom', dataIndex: 'nom', key: 'nom' },
    { title: 'Raison Sociale', dataIndex: 'raison_social', key: 'raison_social' },
    { title: 'Adresse', dataIndex: 'adresse', key: 'adresse' },
    { title: 'Téléphone', dataIndex: 'telephone', key: 'telephone' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: (
        <Dropdown overlay={columnSelectionMenuCompagnie} trigger={['click']} visible={columnSelectionMenuVisibleCompagnie} onVisibleChange={setColumnSelectionMenuVisibleCompagnie}>
          <SettingOutlined style={{ cursor: 'pointer' }} />
        </Dropdown>
      ),
      key: 'settings',
      align: 'center',
      width: 50,
    },
  ];
  const selectedColumnsConfi = columnsCompagnie.filter(column => selectedColumnsCompagnie.includes(column.key) || column.key === 'settings');

  const columnsCourtier = [
    {
        title: 'Nom',
        dataIndex: 'nomp',
        key: 'nomp',
        ...getColumnSearchProps('nomp'),
        render: (text, record) => (
            editing && editingSection === 'courtiers' ? <Form.Item name={['relationPointventeCompagnieDto', record.key, 'nomp']} initialValue={text} noStyle><Input /></Form.Item> : text
        ),
    },
    {
        title: 'Date début',
        dataIndex: 'dateDebut',
        key: 'dateDebut',
        ...getColumnSearchProps('dateDebut'),
        render: (text, record) => (
            isEditing === record.id ? <Input type="date" value={editedDateDebut} onChange={(e) => setEditedDateDebut(e.target.value)} /> : text
        ),
    },
    {
        title: 'Date de fin',
        dataIndex: 'dateFin',
        key: 'dateFin',
        ...getColumnSearchProps('dateFin'),
        render: (text, record) => (
            isEditing === record.id ? <Input type="date" value={editedDateFin} onChange={(e) => setEditedDateFin(e.target.value)} /> : text
        ),
    },
    {
        title: 'Statut',
        dataIndex: 'latestLibellec',
        key: 'latestLibellec',
        render: (text, record) => (
            isEditing === record.id ? (
                <Select value={editedStatut} onChange={setEditedStatut}>
                    {statutCs.map((statut) => (
                        <Option key={statut.id} value={statut.id}>{statut.libellec}</Option>
                    ))}
                </Select>
            ) : text
        ),
    },
    {
        title: 'Actions',
        key: 'actions',
        render: (record) => {
            if (record.latestLibellec === 'Expiré') {
                return null;
            }

            const todayDate = getTodayDate();
            const isToday = record.dateFin <= todayDate;
            return isEditing === record.id ? (
                <Space size="middle">
                    <Button onClick={() => saveCourtierChanges(record.id)}>Save</Button>
                    <Button onClick={() => setIsEditing(null)}>Cancel</Button>
                </Space>
            ) : (
                <Space size="middle">
                    {record.latestLibellec === 'Suspendu' ? (
                        <Tooltip title="Renouvler">
                            <Button
                                icon={<RedoOutlined style={{ fontSize: '12px', color: "#006400" }} />}
                                size="small"
                                onClick={() => {  setConfirmTitle("Restaurer Courtier");
                                  setConfirmContent("Êtes-vous sûr de vouloir restaurer cet enregistrement?");
                                  setConfirmAction(() => () => restaurerCourtier(record));
                                  setConfirmRecord(record);
                                  setConfirmModalVisible(true);}}
                            />
                        </Tooltip>
                        
                    ) : (
                      <>
                      <Tooltip title="Résilier">
                          <Button
                              icon={<CloseOutlined style={{ fontSize: '12px', color: "red" }} />}
                              size="small"
                              onClick={() => {
                                  setConfirmTitle("Annuler Courtier");
                                  setConfirmContent("Êtes-vous sûr de vouloir annuler cet enregistrement?");
                                  setConfirmAction(() => () => annulerCourtier(record.id));
                                  setConfirmRecord(record);
                                  setConfirmModalVisible(true);
                              }}
                          />
                      </Tooltip>
                      <Tooltip title="Suspendu">
                          <Button
                              icon={<PauseOutlined style={{ fontSize: '12px', color: "orange" }} />}
                              size="small"
                              onClick={() => handleSuspend(record.id) }
                          />
                      </Tooltip>
                  </>
                        
                    )}
                </Space>
            );
        },
    },
];

  const selectedColumnsConfig = columnsCourtier.filter(column => selectedColumnsCourtier.includes(column.key) || column.key === 'settings');

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

  const getCellStyle = (record) => {
    return !record.date_fina ? {} : { color: 'lightgrey' };
  };
  const columnsAgences = [
    {
      title: 'Raison Sociale',
      dataIndex: 'noma',
      key: 'noma',
      ...getColumnSearchProps('noma'),
      render: (text, record) => (
        <span style={getCellStyle(record)}>
          {editing && editingSection === 'agences' ?
            <Form.Item name={['agenceDto', record.key, 'noma']} initialValue={text} noStyle>
              <Input />
            </Form.Item>
            :
            text
          }
        </span>
      ),
    },
    {
      title: 'Date Début',
      dataIndex: 'date_Debuta',
      key: 'date_Debuta',
      ...getColumnSearchProps('date_Debuta'),
      render: (text, record) => (
        <span style={getCellStyle(record)}>
          {editing && editingSection === 'agences' ?
            <Form.Item name={['agenceDto', record.key, 'date_Debuta']} initialValue={text} noStyle>
              <Input type="date" />
            </Form.Item>
            :
            text
          }
        </span>
      ),
    },
    {
      title: 'Date Fin',
      dataIndex: 'date_fina',
      key: 'date_fina',
      ...getColumnSearchProps('date_fina'),
      render: (text, record) => (
        <span style={getCellStyle(record)}>
          {editing && editingSection === 'agences' ?
            <Form.Item name={['agenceDto', record.key, 'date_fina']} initialValue={text} noStyle>
              <Input type="date" />
            </Form.Item>
            :
            text
          }
        </span>
      ),
    },
    {
      title: 'Adresse',
      dataIndex: 'adressea',
      key: 'adressea',
      ...getColumnSearchProps('adressea'),
      render: (text, record) => (
        <span style={getCellStyle(record)}>
          {editing && editingSection === 'agences' ?
            <Form.Item name={['agenceDto', record.key, 'adressea']} initialValue={text} noStyle>
              <Input />
            </Form.Item>
            :
            text
          }
        </span>
      ),
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephonea',
      key: 'telephonea',
      ...getColumnSearchProps('telephonea'),
      render: (text, record) => (
        <span style={getCellStyle(record)}>
          {editing && editingSection === 'agences' ?
            <Form.Item name={['agenceDto', record.key, 'telephonea']} initialValue={text} noStyle>
              <Input />
            </Form.Item>
            :
            text
          }
        </span>
      ),
    },
    {
      title: 'Statut',
      dataIndex: 'status',
      key: 'status',
      ...getColumnSearchProps('status'),
      render: (text, record) => (
        <span style={getCellStyle(record)}>
          <Tag color={text.toUpperCase() === 'OUVERT' ? 'green' : 'red'}>
            {text.toUpperCase()}
          </Tag>
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Space size="middle">
          {record.date_fina ? (
            <Tooltip title="Restaurer">
              <Button
                icon={<RedoOutlined style={{ fontSize: '12px', color: "#006400" }} />}
                size="small"
                onClick={() => {
                  setConfirmTitle("Restaurer Agence");
                  setConfirmContent("Êtes-vous sûr de vouloir restaurer cet enregistrement?");
                  setConfirmAction(() => () => rePartenariat(record.id));
                  setConfirmRecord(record);
                  setConfirmModalVisible(true);
                }}
              />
            </Tooltip>
          ) : (
            <Tooltip title="Annuler">
              <Button
                icon={<CloseOutlined style={{ fontSize: '12px', color: "red" }} />}
                size="small"
                onClick={() => {
                  setConfirmTitle("Annuler Agence");
                  setConfirmContent("Êtes-vous sûr de vouloir annuler cet enregistrement?");
                  setConfirmAction(() => () => annulerAgence(record.id));
                  setConfirmRecord(record);
                  setConfirmModalVisible(true);
                }}
              />
            </Tooltip>
          )}
        </Space>
      ),
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
  const selectedColumnsConfig1 = columnsAgences.filter(column => selectedColumnsAgences.includes(column.key) || column.key === 'settings');

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
      render: (text, record) => (
        editing && editingSection === 'contacts' ? <Form.Item name={['contactDto', record.key, 'nomc']} initialValue={text} noStyle><Input /></Form.Item> : text
      ),
    },
    {
      title: 'Prenom',
      dataIndex: 'prenomc',
      key: 'prenomc',
      ...getColumnSearchProps('prenomc'),
      render: (text, record) => (
        editing && editingSection === 'contacts' ? <Form.Item name={['contactDto', record.key, 'prenomc']} initialValue={text} noStyle><Input /></Form.Item> : text
      ),
    },
    {
      title: 'Fixe',
      dataIndex: 'fax',
      key: 'fax',
      ...getColumnSearchProps('fax'),
      render: (text, record) => (
        editing && editingSection === 'contacts' ? <Form.Item name={['contactDto', record.key, 'fax']} initialValue={text} noStyle><Input /></Form.Item> : text
      ),
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephonec',
      key: 'telephonec',
      ...getColumnSearchProps('telephonec'),
      render: (text, record) => (
        editing && editingSection === 'contacts' ? <Form.Item name={['contactDto', record.key, 'telephonec']} initialValue={text} noStyle><Input /></Form.Item> : text
      ),
    },
    {
      title: 'Email',
      dataIndex: 'emailc',
      key: 'emailc',
      ...getColumnSearchProps('emailc'),
      render: (text, record) => (
        editing && editingSection === 'contacts' ? <Form.Item name={['contactDto', record.key, 'emailc']} initialValue={text} noStyle><Input /></Form.Item> : text
      ),
    },
    {
      title: 'Fonction',
      dataIndex: 'fonctionDto',
      key: 'fonctionDto',
      ...getColumnSearchProps('nomp'),
      render: (text, record) => (
        editing && editingSection === 'contacts' ?
          <Form.Item name={['contactDto', record.key, 'qualite']} initialValue={text?.id} noStyle>
            <Select className="custom-select" showSearch placeholder="Choisir Fonction" optionFilterProp="children">
              {fonctions.map((fonction) => (
                <Option key={fonction.id} value={fonction.id}>
                  {fonction.qualite}
                </Option>
              ))}
            </Select>
          </Form.Item> :
          (record.fonctionDto && record.fonctionDto.qualite)
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Space size="middle">
          <Tooltip title="Annuler">
            <Button
              icon={<CloseOutlined style={{ fontSize: '12px', color: "red" }} />}
              size="small"
              onClick={() => {
                setConfirmTitle("Annuler Contact");
                setConfirmContent("Êtes-vous sûr de vouloir annuler cet enregistrement?");
                setConfirmAction(() => () => annulerContact(record.id));
                setConfirmRecord(record);
                setConfirmModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
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
  const selectedColumnsConfig2 = columnsContacts.filter(column => selectedColumnsContacts.includes(column.key) || column.key === 'settings');
  
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
              onClick={() => toggleFlag(record.id)}
          >
              {flag ? <CheckCircleOutlined /> : <CloseCircleOutlined />}
          </span>
      ),
  }
  ];

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
      render: (text, record) => (
        editing && editingSection === 'abonnements' ? <Form.Item name={['abonnement', record.key, 'libelle']} initialValue={text} noStyle><Input /></Form.Item> : text
      ),
    },
    {
      title: 'Date début',
      dataIndex: 'date_Abonnement',
      key: 'date_Abonnement',
      ...getColumnSearchProps('date_Abonnement'),
      render: (text, record) => (
        editing && editingSection === 'abonnements' ? <Form.Item name={['abonnement', record.key, 'date_Abonnement']} initialValue={text} noStyle><Input type="date" /></Form.Item> : text
      ),
    },
    {
      title: 'Date fin',
      dataIndex: 'date_Fin',
      key: 'date_Fin',
      ...getColumnSearchProps('date_Fin'),
      render: (text, record) => (
        editing && editingSection === 'abonnements' ? <Form.Item name={['abonnement', record.key, 'date_Fin']} initialValue={text} noStyle><Input type="date" /></Form.Item> : text
      ),
    },
    {
      title: 'Montant',
      dataIndex: 'montant',
      key: 'montant',
      ...getColumnSearchProps('montant'),
      render: (text, record) => (
        editing && editingSection === 'abonnements' ? <Form.Item name={['abonnement', record.key, 'montant']} initialValue={text} noStyle><Input /></Form.Item> : text
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Space size="middle">
          <Tooltip title="Annuler">
            <Button
              icon={<CloseOutlined style={{ fontSize: '12px', color: "red" }} />}
              size="small"
              onClick={() => {
                setConfirmTitle("Annuler Abonnement");
                setConfirmContent("Êtes-vous sûr de vouloir annuler cet enregistrement?");
                setConfirmAction(() => () => annulerAbonnement(record.id));
                setConfirmRecord(record);
                setConfirmModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
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
  const selectedColumnsConfig3 = columnsAbonnements.filter(column => selectedColumnsAbonnements.includes(column.key) || column.key === 'settings');

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
      render: (text, record) => (
        editing && editingSection === 'soldes' ? <Form.Item name={['soldePrepayeDto', record.key, 'type']} initialValue={text} noStyle><Input /></Form.Item> : text
      ),
    },
    {
      title: ' Date Abonnement',
      dataIndex: 'date_Abonnement',
      key: 'date_Abonnement',
      ...getColumnSearchProps('date_Abonnement'),
      render: (text, record) => (
        editing && editingSection === 'soldes' ? <Form.Item name={['soldePrepayeDto', record.key, 'date_Abonnement']} initialValue={text} noStyle><Input type="date" /></Form.Item> : text
      ),
    },
    {
      title: 'Coût',
      dataIndex: 'solde',
      key: 'solde',
      ...getColumnSearchProps('solde'),
      render: (text, record) => (
        editing && editingSection === 'soldes' ? <Form.Item name={['soldePrepayeDto', record.key, 'solde']} initialValue={text} noStyle><Input /></Form.Item> : text
      ),
    },
   
  /* {
      title: 'Actions',
      key: 'actions',
      render: (record) => (
        <Space size="middle">
          <Tooltip title="Annuler">
            <Button
              icon={<CloseOutlined style={{ fontSize: '12px', color: "red" }} />}
              size="small"
              onClick={() => {
                setConfirmTitle("Annuler Solde");
                setConfirmContent("Êtes-vous sûr de vouloir annuler cet enregistrement?");
                setConfirmAction(() => () => annulerSolde(record.id));
                setConfirmRecord(record);
                setConfirmModalVisible(true);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },*/
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
  const selectedColumnsConfig4 = columnsSoldes.filter(column => selectedColumnsSoldes.includes(column.key) || column.key === 'settings');

  const filterColumns = (columns, selectedColumns) => {
    return columns.filter(col => selectedColumns.includes(col.key));
  };

  if (!compagnie) {
    return <div>Loading...</div>;
  }

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

               
  
    <h4>Compagnie</h4>
    <div className="card">
  <div className="card-body">
    <div className="card-item">
      <strong>Raison Sociale  : </strong> {compagnie.raison_social}
    </div>
    <div className="card-item">
      <strong>Adresse :</strong> {compagnie.adresse}
    </div>
    <div className="card-item">
      <strong>Téléphone :</strong> {compagnie.telephone}
    </div>
    <div className="card-item">
      <strong>Email :</strong> {compagnie.email}
    </div>
  </div>
</div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Courtiers" key="1">
          <h4 className="text-start" onClick={() => setShowCourtier(!showCourtier)} >
            {showCourtier ? <CaretDownOutlined style={{ fontSize: '17px' }} /> : <CaretUpOutlined style={{ fontSize: '17px' }} />} Courtiers
          </h4>
          {showCourtier && (
            <div className="card">
              <div className="card-body">
                <Button
                  onClick={() => {
                    showAddCourtierModal();
                  }}
                  icon={<PlusOutlined />}
                  style={{ width: '1%', minWidth: '10%', marginLeft: '90%' }}
                >
                  Ajouter
                </Button>
                <br />
                <Table columns={selectedColumnsConfig} dataSource={compagnie.relationPointventeCompagnieDto} rowKey="id" pagination={false} scroll={{ y: 180 }} size="small" />
                <Modal
                  title="Ajouter Courtier"
                  visible={addCourtierModalVisible}
                  onCancel={() => setAddCourtierModalVisible(false)}
                  footer={[
                    <Button key="cancel" onClick={() => setAddCourtierModalVisible(false)}>
                      Annuler
                    </Button>,
                    <Button key="submit" type="primary" onClick={handleAddCourtier}>
                      Ajouter
                    </Button>,
                  ]}
                >
                  <div className="form-group">
                    <label>Courtiers</label>
                    <Select
                      className="custom-select"
                      showSearch
                      placeholder="Choisir Courtier"
                      optionFilterProp="children"
                      onChange={(value) => setId(value)}
                    >
                      {pointventes.map((pointvente) => (
                        <Option key={pointvente.id} value={pointvente.id}>
                          {pointvente.nomp}
                        </Option>
                      ))}
                    </Select>
                  </div>
                  <label className="text-start">Date Debut</label>
                  <input type="date" className="form-control" value={dateDebut} onChange={(event) => setDateDebut(event.target.value)} />
                  <label className="text-start">Date Fin</label>
                  <input type="date" className="form-control" value={dateFin} onChange={(event) => setDateFin(event.target.value)} />
                  <div className="form-group">
                    <label>Statut</label>
                    <Select
                      className="custom-select"
                      showSearch
                      placeholder="Choisir Statut"
                      optionFilterProp="children"
                      onChange={(value) => setStatutCId(value)}
                    >
                      {statutCs.map((StatutC) => (
                        <Option key={StatutC.id} value={StatutC.id}>
                          {StatutC.libellec}
                        </Option>
                      ))}
                    </Select>
                  </div>
                </Modal>
              </div >
            </div>
          )}
          <br />
        </TabPane>
        <TabPane tab="Agences" key="2">
          <h4 className="text-start" onClick={() => setShowAgences(!showAgences)} >
            {showAgences ? <CaretDownOutlined style={{ fontSize: '17px' }} /> : <CaretUpOutlined style={{ fontSize: '17px' }} />} Agences
          </h4>
          {showAgences && (
            <div className="card">
              <br />
              <Button onClick={showAddAgenceModal} icon={<PlusOutlined />} style={{ width: '1%', minWidth: '10%', marginLeft: '88.5%' }}>
                Ajouter
              </Button>
              <Modal
                title="Ajouter"
                visible={addAgenceModalVisible}
                onCancel={() => setAddAgenceModalVisible(false)}
                footer={[
                  <Button key="cancel" onClick={() => setAddAgenceModalVisible(false)}>
                    Annuler
                  </Button>,
                  <Button key="submit" type="primary" onClick={handleAddAgence}>
                    Ajouter
                  </Button>,
                ]}
              >
                <label className="text-start">Raison social</label>
                <input type="text" className="form-control" value={noma} onChange={(event) => setNoma(event.target.value)} />
                <label className="text-start">Adresse</label>
                <input type="text" className="form-control" value={adressea} onChange={(event) => setAdressea(event.target.value)} />
                <label className="text-start">Telephone</label>
                <PhoneInput
                  country={'ma'}
                  value={telephonea}
                  onChange={setTelephonea}
                  inputClass="form-control phone-input"
                  inputStyle={{ width: '100%' }}
                />
                <label className="text-start">Date creation</label>
                <input type="date" className="form-control" value={date_Debuta} onChange={(event) => setDate_Debuta(event.target.value)} />
                <label className="text-start">Date Fin</label>
                <input type="date" className="form-control" value={date_fina} onChange={(event) => setDate_fina(event.target.value)} />
              </Modal>
              <div className="card-body" style={{ marginTop: "-1.2%" }}>
                <Table columns={selectedColumnsConfig1} dataSource={compagnie.agenceDto} rowKey="id" pagination={false} scroll={{ y: 180 }} size="small" />
              </div>
            </div>
          )}
          <br />
        </TabPane>
        <TabPane tab="Contacts" key="3">
          <h4 className="text-start" onClick={() => setShowContacts(!showContacts)} >
            {showContacts ? <CaretDownOutlined style={{ fontSize: '17px' }} /> : <CaretUpOutlined style={{ fontSize: '17px' }} />}Contacts
          </h4>
          {showContacts && (
            <div className="card">
              <div className="card-body">
                <Button onClick={showAddContactModal} icon={<PlusOutlined />} style={{ width: '10%', minWidth: '6%', marginLeft: '90%' }}>
                  Ajouter
                </Button>
              </div>
              <Modal
                title="Ajouter"
                visible={addContactModalVisible}
                onCancel={() => setAddContactModalVisible(false)}
                footer={[
                  <Button key="cancel" onClick={() => setAddContactModalVisible(false)}>
                    Annuler
                  </Button>,
                  <Button key="submit" type="primary" onClick={handleAddContact}>
                    Ajouter
                  </Button>,
                ]}
              >
                <div className="form-group">
                  <label>Fonction</label>
                  <Select
                    className="custom-select"
                    showSearch
                    placeholder="Choisir Fonction"
                    optionFilterProp="children"
                    onChange={(value) => setId(value)}
                  >
                    {fonctions.map((fonction) => (
                      <Option key={fonction.id} value={fonction.id}>
                        {fonction.qualite}
                      </Option>
                    ))}
                  </Select>
                </div>
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nomc}
                    onChange={(e) => setNomc(e.target.value)}
                    placeholder="Entrez le nom"
                  />
                </div>
                <div className="form-group">
                  <label>Prenom</label>
                  <input
                    type="text"
                    className="form-control"
                    value={prenomc}
                    onChange={(e) => setPrenomc(e.target.value)}
                    placeholder="Entrez le prénom"
                  />
                </div>
                <div className="form-group">
                  <label>Fixe</label>
                  <PhoneInput
                    country={'ma'}
                    value={fax}
                    onChange={setFax}
                    inputClass="form-control phone-input"
                    inputStyle={{ width: '100%' }}
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={emailc}
                    onChange={(e) => setEmailc(e.target.value)}
                    placeholder="Entrez l'email"
                  />
                </div>
                <div className="form-group">
                  <label>Telephone</label>
                  <PhoneInput
                    country={'ma'}
                    value={telephonec}
                    onChange={setTelephonec}
                    inputClass="form-control phone-input"
                    inputStyle={{ width: '100%' }}
                  />
                </div>
              </Modal>
              <div className="card-body" style={{ marginTop: "-1.9%" }}>
                <Table columns={selectedColumnsConfig2} dataSource={compagnie.contactDto} rowKey="id" pagination={false} scroll={{ y: 180 }} size="small" />
              </div>
            </div>
          )}
          <br />
        </TabPane>
        <TabPane tab="Abonnements" key="4">
          <h4 className="text-start" onClick={() => setShowAbonnements(!showAbonnements)} >
            {showAbonnements ? <CaretDownOutlined style={{ fontSize: '17px' }} /> : <CaretUpOutlined style={{ fontSize: '17px' }} />}Abonnements
          </h4>
          {showAbonnements && (
            <div className="card">
              <div className="card-body">
                <Table columns={selectedColumnsConfig3} dataSource={compagnie.abonnement} rowKey="id" pagination={false} scroll={{ y: 180 }} size="small" />
              </div>
            </div>
          )}
          <br />
        </TabPane>
        <TabPane tab="Soldes" key="5">
          <h4 className="text-start" onClick={() => setShowSoldes(!showSoldes)} >
            {showSoldes ? <CaretDownOutlined style={{ fontSize: '17px' }} /> : <CaretUpOutlined style={{ fontSize: '17px' }} />} Soldes
          </h4>
          {showSoldes && (
            <div className="card">
              <div className="card-body">
                <Table columns={selectedColumnsConfig4} dataSource={compagnie.soldePrepayeDto} rowKey="id" pagination={false} scroll={{ y: 180 }} size="small" />
              </div>
            </div>
          )}
        </TabPane>
        <TabPane tab="AttestationsAutorisees" key="6">
          <h4 className="text-start" onClick={() => setShowAutorises(!showAutorises)} >
            {showAutorises ? <CaretDownOutlined style={{ fontSize: '17px' }} /> : <CaretUpOutlined style={{ fontSize: '17px' }} />}AttestationsAutorisees
          </h4>
          {showAutorises && (
            <div className="card">             
              <div className="card-body" style={{ marginTop: "1.9%" }}>
                <Table columns={columnsAttestationautorises} dataSource={compagnie.attestationsAutoriseesDto} rowKey="id" pagination={false} scroll={{ y: 180 }} size="small" />
              </div>
            </div>
          )}
          <br />
        </TabPane>
      </Tabs>
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
}
