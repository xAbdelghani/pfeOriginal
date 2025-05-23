import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Link, useLocation } from 'react-router-dom';
import { Select, Modal, Switch } from 'antd';
import { useNavigate } from "react-router-dom";
import currencyCodes from 'currency-codes';

const Edit_typeAttestations = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showLibelleOnly, setShowLibelleOnly] = useState(false);
    const [typeattestation, setTypeattestation] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
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
        setTypeattestation(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const recuperation = () => {
        const { typeattestation } = location.state;
        setTypeattestation(typeattestation);
    };

    const update = async () => {
        try {
            await axiosInstance.put(`http://localhost:8080/api/v1/typeattestation/edit/${typeattestation.id}`, {
                libelle: typeattestation.libelle,
                prix_unitaire: typeattestation.prix_unitaire,
                devise: typeattestation.devise
            });
            navigate("/admin/typeattestation");
            localStorage.setItem('updateMessage', 'Le mise à jour de compagnie a été sauvegardée avec succès.');
        } catch (err) {
            navigate("/admin/typeattestation");
            localStorage.setItem('errorupdateMessage', 'Compagnie Update Failed');
        }
    };
    const { Option } = Select;
    const handleCancell = () => {
        setCancelAlertVisible(true);
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création de la compagnie.');
        navigate('/admin/typeattestation');
   
    };
   
    const handleDeviseChange = (value) => {
        setTypeattestation(prevState => ({
            ...prevState,
            devise: value,
        }));
    };
    const currencyOptions = currencyCodes.codes().map(code => ({
        value: code,
        label: `${code} - ${currencyCodes.code(code).currency}`
    }));
    return (
        <>
            <div className="container">
                <br />
                <br />
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 card">
                        <h1 className="text-center"> Mise à jour Type</h1>
                        <div className="card-body">
                            <form>
                           
                            <br/>
                            <br/>
                                <div className="form-group">
                                    <label className="text-center">Description </label>
                                    <input type="text" className="form-control" name="libelle" value={typeattestation.libelle} onChange={handleChange} />
                                </div>
                                <br /> 
                                  
                                <div className="form-group">
                                    <label className="text-center">Prix Unitaire </label>
                                    <input type="text" className="form-control" name="prix_unitaire" value={typeattestation.prix_unitaire} onChange={handleChange} />
                                </div>
                                <br />
                            
                                <div className="form-group">
                                    
                                    <label className="text-center">Devise </label>
                                    <Select
                                        className="custom-select"
                                        options={currencyOptions}
                                        value={typeattestation.devise} // Utiliser directement la valeur de l'état
                                        onChange={handleDeviseChange} // Corriger ici
                                        placeholder="Choisir Devise"
                                    />
                                </div>
                            
                             <br/>
                                <div className="box-footer">
                                    <button type="button" className="btn btn-primary" onClick={showModal} style={{ backgroundColor: 'rgba(96, 122, 214, 0.95)',marginLeft:"19%" }}>Modifier</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                 
                                        <button type="button" className="btn btn-secondary" onClick={handleCancell}>Annuler</button>
                                
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="Confirmation"
                visible={modalVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <p>Êtes-vous sûr de vouloir UPDATE cette compagnie ?</p>
            </Modal>
        </>
    );
}

export default Edit_typeAttestations;
