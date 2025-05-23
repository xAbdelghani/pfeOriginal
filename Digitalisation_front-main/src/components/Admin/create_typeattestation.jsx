import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Select } from 'antd';
import { Link } from 'react-router-dom';
import { Alert, Modal  } from 'antd';
import { useNavigate } from "react-router-dom";
import currencyCodes from 'currency-codes';

const Create_TypeAttestations = () => {
    const [typeattestationid, setId] = useState('');
    const [libelle, setLibelle] = useState('');
    const [prix_unitaire, setPrix_unitaire] = useState("");
    const [devise, setDevise] = useState("");

    const [typeattestations, setUsers] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [cancelAlertVisible, setCancelAlertVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [showLibelleOnly, setShowLibelleOnly] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        Load();
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

    async function Load() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/typeattestation/getall");
        setUsers(result.data);
    }
    const validate = () => {
        const newErrors = {};
        if (!libelle) newErrors.libelle = "* Ce champ est obligatoire";
        if (!prix_unitaire) newErrors.prix_unitaire = "* Ce champ est obligatoire";
        if (!devise) newErrors.devise = "* Ce champ est obligatoire";
      
        return newErrors;
    };

    async function save(event) {
        event.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorVisible(true);
            return;
        }
        try {
            await axiosInstance.post("http://localhost:8080/api/v1/typeattestation/save", {
                
                    
                    libelle: libelle,
                    prix_unitaire: prix_unitaire,
                    devise: devise
            
            });
            setAlertVisible(true);
            setId("");
          
            setLibelle("");
            setPrix_unitaire("");
            setDevise("");
            Load();
            navigate("/admin/typeattestation");
            localStorage.setItem('successMessage', 'Le nouveau type attestation a été sauvegardée avec succès.');
        } catch (err) {
            setErrorVisible(true);
            localStorage.setItem('errorsuccessMessage', 'Le  nouveau type n\'est pas sauvegardée avec succès.');
        }
    }

    const { Option } = Select;

    const handleCancel = () => {
        setCancelAlertVisible(true);
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création du type.');
        navigate('/admin/typeattestation');
    };
    const buttonStyle = {
        width: '120px', // Taille identique pour les boutons
        height: '40px', // Taille identique pour les boutons
    };

    const currencyOptions = currencyCodes.codes().map(code => ({
        value: code,
        label: `${code} - ${currencyCodes.code(code).currency}`
    }));

    return (
        <>
            {errorVisible && (
                <Alert
                    message="Error"
                    description="Compagnie Registration Failed."
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
                        <h1 className="text-center">Nouveau Type d'attestation</h1>
                        <div className="card-body">
                            <form>

                                <div className="form-group">
                                {errors.libelle && <div style={{ color: 'red' }}>{errors.libelle}</div>}
                                    <label className="text-center">Description <span style={{ color: 'red' }}>* </span> </label>
                                    <input type="text" className="form-control" value={libelle} onChange={(event) => setLibelle(event.target.value)} placeholder="Entrez Description" />
                                </div>
                                <br /> 
                                
                                    <>
                                <div className="form-group">
                                {errors.duree && <div style={{ color: 'red' }}>{errors.prix_unitaire}</div>}
                                    <label className="text-center">Prix Unitaire <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" className="form-control" value={prix_unitaire} onChange={(event) => setPrix_unitaire(event.target.value)} placeholder="Entrez Prix Unitaire " />
                                </div>
                                <br />
                                <div className="form-group">
                                    {errors.devise && <div style={{ color: 'red' }}>{errors.devise}</div>}
                                    <label className="text-center">Devise <span style={{ color: 'red' }}>* </span></label>
                                    <Select
                                        className="custom-select"
                                        options={currencyOptions}
                                        value={devise} // Utiliser directement la valeur de l'état
                                        onChange={(value) => setDevise(value)} // Corriger ici
                                        placeholder="Choisir Devise"
                                    />
                                </div>
                                <br />
                                </>
                            
                               
                                <div className="box-footer">
                                    <button type="button" className="btn btn-primary " onClick={showModal} style={{...buttonStyle,backgroundColor :'rgba(96, 122, 214, 0.98)',marginLeft:"11%" }}>Enregistrer</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                    <button type="button" className="btn btn-secondary " onClick={handleCancel}style={buttonStyle} >Annuler</button>
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
                <p>Êtes-vous sûr de vouloir sauvegarder ce type ?</p>
            </Modal>
        </>
    );
}

export default Create_TypeAttestations;
