import axiosInstance from "../../core/axiosConfig";
import React, { useEffect, useState } from "react";
import { Link, useParams,useNavigate } from "react-router-dom";
import { Table, Button, Space, Tooltip, Form, Input, Alert } from "antd";
import { EditOutlined, CheckOutlined, CloseOutlined,CaretDownOutlined,CaretUpOutlined } from "@ant-design/icons";

export default function ViewAbonnement() {
  const [abonnement, setAbonnement] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form] = Form.useForm();
  const [updateMessage, setUpdateMessage] = useState('');
  const [errorUpdateMessage, setErrorUpdateMessage] = useState('');
  const [scrollingDown, setScrollingDown] = useState(false);
  const navigate = useNavigate();
  const { abonnementId } = useParams();

  const [showStatutHistorique, setShowStatutHistorique] = useState(true);

  const sectionStyle = {
    maxHeight: '200px',
    overflowY: 'auto',
    marginBottom: '20px',
  };

  useEffect(() => {
    loadAbonnement();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const isScrolledDown = window.scrollY > 0; // Vérifiez si l'utilisateur a fait défiler vers le bas
      setScrollingDown(isScrolledDown);
    };
  
    window.addEventListener('scroll', handleScroll);
  
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  const loadAbonnement = async () => {
    try {
      const result = await axiosInstance.get(`http://localhost:8080/api/v1/abonnement/${abonnementId}`);
      setAbonnement(result.data);
      form.setFieldsValue(result.data); // Set form values when loading user data
    } catch (error) {
      console.error("Erreur lors du chargement de l'abonnement", error);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    form.setFieldsValue(abonnement); // Update form values when editing
  };

  const handleCancel = () => {
    setEditing(false);
    form.resetFields(); // Reset form values to initial state
  };
  const getLastLibellep = () => {
    if (statutHistorique && statutHistorique.length > 0) {
      // Récupérer le dernier élément dans statutHistorique
      const lastStatut = statutHistorique[statutHistorique.length - 1];
      return lastStatut.libellep; // Retourne le libellep du dernier élément
    }
    return 'N/A'; // Retourner une valeur par défaut si aucun historique n'est trouvé
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedAbonnement = { ...abonnement, ...values };
      await axiosInstance.put(`http://localhost:8080/api/v1/abonnement/${abonnementId}`, updatedAbonnement, {
        headers: {
          'Content-Type': 'application/json'
        }
      });
      setAbonnement(updatedAbonnement);
      setEditing(false);
      setUpdateMessage('Les modifications ont été enregistrées avec succès.');
      loadAbonnement();
    } catch (err) {
      console.error("Failed to save changes:", err);
      setErrorUpdateMessage('Erreur lors de la sauvegarde des modifications.');
    }
  };

  const getStatusColor = (status) => {
    return status === "Actif" ? "green" : status === "Inactif" ? "red" : "black";
  };

  if (!abonnement) {
    return <div>Chargement...</div>;
  }

  const { compagnie, montant, date_Abonnement, date_Fin, libelle,libellep, statut, statutHistorique, raison_social } = abonnement;

  const columnsStatutHistorique = [
    { 
      title: 'Statut',
      dataIndex: 'libellep', 
      key: 'libellep',
      render: (text, record) => (
        <span style={{ color: getStatusColor(text) }}>
          {text}
          {text === "Suspendu" && record.raison && (
            <div><b>Raison : </b>{record.raison}</div>
          )}
        </span>
      ),
    },
    {
      title: 'Date et Heure',
      dataIndex: 'date',
      key: 'date',
      render: (text) => new Date(text).toLocaleString(),
    },
  ];
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate("/admin/Abonnements");
  };
  return (
    <div className="container">
       {scrollingDown && (
      <Button type="primary" className="scroll-to-top-button" onClick={scrollToTop} style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: "1000", /* Assurez-vous que le bouton est au-dessus de tout autre contenu */
        backgroundColor:'rgba(96, 122, 214, 0.99)'
      }}>
        Retour 
      </Button>
    )}
      <div className="row">
        <div className="col-md-10 offset-md-1 border rounded p-4 mt-2 shadow">
          <h2 className="text-center m-4">Détails de l'Abonnement</h2>
          <div className="card">
            <div className="card-header" style={{ backgroundColor: 'rgba(96, 122, 214, 0.90)', color: 'white' }}>
              <h5><strong>Abonnement : {abonnementId}</strong></h5>
            </div>
            <div className="card-body">
              {updateMessage && <Alert message={updateMessage} type="success" showIcon closable />}
              {errorUpdateMessage && <Alert message={errorUpdateMessage} type="error" showIcon closable />}
              <ul className="list-group list-group-flush">
                <li>
                  <b>Compagnie : </b>{raison_social || 'N/A'}<br /><br />
                  <b>Montant : </b>{montant} Dh<br /><br />
                  <b>Date début : </b>{date_Abonnement || 'N/A'}<br /><br />
                  <b>Date de fin : </b>{date_Fin || 'N/A'}<br /><br />
                  <b>Type : </b>{libelle}<br /><br />
                  <b>Statut : </b>{getLastLibellep()}<br /><br />
                </li>
              </ul> 

              <h4 onClick={() => setShowStatutHistorique(!showStatutHistorique)} style={{ cursor: 'pointer' }}>
                Historique des Statuts {showStatutHistorique ? <CaretDownOutlined style={{ fontSize: '17px' }} /> : <CaretUpOutlined style={{ fontSize: '17px' }} />}
              </h4>
              <div style={{ display: showStatutHistorique ? 'block' : 'none' }}>
                {statutHistorique && statutHistorique.length > 0 ? (
                  <div style={sectionStyle}>
                  <Table columns={columnsStatutHistorique} dataSource={statutHistorique} pagination={false} rowKey="date" />
                 </div>
                ) : (
                  <p>Aucun historique de statuts trouvé.</p>
                )}
              </div>
            </div>
          </div>
          <br />
          <Link className="btn btn-primary my-2" style={{ backgroundColor: 'rgba(96, 122, 214, 0.99)',marginLeft:"45%" }} to={"/Abonnements"}>
            Retour 
          </Link>
        </div>
      </div>
    </div>
  );
}
