import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Link, useLocation } from 'react-router-dom';
import { Select, Modal, Switch } from 'antd';
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Edit_points = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showLibelleOnly, setShowLibelleOnly] = useState(false);
    const [pointvente, setPointvente] = useState({});
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
        setPointvente(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const recuperation = () => {
        const { pointvente } = location.state;
        setPointvente(pointvente);
    };

    const update = async () => {
        try {
            await axiosInstance.put(`http://localhost:8080/api/v1/pointvente/edit/${pointvente.id}`, {
                date_Debutp: pointvente.date_Debutp,
                date_finp: pointvente.date_finp,
                nomp:pointvente.nomp,
                telephonep:pointvente.telephonep,
                emailp:pointvente.emailp

            });
            navigate("/admin/Point");
            localStorage.setItem('updateMessage', 'Le mise à jour de compagnie a été sauvegardée avec succès.');
        } catch (err) {
            navigate("/admin/Point");
            localStorage.setItem('errorupdateMessage', 'Compagnie Update Failed');
        }
    };
    const { Option } = Select;
    const handleCancell = () => {
        setCancelAlertVisible(true);
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création de la compagnie.');
        navigate('/admin/Point');
   
    };

    return (
        <>
            <div className="container">
                <br />
                <br />
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 card">
                        <h1 className="text-center"> Mise à jour Point_vente</h1>
                        <div className="card-body">
                            <form>
                            <div className="form-group">
                                    <label className="text-center">Nom</label>
                                    <input type="text" className="form-control" name="nomp" value={pointvente.nomp} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label className="text-center">Email</label>
                                    <input type="text" className="form-control" name="emailp" value={pointvente.emailp} onChange={handleChange} />
                                </div>

                            

                                <div className="form-group">
                                    <label className="text-center">Téléphone</label>
                                    <PhoneInput
                                        country={'ma'}
                                        value={pointvente.telephonep|| ''} // Vérification conditionnelle pour éviter l'erreur
                                        onChange={(value) => setPointvente(prevState => ({ ...prevState, telephonep: value }))} // Mettre à jour l'état agence avec la nouvelle valeur de téléphone
                                        inputClass="form-control phone-input"
                                        inputStyle={{ width: '100%' }}
                                    />
                                </div>

                                <br/>
                                
                                <div className="box-footer">
                                    <button type="button" className="btn btn-primary" onClick={showModal}style={{backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"19%"}}>Modifier</button>
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

export default Edit_points;
