import React, { useState, useEffect, useRef } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Link, useLocation } from 'react-router-dom';
import { Select ,Modal} from 'antd';
import { useNavigate,useParams } from "react-router-dom";

const EditCompagnies = () => {
    const nomref = useRef("");
    const raison_socialref = useRef("");
    const adresseref = useRef("");
    const telephoneref = useRef("");
    const emailref = useRef("");
    const solderef = useRef("");
    const date_Abonnementref = useRef("");

    const location = useLocation();
    const { pointventeId } = useParams();

    const [compagnieid, setId] = useState("");
    const [nom, setNom] = useState("");
    const [raison_social, setRaison_social] = useState("");
    const [adresse, setAdresse] = useState("");
    const [telephone, setTelephone] = useState("");
    const [email, setEmail] = useState("");
    const [type, setType] = useState("");
    
    const [statut, setStatut] = useState("");
    const [compagnies, setUsers] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();
    const [cancelAlertVisible, setCancelAlertVisible] = useState(false);

    useEffect(() => {
        recuperation();
    }, []);
    const showModal = () => {
        setModalVisible(true);
    };

    const handleOk = (event) => {
        event.preventDefault();
    setModalVisible(false);
    update(event); 
    };

    const handleCancell = () => {
        setModalVisible(false);
    };
    async function Load() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/compagnie/getall");
        setUsers(result.data);
        console.log(result.data);
    }

    async function recuperation() {
        const resultat = await location.state.compagnie;

        nomref.current.value = resultat.nom;
        raison_socialref.current.value = resultat.raison_social;
        adresseref.current.value = resultat.adresse;
        telephoneref.current.value = resultat.telephone;
        emailref.current.value = resultat.email;
        
     
        setId(resultat.id);
        setNom(resultat.nom);
        setRaison_social(resultat.raison_social);
        setAdresse(resultat.adresse);
        setTelephone(resultat.telephone);
        setEmail(resultat.email);
       
        setStatut(resultat.statut);
    }

    async function update(event) {
        event.preventDefault();
        try {
            await axiosInstance.put("http://localhost:8080/api/v1/compagnie/edit/" + compagnieid, {
                nom: nom,
                raison_social: raison_social,
                email: email,
                telephone: telephone,
                adresse: adresse,
                type: type,
                statut: statut,
                ownerc: { id: pointventeId }
                
            });
            navigate(`/admin/compagnies/${pointventeId}`);
            localStorage.setItem('updateMessage', 'Le mise à jour de compagnie a été sauvegardée avec succès.');
            Load();
        } catch (err) {
            navigate(`/admin/compagnies/${pointventeId}`);
            localStorage.setItem('errorupdateMessage', 'Compagnie Update Failed');
        }
    }
    
    const { Option } = Select;
    const handleCancel = () => {
        setCancelAlertVisible(true);
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création de la compagnie.');
        
            navigate(`/admin/compagnies/${pointventeId}`);
   
    };

    return (
        <>
        <div className="container">
         
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-6 col-sm-6 card">
                    <h1 className="text-center"> Mise à jour compagnies</h1>
                    <div className="card-body">
                        <form>
                            <div className="form-group">
                                <label className="text-center">Compagnie Login</label>
                                <input type="text" className="form-control" ref={nomref} onChange={(event) => setNom(event.target.value)} placeholder="Enter Compagnie Nom" />
                            </div>
                         
                            <div className="form-group">
                                <label className="text-center">Compagnie Raison social</label>
                                <input type="text" className="form-control" ref={raison_socialref} onChange={(event) => setRaison_social(event.target.value)} placeholder="Enter Compagnie Raison_social" />
                            </div>
                         
                            <div className="form-group">
                                <label className="text-center">Compagnie Email</label>
                                <input type="text" className="form-control" ref={emailref} onChange={(event) => setEmail(event.target.value)} placeholder="Enter Compagnie Email" />
                            </div>
                         
                            <div className="form-group">
                                <label className="text-center">Compagnie Telephone</label>
                                <input type="text" className="form-control" ref={telephoneref} onChange={(event) => setTelephone(event.target.value)} placeholder="Enter Compagnie Telephone" />
                            </div>
                           
                            <div className="form-group">
                                <label className="text-center">Compagnie Address</label>
                                <input type="text" className="form-control" ref={adresseref} onChange={(event) => setAdresse(event.target.value)} placeholder="Enter Compagnie Address" />
                            </div>

                           
                            
                            <br />
                            <div className="box-footer">
                                <button type="button" className="btn btn-primary" onClick={showModal} style={{backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"19%"}}>Modifier</button>
                                <span style={{ margin: '0 100px' }}></span>
                            
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel}>Annuler</button>
                               
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div><Modal
                title="Confirmation"
                open={modalVisible}
                onOk={handleOk}
                onCancel={handleCancell}
            >
                <p>Êtes-vous sûr de vouloir UPDATE cette compagnie ?</p>
            </Modal>
        </>
    );
}

export default EditCompagnies;