import React, { useState, useEffect, useRef } from "react";
import { Table, Tag, Space, Button, Modal, Alert, Input } from "antd";

import axiosInstance from "../../core/axiosConfig";
import { Link, useNavigate } from "react-router-dom";
import {
  SearchOutlined,
  FileAddOutlined,
  EditOutlined,
  UserDeleteOutlined,
  CloudDownloadOutlined,
} from "@ant-design/icons";
import Highlighter from 'react-highlight-words';

const Attestation = () => {
  const [attestationId, setId] = useState('');
  const [attestationIdToDelete, setAttestationIdToDelete] = useState(null);
  const [attestations, setAttestations] = useState([]);
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
    Load();
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

  async function Load() {
    const result = await axiosInstance.get("http://localhost:8080/api/v1/attestation/getall");
    setAttestations(result.data);
    console.log(result.data);
  }

  async function editAttestation(attestation) {
    navigate("/admin/EditA", { state: { attestation } });
  }

  async function DeleteAttestation(attestationid) {
    await axiosInstance.delete("http://localhost:8080/api/v1/attestation/delete/" + attestationid);
    setAlertVisible(true);
    Load();
    setTimeout(() => {
      setAlertVisible(false);
    }, 3000);

  }
  async function modell(attestationId) {
    setModalVisible(true);
    setAttestationIdToDelete(attestationId);
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
  const columns = [
    {
      title: <span style={{ color: '#607AD6' }}>Date de Génération</span>,
      dataIndex: "date_Generation",
      key: "date_Generation",
      ...getColumnSearchProps("date_Generation"),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Date de Début</span>,
      dataIndex: "date_Debut",
      key: "date_Debut",
      ...getColumnSearchProps("date_Debut"),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Date de Fin</span>,
      dataIndex: "date_Fin",
      key: "date_Fin",
      ...getColumnSearchProps("date_Fin"),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Télécharger</span>,
      key: "download",
      render: (text, record) => (
        <Button type="primary" onClick={() => window.location.href = `http://localhost:8080/api/v1/attestation/attestations/download/${record.id}`}>
          <CloudDownloadOutlined /> Télécharger
        </Button>
      ),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Prix</span>,
      dataIndex: "prix",
      key: "prix",
      ...getColumnSearchProps("prix"),
    },
    {
      title: <span style={{ color: '#607AD6' }}>Statut</span>,
      dataIndex: "statut",
      key: "statut",
      ...getColumnSearchProps("statut"),
      render: (text) => (
        <Tag color={text.toUpperCase() === 'PAYÉ' ? "green" : "red"}>
          {text.toUpperCase()}
        </Tag>
      ),
    },

    {

      title: <span style={{ color: '#607AD6' }}>  Actions  </span>,
      key: "actions",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => editAttestation(record)} style={{ color: '#607AD6' }}>
            <EditOutlined />
            Modifier
          </Button>
          <Button onClick={() => modell(record.id)} style={{ color: '#607AD6' }}>
            <UserDeleteOutlined />
            Supprimer
          </Button>
          {modalVisible && (
            <Modal
              title="Confirmation"
              open={modalVisible}
              onOk={() => {
                DeleteAttestation(record.id); setModalVisible(false)
              }}
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
        <br />
        <div className="row justify-content-end">
          <div className="col-lg-2">
            <Link to="/admin/createA">
              <Button type="primary" className="mb-3 custom-btn-color" icon={<FileAddOutlined />}>
                AJOUTER
              </Button>
            </Link>
          </div>
        </div>

        <br />


        <Table
          columns={columns}
          dataSource={attestations.map((attestation) => ({ ...attestation, key: attestation.id }))}
          pagination
        />
      </div>
    </>
  );
};

export default Attestation;
