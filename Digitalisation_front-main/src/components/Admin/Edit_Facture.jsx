import React, { useState, useEffect } from "react";
import axiosInstance from "../../core/axiosConfig";
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Modal, Form, Input, Button, Alert } from 'antd';

const EditFacture = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { compagnieId } = useParams();

  const [facture, setFacture] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [cancelAlertVisible, setCancelAlertVisible] = useState(false);

  useEffect(() => {
    recuperation();
  }, []);

  const showModal = () => {
    setModalVisible(true);
  };

  const handleOk = async () => {
    setModalVisible(false);
    await update();
  };

  const handleCancel = () => {
    setModalVisible(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFacture(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const recuperation = () => {
    const stateFacture = location.state?.facture;
    if (stateFacture) {
      setFacture(stateFacture);
    } else {
      console.error("Aucune facture trouvée dans l'état de location.");
    }
  };

  const update = async () => {
    try {
      await axiosInstance.put(`http://localhost:8080/api/v1/facture/edit/${facture.id}`, {
        date_Debutt: facture.date_Debutt,
        typeF: facture.typeF,
        date_Echeance: facture.date_Echeance,
        date_Reglement: facture.date_Reglement,
        statut: facture.statut,
        taxe: parseFloat(facture.taxe),
        prime: parseFloat(facture.prime),
        ownerfa: { id: compagnieId }
      });
      setAlertVisible(true);
      setTimeout(() => navigate(`/admin/factures/${compagnieId}`), 2000);
    } catch (err) {
      setErrorVisible(true);
    }
  };

  const handleCancell = () => {
    setCancelAlertVisible(true);
    navigate(`/admin/factures/${compagnieId}`);
  };

  return (
    <>
      {alertVisible && (
        <Alert
          message="Succès"
          description="Facture mise à jour avec succès."
          type="success"
          showIcon
          style={{ position: 'absolute', bottom: 20, right: 20 }}
        />
      )}
      {errorVisible && (
        <Alert
          message="Erreur"
          description="La mise à jour de la facture a échoué."
          type="error"
          showIcon
          style={{ position: 'absolute', bottom: 20, right: 20 }}
        />
      )}
      {facture ? (
        <div className="container">
        <br />
        <br />
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-6 col-sm-6 card">
            <h1 className="text-center">Mise à jour Facture</h1>
            <div className="card-body">
              <form>
               
                <br />
                <div className="form-group">
                  <label className="text-center">Type Facture</label>
                  <input
                    type="text"
                    name="typeF"
                    value={facture.typeF || ''}
                    onChange={handleChange}
                    placeholder="Entrez le type de facture"
                  />
                </div>
                
                <br />
                <div className="form-group">
                  <label className="text-center">Date Règlement</label>
                  <input
                    type="date"
                    className="form-control"
                    name="date_Reglement"
                    value={facture.date_Reglement || ''}
                    onChange={handleChange}
                  />
                </div>
                
                <br />
                <div className="form-group">
                  <label className="text-center">Statut</label><br />
                  <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="statut"
                        id="statutActive"
                        value="PAYE"
                        checked={facture.statut === "PAYE"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="statutActive">Paye</label>
                    </div>
                    <span style={{ margin: '0 10px' }}></span>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="statut"
                        id="statutInactive"
                        value="NONPAYE"
                        checked={facture.statut === "NONPAYE"}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="statutInactive">NonPaye</label>
                    </div>
                </div>
                <br />
                <div className="box-footer text-center">
                  <button type="button" className="btn btn-primary" onClick={showModal}style={{backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"19%"}}>Modifier</button>
                  <span style={{ margin: '0 100px' }}></span>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate(`/admin/factures/${compagnieId}`)}>Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      ) : (
        <div className="container">
          <br />
          <br />
          <Alert
            message="Erreur"
            description="Aucune facture trouvée à éditer."
            type="error"
            showIcon
          />
        </div>
      )}
      <Modal
        title="Confirmation"
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      > 
        <p>Êtes-vous sûr de vouloir mettre à jour cette facture ?</p>
      </Modal>
    </>
  );
};

export default EditFacture;
