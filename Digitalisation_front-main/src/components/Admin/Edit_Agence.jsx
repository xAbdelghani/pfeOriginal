import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Link, useLocation } from 'react-router-dom';
import { Select, Modal } from 'antd';
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Edit_Agences = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [agence, setAgence] = useState({});
    const [compagnies, setCompagnies] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        recuperation();
        LoadCompagnies();
        if (location.state && location.state.agence) {
            setAgence(location.state.agence);
        }
    }, [location.state]);

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
        setAgence(prevState => ({
            ...prevState,
            [name]: value,
          
        }));
    };

    const handleRaisonChange = (value) => {
        const selectedCompagnie = compagnies.find(compagnie => compagnie.id === value);
        setAgence(prevState => ({
            ...prevState,
            compagnieDto: selectedCompagnie
        }));
    };

    async function LoadCompagnies() {
        try {
            const result = await axiosInstance.get("http://localhost:8080/api/v1/compagnie/getall"); // Ajustez l'URL en fonction de votre API
            setCompagnies(result.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des compagnies:", error);
        }
    }

    const recuperation = () => {
        const { agence } = location.state;
        setAgence(agence);
    };

    const update = async () => {
        try {
            await axiosInstance.put(`http://localhost:8080/api/v1/agence/edit/${agence.id}`, {
                noma: agence.noma,
                adressea: agence.adressea,
                telephonea: agence.telephonea,
                date_Debuta: agence.date_Debuta,
                date_fina: agence.date_fina,
                status: agence.status,
            });
            navigate("/admin/Agence");
            localStorage.setItem('updateMessage', 'La mise à jour de l\'agence a été sauvegardée avec succès.');
        } catch (err) {
            navigate("/admin/Agence");
            localStorage.setItem('errorupdateMessage', 'Échec de la mise à jour de l\'agence');
        }
    };

    const { Option } = Select;

    const handleCancelUpdate = () => {
        localStorage.setItem('cancelMessage', 'Vous avez annulé la mise à jour de l\'agence.');
        navigate('/admin/agence');
    };

    return (
        <>
            <div className="container">
                <br />
                <br />
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 card">
                        <h1 className="text-center">Mise à jour Agence</h1>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label className="text-center">Raison Social de la Compagnie</label>
                                    <Select
                                        className="custom-select"
                                        showSearch
                                        placeholder="Choisir Raison Sociale"
                                        optionFilterProp="children"
                                        value={agence.raison_social}
                                        onChange={handleRaisonChange}
                                    >
                                        {compagnies.map((compagnie) => (
                                            <Select.Option key={compagnie.id} value={compagnie.id}>
                                                {compagnie.raison_social}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
                                <br />
                                <div className="form-group">
                                    <label className="text-center">Raison social </label>
                                    <input type="text" className="form-control" name="noma" value={agence.noma} onChange={handleChange} />
                                </div>
                                <br />
                                <div className="form-group">
                                    <label className="text-center">Adresse </label>
                                    <input type="text" className="form-control" name="adressea" value={agence.adressea} onChange={handleChange} />
                                </div>
                                <br />
                                <div className="form-group">
                                    <label className="text-center">Téléphone</label>
                                    <PhoneInput
                                        country={'ma'}
                                        value={agence.telephonea || ''}
                                        onChange={(value) => setAgence(prevState => ({ ...prevState, telephonea: value }))}
                                        inputClass="form-control phone-input"
                                        inputStyle={{ width: '100%' }}
                                    />
                                </div>
                                <br />
                                <div className="form-group">
                                    <label className="text-center">Date début</label>
                                    <input type="date" className="form-control" name="date_Debuta" value={agence.date_Debuta} onChange={handleChange} />
                                </div>
                                <br />
                                <div className="form-group">
                                    <label className="text-center">Date fin</label>
                                    <input type="date" className="form-control" name="date_fina" value={agence.date_fina} onChange={handleChange} />
                                </div>
                                <br />
                                <div className="box-footer">
                                    <button type="button" className="btn btn-primary" onClick={showModal} style={{backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"19%"}}>Modifier</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                    <button type="button" className="btn btn-secondary" onClick={handleCancelUpdate}>Annuler</button>
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
                <p>Êtes-vous sûr de vouloir mettre à jour cette agence ?</p>
            </Modal>
        </>
    );
}

export default Edit_Agences;
