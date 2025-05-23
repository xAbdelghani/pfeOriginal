import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Select, Alert, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Create_Compagnies = () => {
    const [compagnieid, setId] = useState('');
    const [nom, setNom] = useState("");
    const [raison_social, setRaison_social] = useState("");
    const [adresse, setAdresse] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [statut, setStatut] = useState("");
    const [typeAbonnement, setTypeAbonnement] = useState("");
    const [solde, setSolde] = useState('');
    const [date_Abonnement, setDate_Abonnement] = useState("");
    const [compagnies, setUsers] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [cancelAlertVisible, setCancelAlertVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
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
        const result = await axiosInstance.get("http://localhost:8080/api/v1/compagnie/getall");
        setUsers(result.data);
    }

    const validate = () => {
        const newErrors = {};
        
        if (!raison_social) newErrors.raison_social = "* Ce champ est obligatoire";
        if (!email) newErrors.email = "* Ce champ est obligatoire";
        if (!telephone) newErrors.telephone = "* Ce champ est obligatoire";
        if (!adresse) newErrors.adresse = "* Ce champ est obligatoire";
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
            await axiosInstance.post("http://localhost:8080/api/v1/compagnie/save", {
               
                raison_social: raison_social,
                email: email,
                telephone: telephone,
                adresse: adresse,
            });
            setAlertVisible(true);
            setId("");
         
            setEmail("");
            setTelephone("");
            setAdresse("");
            setRaison_social("");
            Load();
            navigate("/admin/compagnies");
            localStorage.setItem('successMessage', 'La nouvelle compagnie a été sauvegardée avec succès.');
        } catch (err) {
            setErrorVisible(true);
            localStorage.setItem('errorsuccessMessage', 'La nouvelle compagnie n\'est pas sauvegardée avec succès.');
        }
    }

    const { Option } = Select;

    const handleCancel = () => {
        setCancelAlertVisible(true);
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création de la compagnie.');
        navigate('/admin/compagnies');
    };
     const buttonStyle = {
        width: '120px', // Taille identique pour les boutons
        height: '40px', // Taille identique pour les boutons
    };

    return (
        <>
            {errorVisible && (
                <Alert
                    message="Error"
                    description="Veuillez remplir tous les champs obligatoires."
                    type="error"
                    showIcon
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            )}
            <br />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 card">
                        <h1 className="text-center">Nouvelle compagnie</h1>
                        <div className="card-body">
                            <form>

                                <div className="form-group">
                                    
                                    {errors.raison_social && <div style={{ color: 'red' }}>{errors.raison_social}</div>}
                                    <label className="text-center">Raison social <span style={{ color: 'red' }}>* </span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={raison_social}
                                        onChange={(event) => setRaison_social(event.target.value)}
                                        placeholder="Entrez Raison social"
                                    />

                                </div>
                                <div className="form-group">
                              
                                    {errors.email && <div style={{ color: 'red' }}>{errors.email}</div>}
                                    <label className="text-center">Email <span style={{ color: 'red' }}>* </span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={email}
                                        onChange={(event) => setEmail(event.target.value)}
                                        placeholder="Entrez Email"
                                    />

                                </div>
                                <div className="form-group">
                               
                                    {errors.telephone && <div style={{ color: 'red' }}>{errors.telephone}</div>}
                                    <label className="text-center">Telephone <span style={{ color: 'red' }}>* </span></label>
                                    <PhoneInput
                                        country={'ma'}
                                        value={telephone}
                                        onChange={setTelephone}
                                        inputClass="form-control phone-input"
                                        inputStyle={{
                                            width: '100%'
                                        }}
                                    />

                                </div>
                                
                                <div className="form-group">
                           
                                    {errors.adresse && <div style={{ color: 'red' }}>{errors.adresse}</div>}
                                    <label className="text-center">Addresse <span style={{ color: 'red' }}>* </span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={adresse}
                                        onChange={(event) => setAdresse(event.target.value)}
                                        placeholder="Entrez Adresse"
                                    />

                                </div>
                                <br />
                                <div className="box-footer">
                                <button type="button" className="btn btn-primary me-2" onClick={showModal} style={{ ...buttonStyle, backgroundColor: 'rgba(96, 122, 214, 0.95)' ,marginLeft:"11%"}}>Enregistrer</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel} style={buttonStyle}>Annuler</button>
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
                <p>Êtes-vous sûr de vouloir sauvegarder cette compagnie ?</p>
            </Modal>
        </>
    );
}

export default Create_Compagnies;
