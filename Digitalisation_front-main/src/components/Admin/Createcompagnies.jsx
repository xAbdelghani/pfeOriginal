import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Select } from 'antd';
import { Link } from 'react-router-dom';
import { Alert, Modal } from 'antd';
import { useNavigate,useParams } from "react-router-dom";
 
const CreateCompagnies = () => {
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
    const { pointventeId } = useParams();
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

    async function save(event) {
        event.preventDefault();
        try {
            await axiosInstance.post("http://localhost:8080/api/v1/compagnie/save", {
                nom: nom,
                raison_social: raison_social,
                email: email,
                telephone: telephone,
                adresse: adresse,
                statut: statut,
                ownerc: { id: pointventeId },

      
            });
            setAlertVisible(true);
            setId("");
            setNom("");
            setEmail("");
            setTelephone("");
            setAdresse("")
            setStatut("");
            setTypeAbonnement("");
            setSolde("");
            setDate_Abonnement("");
            Load();
            navigate(`/admin/compagnies/${pointventeId}`);
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
        navigate(`/admin/compagnies/${pointventeId}`);
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
                    description="Compagnie Registration Failed."
                    type="error"
                    showIcon
                    style={{ position: 'absolute', bottom: 20, right: 20 }} 
                />
            )}

            <div className="container">
                
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 card">
                        <h1 className="text-center">Nouvelle compagnies</h1>
                        <div className="card-body">
                            <form>
                            <div className="form-group">
                                    <label className="text-center"> Login</label>
                                    <input type="text" className="form-control" value={nom} onChange={(event) => setNom(event.target.value)} placeholder="Entez Login" />
                                </div>
                                <div className="form-group">
                                    <label className="text-center"> Raison social</label>
                                    <input type="text" className="form-control" value={raison_social} onChange={(event) => setRaison_social(event.target.value)} placeholder="Entez Raison_social" />
                                </div>
                              
                                <div className="form-group">
                                    <label className="text-center"> Email</label>
                                    <input type="text" className="form-control" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Entez Email" />
                                </div>
                           
                                <div className="form-group">
                                    <label className="text-center"> Telephone</label>
                                    <input type="text" className="form-control" value={telephone} onChange={(event) => setTelephone(event.target.value)} placeholder="Entez Telephone" />
                                </div>
                             
                                <div className="form-group">
                                    <label className="text-center"> Address</label>
                                    <input type="text" className="form-control" value={adresse} onChange={(event) => setAdresse(event.target.value)} placeholder="Entez Adresse" />
                                </div>
                               
                                <br />
                                <div className="box-footer">
                                    <button type="button" className="btn btn-primary " onClick={showModal} style={{...buttonStyle,backgroundColor :'rgba(96, 122, 214, 0.7)',marginLeft:"11%" }}>Enregistrer</button>
                           
                                    <button type="button" className="btn btn-secondary "  onClick={handleCancel}style={buttonStyle} >Annuler</button>
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

export default CreateCompagnies;
