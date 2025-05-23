import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Select } from 'antd';
import { Link } from 'react-router-dom';
import { Alert, Modal } from 'antd';
import { useNavigate } from "react-router-dom";

const Create_Types = () => {
    const [typeid, setId] = useState('');
    const [types, setUsers] = useState([]);
    const [typee, setTypee] = useState("");
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
        const result = await axiosInstance.get("http://localhost:8080/api/v1/type/getall");
        setUsers(result.data);
    }
    const validate = () => {
        const newErrors = {};
        if (!typee) newErrors.typee = "* Ce champ est obligatoire";
        
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
            await axiosInstance.post("http://localhost:8080/api/v1/type/save", {
                typee: typee,
               
            });
            setAlertVisible(true);
            setTypee("")
            Load();
            navigate("/admin/Type");
            localStorage.setItem('successMessage', 'La nouvelle compagnie a été sauvegardée avec succès.');
        } catch (err) {
            setErrorVisible(true);
            localStorage.setItem('errorsuccessMessage', 'La nouvelle compagnie n\'est pas sauvegardée avec succès.');
        }
    }



    const handleCancel = () => {
        setCancelAlertVisible(true);
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création de la compagnie.');
        navigate('/admin/Type');
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
<br/>
            <div className="container">
                
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 card">
                        <h1 className="text-center">Nouveau Type</h1>
                        <div className="card-body">
                            <form>
                            <div className="form-group">
                            {errors.typee && <div style={{ color: 'red' }}>{errors.typee}</div>}
                                    <label className="text-center"> Type</label>
                                    <input type="text" className="form-control" value={typee} onChange={(event) => setTypee(event.target.value)} placeholder="Entrez Type" />
                                </div>
                                <br/>                            <div className="box-footer">
                                    <button type="button" className="btn btn-primary " onClick={showModal} style={{...buttonStyle,backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"11%" }}>Enregistrer</button>
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
                <p>Êtes-vous sûr de vouloir sauvegarder cette compagnie ?</p>
            </Modal>
        </>
    );
}

export default Create_Types;
