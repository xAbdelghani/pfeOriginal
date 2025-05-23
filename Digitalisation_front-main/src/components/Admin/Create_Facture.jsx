import React, { useState, useEffect } from 'react';
import axiosInstance from "../../core/axiosConfig";
import { useNavigate, useParams } from 'react-router-dom';
import { Alert, Modal, Form, Input, Button } from 'antd';
import dayjs from 'dayjs';
import './navbar.css';
import 'bootstrap/dist/css/bootstrap.css';

const AddFacture = () => {
  const { compagnieId } = useParams();
  const [dateDebut, setDateDebut] = useState('');
  const [typeF, setTypeF] = useState('');
  const [dateEcheance, setDateEcheance] = useState('');
  const [dateReglement, setDateReglement] = useState('');
  const [statut, setStatut] = useState('');
  const [taxe, setTaxe] = useState('');
  const [prime, setPrime] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const today = dayjs().format('YYYY-MM-DD');
    const dueDate = dayjs().add(15, 'day').format('YYYY-MM-DD');
    setDateDebut(today);
    setDateEcheance(dueDate);
  }, []);

  const showModal = () => {
    setModalVisible(true);
  };

  const handleOk = (event) => {
    event.preventDefault();
    setModalVisible(false);
    save(event);
  };

  const handleCancell = () => {
    setModalVisible(false);
  };

  const save = async (event) => {
    event.preventDefault();
    try {
      await axiosInstance.post('http://localhost:8080/api/v1/facture/save', {
        date_Debutt: dateDebut,
        typeF: typeF,
        date_Echeance: dateEcheance,
        date_Reglement: dateReglement,
        statut: statut,
        taxe: parseFloat(taxe),
        prime: parseFloat(prime),
        ownerfa: { id: compagnieId },
      });
      setAlertVisible(true);
      setTimeout(() => navigate(`/admin/factures/${compagnieId}`), 2000);
    } catch (err) {
      setErrorVisible(true);
    }
  };
  const buttonStyle = {
    width: '120px', // Taille identique pour les boutons
    height: '40px', // Taille identique pour les boutons
};


  return (
    <>
      {errorVisible && (
        <Alert
          message="Erreur"
          description="La création de la facture a échoué."
          type="error"
          showIcon
          style={{ position: 'absolute', bottom: 20, right: 20 }}
        />
      )}
      <div className="container">
        <br />
        <br />
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-6 col-sm-6 card">
            <h1 className="text-center">Nouvelle Facture</h1>
            <div className="card-body">
              <form>
                <div className="form-group">
                  <label className="text-center">Date Début</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateDebut}
                    readOnly
                  />
                </div>
                <br />
                <div className="form-group">
                  <label className="text-center">Type Facture</label>
                  <input
                    type="text"
                    className="form-control"
                    value={typeF}
                    onChange={(e) => setTypeF(e.target.value)}
                    placeholder="Entrez le type de facture"
                  />
                </div>
                <br />
                <div className="form-group">
                  <label className="text-center">Date Échéance</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateEcheance}
                    readOnly
                  />
                </div>
                <br />
                <div className="form-group">
                  <label className="text-center">Date Règlement</label>
                  <input
                    type="date"
                    className="form-control"
                    value={dateReglement}
                    onChange={(e) => setDateReglement(e.target.value)}
                  />
                </div>
                <br />
                <div className="form-group">
                  <label className="text-center">Taxe</label>
                  <input
                    type="number"
                    className="form-control"
                    value={taxe}
                    onChange={(e) => setTaxe(e.target.value)}
                    placeholder="Entrez la taxe"
                  />
                </div>
                <br />
                <div className="form-group">
                  <label className="text-center">Prime</label>
                  <input
                    type="number"
                    className="form-control"
                    value={prime}
                    onChange={(e) => setPrime(e.target.value)}
                    placeholder="Entrez la prime"
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
                      value="Paye"
                      checked={statut === "Paye"}
                      onChange={(e) => setStatut(e.target.value)}
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
                      value="NonPaye"
                      checked={statut === "Nonpaye"}
                      onChange={(e) => setStatut(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="statutInactive">NonPaye</label>
                  </div>
                </div>
                <br />
                <div className="box-footer text-center">
                  <button type="button" className="btn btn-primary" onClick={showModal}style={{...buttonStyle,backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"11%" }}>Enregistrer</button>
                  <span style={{ margin: '0 100px' }}></span>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate(`/admin/factures/${compagnieId}`)}style={buttonStyle}>Annuler</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Modal
        title="Confirmation"
        open={modalVisible}
        onOk={handleOk}
        onCancel={handleCancell}
      >
        <p>Êtes-vous sûr de vouloir sauvegarder cette facture ?</p>
      </Modal>
    </>
  );
};

export default AddFacture;
