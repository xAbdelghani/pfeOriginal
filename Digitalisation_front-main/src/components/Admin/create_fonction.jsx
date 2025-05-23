import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Select } from 'antd';
import { Link } from 'react-router-dom';
import { Alert, Modal } from 'antd';
import { useNavigate } from "react-router-dom";

const Create_Fonctions = () => {
    const [fonctionid, setId] = useState('');
    const [fonctions, setUsers] = useState([]);
    const [qualite, setQualite] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [cancelAlertVisible, setCancelAlertVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
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
        const result = await axiosInstance.get("http://localhost:8080/api/v1/fonction/getall");
        setUsers(result.data);
    }

    async function save(event) {
        event.preventDefault();
        try {
            await axiosInstance.post("http://localhost:8080/api/v1/fonction/save", {
                qualite: qualite,
               
            });
            setAlertVisible(true);
            setQualite("")
            Load();
            navigate("/admin/fonction");
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
        navigate('/admin/fonction');
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
                        <h1 className="text-center">Nouvelle Fonction</h1>
                        <div className="card-body">
                            <form>
                            <div className="form-group">
                                    <label className="text-center"> Caractéristique</label>
                                    <input type="text" className="form-control" value={qualite} onChange={(event) => setQualite(event.target.value)} placeholder="Entrez Caractéristique" />
                                </div>
                                <br/>                            <div className="box-footer">
                                    <button type="button" className="btn btn-primary " onClick={showModal} style={{...buttonStyle,backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"11%" }}>Enregistrer</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                    <button type="button" className="btn btn-secondary " onClick={handleCancel} style={buttonStyle}>Annuler</button>
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

export default Create_Fonctions;
