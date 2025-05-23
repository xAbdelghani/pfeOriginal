import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Link, useLocation } from 'react-router-dom';
import { Select, Modal, Switch } from 'antd';
import { useNavigate } from "react-router-dom";

const Edit_StatutC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showLibelleOnly, setShowLibelleOnly] = useState(false);
    const [statutC, setStatutC] = useState({});
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
        setStatutC(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const recuperation = () => {
        const { statutC } = location.state; 
        setStatutC(statutC);
    };

    const update = async () => {
        try {
            await axiosInstance.put(`http://localhost:8080/api/v1/statutC/edit/${statutC.id}`, {
                libellec: statutC.libellec,
              
            });
            navigate("/admin/StatutC");
            localStorage.setItem('updateMessage', 'Le mise à jour de compagnie a été sauvegardée avec succès.');
        } catch (err) {
            navigate("/admin/StatutC");
            localStorage.setItem('errorupdateMessage', 'Compagnie Update Failed');
        }
    };
    const { Option } = Select;
    const handleCancell = () => {
        setCancelAlertVisible(true);
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création de la compagnie.');
        navigate('/admin/StatutC');
   
    };
   

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
                                    <label className="text-center">Libelle abonnement</label>
                                    <input type="text" className="form-control" name="libellec" value={statutC.libellec} onChange={handleChange} />
                                </div>
                                <br /> 
                                  
                                <div className="box-footer">
                                    <button type="button" className="btn btn-primary" onClick={showModal}style={{backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"19%"}}>Modifier</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                    <Link to="/admin/StatutC">
                                        <button type="button" className="btn btn-secondary" onClick={handleCancell}>Annuler</button>
                                    </Link>
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

export default Edit_StatutC;
