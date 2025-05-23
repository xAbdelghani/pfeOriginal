import React, { useState, useEffect } from 'react';
import axiosInstance from "../../core/axiosConfig";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Input,
  Button,
  Select,
  Modal,
  Table,
  Alert,
  Typography,
  Row,
  Col,
  Card,
  Collapse,
} from 'antd';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  HomeOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';

const { Option } = Select;
const { Title, Text } = Typography;
const { Panel } = Collapse;

const EditCompagnies = () => {
  const [form] = Form.useForm();
  const location = useLocation();
  const { pointventeId } = useParams();
  const navigate = useNavigate();

  const [compagnie, setCompagnie] = useState({
    nom: '',
    raison_social: '',
    adresse: '',
    telephone: '',
    email: '',
    statut: '',
    pointventeDto: [],
    abonnement: [],
    contactDto: [],
    soldePrepayeDto: [],
    agenceDto: [],
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [updateMessage, setUpdateMessage] = useState('');
  const [errorUpdateMessage, setErrorUpdateMessage] = useState('');
  const [fonctions, setFonctions] = useState([]);

  useEffect(() => {
    loadFonctions();
    recuperation();
  }, []);

  const loadFonctions = async () => {
    try {
      const result = await axiosInstance.get('http://localhost:8080/api/v1/fonction/getall');
      setFonctions(result.data);
    } catch (error) {
      console.error('Error fetching fonctions:', error);
    }
  };

  const showModal = () => {
    setModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await handleSave(values);
      setModalVisible(false);
    } catch (err) {
      console.error('Validation failed:', err);
    }
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleFormChange = (changedValues) => {
    setCompagnie((prev) => ({ ...prev, ...changedValues }));
  };

  async function recuperation() {
    const resultat = location.state.compagnie;
    setCompagnie(resultat);
    form.setFieldsValue(resultat);
  }

  const handleSave = async (values) => {
    try {
      await updateCompagnie(values);
      await handleSaveCourtier(values);
      await handleSaveAgences(values);
      await handleSaveContacts(values);
      await handleSaveAbonnements(values);
      await handleSaveSoldes(values);

      navigate(`/compagnies`);
      localStorage.setItem('updateMessage', 'La mise à jour de la compagnie a été sauvegardée avec succès.');
      setUpdateMessage('La mise à jour de la compagnie a été sauvegardée avec succès.');
    } catch (err) {
      console.error('Error updating compagnie:', err.response ? err.response.data : err.message);
      localStorage.setItem('errorupdateMessage', 'La mise à jour de la compagnie a échoué.');
      setErrorUpdateMessage('Erreur lors de la mise à jour de la compagnie.');
    }
  };

  async function updateCompagnie(updatedCompagnie) {
    if (!compagnie.id) {
      throw new Error('Company ID is missing');
    }
    await axiosInstance.put(`http://localhost:8080/api/v1/compagnie/edit/${compagnie.id}`, updatedCompagnie);
  }

  const handleSaveCourtier = async (values) => {
    if (!values.relationPointventeCompagnieDto) return;
    try {
      const updatedCourtiers = values.relationPointventeCompagnieDto.map((courtier, index) => ({
        ...compagnie.relationPointventeCompagnieDto[index],
        ...courtier
      }));
      const savePromises = updatedCourtiers.map(courtier =>
        axiosInstance.put(`http://localhost:8080/api/v1/relationcp/edit/${courtier.id}`, courtier, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      await Promise.all(savePromises);
    } catch (err) {
      console.error('Failed to save courtiers:', err.response ? err.response.data : err.message);
    }
  };

  const handleSaveAgences = async (values) => {
    if (!values.agenceDto) return;
    try {
      const updatedAgences = values.agenceDto.map((agence, index) => ({
        ...compagnie.agenceDto[index],
        ...agence
      }));
      const savePromises = updatedAgences.map(agence =>
        axiosInstance.put(`http://localhost:8080/api/v1/agence/edit/${agence.id}`, agence, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      await Promise.all(savePromises);
    } catch (err) {
      console.error('Failed to save agences:', err.response ? err.response.data : err.message);
    }
  };

  const handleSaveContacts = async (values) => {
    if (!values.contactDto) return;
    try {
      const updatedContacts = values.contactDto.map((contact, index) => ({
        ...compagnie.contactDto[index],
        ...contact
      }));
      const savePromises = updatedContacts.map(contact =>
        axiosInstance.put(`http://localhost:8080/api/v1/contact/edit/${contact.id}`, contact, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      await Promise.all(savePromises);
    } catch (err) {
      console.error('Failed to save contacts:', err.response ? err.response.data : err.message);
    }
  };

  const handleSaveAbonnements = async (values) => {
    if (!values.abonnement) return;
    try {
      const updatedAbonnements = values.abonnement.map((abonnement, index) => ({
        ...compagnie.abonnement[index],
        ...abonnement
      }));
      const savePromises = updatedAbonnements.map(abonnement =>
        axiosInstance.put(`http://localhost:8080/api/v1/abonnement/edit/${abonnement.id}`, abonnement, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      await Promise.all(savePromises);
    } catch (err) {
      console.error('Failed to save abonnements:', err.response ? err.response.data : err.message);
    }
  };

  const handleSaveSoldes = async (values) => {
    if (!values.soldePrepayeDto) return;
    try {
      const updatedSoldes = values.soldePrepayeDto.map((solde, index) => ({
        ...compagnie.soldePrepayeDto[index],
        ...solde
      }));
      const savePromises = updatedSoldes.map(solde =>
        axiosInstance.put(`http://localhost:8080/api/v1/solde/edit/${solde.id}`, solde, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      await Promise.all(savePromises);
    } catch (err) {
      console.error('Failed to save soldes:', err.response ? err.response.data : err.message);
    }
  };

  const columns = {
    relationPointventeCompagnieDto: [
      { title: 'Nom', dataIndex: 'nomp', key: 'nomp' }, // Added "Nom" column
      { title: 'Date début', dataIndex: 'dateDebut', key: 'dateDebut' },
      { title: 'Date de fin', dataIndex: 'dateFin', key: 'dateFin' },
    ],
    agenceDto: [
      { title: 'Raison Sociale', dataIndex: 'noma', key: 'noma' },
      { title: 'Date Début', dataIndex: 'date_Debuta', key: 'date_Debuta' },
      { title: 'Date Fin', dataIndex: 'date_fina', key: 'date_fina' },
      { title: 'Adresse', dataIndex: 'adressea', key: 'adressea' },
      { title: 'Téléphone', dataIndex: 'telephonea', key: 'telephonea' },
    ],
    contactDto: [
      { title: 'Nom', dataIndex: 'nomc', key: 'nomc' },
      { title: 'Fax', dataIndex: 'fax', key: 'fax' },
      { title: 'Téléphone', dataIndex: 'telephonec', key: 'telephonec' },
      { title: 'Email', dataIndex: 'emailc', key: 'emailc' },
      {
        title: 'Fonction',
        dataIndex: 'qualite',
        key: 'qualite', 
        render: (text, record) => (
          <Form.Item name={['contactDto', record.key, 'qualite']} initialValue={text?.id} noStyle>
            <Select className="custom-select" showSearch placeholder="Choisir Fonction" optionFilterProp="children">
              {fonctions.map((fonction) => (
                <Option key={fonction.id} value={fonction.id}>
                  {fonction.qualite}
                </Option>
              ))}
            </Select>
          </Form.Item>
        ),
      },
    ],
    abonnement: [
      { title: 'Date début', dataIndex: 'date_Abonnement', key: 'date_Abonnement' },
      { title: 'Date fin', dataIndex: 'date_Fin', key: 'date_Fin' },
      { title: 'Montant abonnement', dataIndex: 'montant', key: 'montant' },
      { title: 'Type', dataIndex: 'libelle', key: 'libelle' },
    ],
    soldePrepayeDto: [
      { title: 'Date Abonnement', dataIndex: 'date_Abonnement', key: 'date_Abonnement' },
      { title: 'Solde_Prepayé', dataIndex: 'solde', key: 'solde' },
      { title: 'Type', dataIndex: 'type', key: 'type' },
    ],
  };

  const renderColumns = (section) => {
    const col = columns[section];
    return col.map((col) => ({
      ...col,
      render: (text, record) => (
        <Form.Item name={[section, record.key, col.dataIndex]} initialValue={text} noStyle>
          <Input />
        </Form.Item>
      ),
    }));
  };

  return (
    <div className="container" style={{ padding: '20px' }}>
      {updateMessage && <Alert message={updateMessage} type="success" showIcon closable />}
      {errorUpdateMessage && <Alert message={errorUpdateMessage} type="error" showIcon closable />}
      <Row justify="center">
        <Col span={24}>
          <Card>
            <Title level={2} className="text-center">Mise à jour compagnie</Title>
            <Form
              form={form}
              layout="vertical"
              onValuesChange={handleFormChange}
              initialValues={compagnie}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<Text className="form-title"><UserOutlined /> Nom</Text>}
                    name="nom"
                    rules={[{ required: true, message: 'Veuillez entrer le nom de la compagnie' }]}
                  >
                    <Input placeholder="Enter Nom" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<Text className="form-title"><UserOutlined /> Raison sociale</Text>}
                    name="raison_social"
                    rules={[{ required: true, message: 'Veuillez entrer la raison sociale de la compagnie' }]}
                  >
                    <Input placeholder="Enter Raison sociale" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<Text className="form-title"><MailOutlined /> Email</Text>}
                    name="email"
                    rules={[{ required: true, type: 'email', message: 'Veuillez entrer un email valide' }]}
                  >
                    <Input placeholder="Enter Email" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    label={<Text className="form-title"><PhoneOutlined /> Telephone</Text>}
                    name="telephone"
                    rules={[{ required: true, message: 'Veuillez entrer le téléphone de la compagnie' }]}
                  >
                    <Input placeholder="Enter Telephone" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    label={<Text className="form-title"><HomeOutlined /> Adresse</Text>}
                    name="adresse"
                    rules={[{ required: true, message: 'Veuillez entrer l\'adresse de la compagnie' }]}
                  >
                    <Input placeholder="Enter Adresse" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={24}>
          <Card>
            {[
              { key: 'relationPointventeCompagnieDto', title: 'Courtiers' },
              { key: 'agenceDto', title: 'Agences' },
              { key: 'contactDto', title: 'Contacts' },
              { key: 'abonnement', title: 'Abonnements' },
              { key: 'soldePrepayeDto', title: 'Soldes' }
            ].map(section => (
              <div key={section.key} style={{ marginBottom: '20px' }}>
                <Collapse>
                  <Panel header={section.title} key="1">
                    <Form form={form} component={false}>
                      <Table
                        dataSource={compagnie[section.key]?.map((item, index) => ({ ...item, key: index })) || []}
                        columns={renderColumns(section.key)}
                        rowKey="id"
                        pagination={false}
                        bordered
                      />
                    </Form>
                  </Panel>
                </Collapse>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: '20px' }}>
        <Col span={24}>
          <Card>
            <Form.Item className="text-center">
              <Button type="primary" onClick={showModal} style={{backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"19%"}}>Modifier</Button>
              <span style={{ margin: '0 10px' }}></span>
              <Button type="secondary" onClick={() => navigate(`/admin/compagnies`)}>Annuler</Button>
            </Form.Item>
          </Card>
        </Col>
      </Row>
      <Modal
        title="Confirmation"
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        icon={<ExclamationCircleOutlined />}
      >
        <p>Êtes-vous sûr de vouloir mettre à jour cette compagnie ?</p>
      </Modal>
    </div>
  );
};

export default EditCompagnies;

