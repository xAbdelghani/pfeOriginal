import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Select, Alert, Modal, Input } from 'antd';
import { useNavigate } from "react-router-dom";
import currencyCodes from 'currency-codes';

const Create_compte = () => {
    const [compagnieId, setCompagnieId] = useState('');
    const [nom, setNom] = useState("");
  

    const [compagnies, setCompagnies] = useState([]);

    const [alertVisible, setAlertVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        loadCompagnies();
    }, []);

    const showModal = () => {
        setModalVisible(true);
    };

    const handleOk = async (event) => {
        event.preventDefault();
        setModalVisible(false);
        updateLoginAndPassword(compagnieId, nom);
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    async function loadCompagnies() {
        try {
            const result = await axiosInstance.get("http://localhost:8080/api/v1/compagnie/null");
            setCompagnies(result.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des compagnies:", error);
        }
    }

    const validate = () => {
        const newErrors = {};
        if (!nom) newErrors.nom = "* Ce champ est obligatoire";
       
        if (!compagnieId) newErrors.raison_social = "* Ce champ est obligatoire";
        return newErrors;
    };

    async function updateLoginAndPassword(compagnieId, nom) {
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorVisible(true);
            return;
        }
        try {
            await axiosInstance.put(`http://localhost:8080/api/v1/compagnie/update-login/${compagnieId}`, {
                nom: nom
            });
            setAlertVisible(true);
            resetForm();
            navigate("/admin/Compte");
            localStorage.setItem('successMessage', 'Le nouveau compte a été sauvegardé avec succès.');
        } catch (error) {
            setErrorVisible(true);
            console.error("Erreur lors de la mise à jour du login et de la génération du mot de passe:", error);
        }
    }

    const resetForm = () => {
        setCompagnieId('');
        setNom('');
      
    };

    const { Option } = Select;

    const handleCancelCompte = () => {
        setModalVisible(false);
        navigate('/admin/Compte');
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création du compte.');
    };

    const currencyOptions = currencyCodes.codes().map(code => ({
        value: code,
        label: `${code} - ${currencyCodes.code(code).currency}`
    }));

    const buttonStyle = {
        width: '120px',
        height: '40px',
    };

    return (
        <>
            {errorVisible && (
                <Alert
                    message="Erreur"
                    description="L'enregistrement du compte a échoué."
                    type="error"
                    showIcon
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            )}
            <br />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 card">
                        <h1 className="text-center">Nouveau Compte</h1>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label className="text-center">Raison Social de la Compagnie <span style={{ color: 'red' }}>* </span></label>
                                    <Select
                                        className="custom-select"
                                        showSearch
                                        placeholder="Choisir Raison Social"
                                        optionFilterProp="children"
                                        onChange={(value) => setCompagnieId(value)}
                                    >
                                        {compagnies.map((compagnie) => (
                                            <Option key={compagnie.id} value={compagnie.id}>
                                                {compagnie.raison_social}
                                            </Option>
                                        ))}
                                    </Select>
                                    {errors.raison_social && <div style={{ color: 'red' }}>{errors.raison_social}</div>}
                                </div>

                                <div className="form-group">
                                    <label className="text-center">Nom <span style={{ color: 'red' }}>* </span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nom}
                                        onChange={(event) => setNom(event.target.value)}
                                        placeholder="Entrez le nouveau login"
                                    />
                                    {errors.nom && <div style={{ color: 'red' }}>{errors.nom}</div>}
                                </div>

                                <br />
                                <div className="box-footer">
                                    <button type="button" className="btn btn-primary" onClick={showModal} style={{ ...buttonStyle, backgroundColor: 'rgba(96, 122, 214, 0.95)', marginLeft: "11%" }}>Enregistrer</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                    <button type="button" className="btn btn-secondary" onClick={handleCancelCompte} style={buttonStyle}>Annuler</button>
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
                onCancel={handleCancel}
            >
                <p>Êtes-vous sûr de vouloir sauvegarder ce compte ?</p>
            </Modal>
        </>
    );
}

export default Create_compte;
