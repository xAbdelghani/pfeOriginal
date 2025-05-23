import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Select, DatePicker, Alert, Modal } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import moment from 'moment';

const Create_Points = () => {
    const [pointventeid, setId] = useState('');
    const [pointventes, setUsers] = useState([]);
    const [emailp, setEmailp] = useState("");
    const [telephonep, setTelephonep] = useState("");
    const [nomp, setNomp] = useState("");
    const [alertVisible, setAlertVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [cancelAlertVisible, setCancelAlertVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [compagnies, setCompagnies] = useState([]);
    const [selectedCompagnies, setSelectedCompagnies] = useState([]);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const { Option } = Select;

    useEffect(() => {
        Load();
        loadCompagnies();
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

    const handleCompagnieChange = (value, index, field) => {
        const newSelectedCompagnies = [...selectedCompagnies];
        newSelectedCompagnies[index][field] = value;
        setSelectedCompagnies(newSelectedCompagnies);
    };

    async function Load() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/pointvente/getall");
        setUsers(result.data);
    }

    async function loadCompagnies() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/compagnie/getall");
        setCompagnies(result.data);
    }

    const validate = () => {
        const newErrors = {};
        if (!nomp) newErrors.nomp = "* Ce champ est obligatoire";
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
            const pointventeResponse = await axiosInstance.post("http://localhost:8080/api/v1/pointvente/save", {
                emailp,
                telephonep,
                nomp,
               
            });

            const pointventeId = pointventeResponse.data;
            console.log(pointventeId);

            await Promise.all(selectedCompagnies.map(comp => {
                return axiosInstance.post("http://localhost:8080/api/v1/relationcp/save", {
                    dateDebut: comp.dateDebut,
                    dateFin: comp.dateFin,
                    compagnie: { id: comp.compagnieId },
                    pointvente: { id: pointventeId }
                });
            }));

            setAlertVisible(true);
            setEmailp("");
            setTelephonep("");
            setNomp("");
            setSelectedCompagnies([]);
            
            Load();
            navigate("/admin/Point");
            localStorage.setItem('successMessage', 'Le nouveau courtier a été sauvegardé avec succès.');
        } catch (err) {
            setErrorVisible(true);
            localStorage.setItem('errorsuccessMessage', 'Le nouveau courtier n\'a pas été sauvegardé avec succès.');
        }
    }

    const handleCancel = () => {
        setCancelAlertVisible(true);
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création du courtier.');
        navigate('/admin/Point');
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
                    description="Enregistrement du courtier a échoué."
                    type="error"
                    showIcon
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            )}
            <br />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 card">
                        <h1 className="text-center">Nouveau Courtier</h1>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    {errors.nomp && <div style={{ color: 'red' }}>{errors.nomp}</div>}
                                    <label className="text-center"> Nom <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" className="form-control" value={nomp} onChange={(event) => setNomp(event.target.value)} placeholder="Entrez Nom" />
                                </div>
                           
                                <div className="form-group">
                                    <label className="text-center"> Email <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" className="form-control" value={emailp} onChange={(event) => setEmailp(event.target.value)} placeholder="Entrez Email" />
                                </div>
                                <div className="form-group">
                                    <label className="text-center" > Téléphone <span style={{ color: 'red' }}>* </span></label>
                                    <PhoneInput
                                        country={'ma'}
                                        value={telephonep}
                                        onChange={setTelephonep}
                                        inputClass="form-control phone-input"
                                        inputStyle={{ width: '100%' }}
                                    />
                                </div>
                                <br />
                                {selectedCompagnies.map((comp, index) => (
                                    <div key={index} className="form-group">
                                        <label>Compagnie <span style={{ color: 'red' }}>* </span></label>
                                        <Select
                                            className="form-control"
                                            value={comp.compagnieId}
                                            onChange={(value) => handleCompagnieChange(value, index, 'compagnieId')}
                                        >
                                            {compagnies.map(c => (
                                                <Option key={c.id} value={c.id}>{c.raison_social}</Option>
                                            ))}
                                        </Select>
                                        <br />
                                        <label>Date Début <span style={{ color: 'red' }}>* </span></label>
                                        <DatePicker
                                            className="form-control"
                                            value={comp.dateDebut ? moment(comp.dateDebut) : null}
                                            onChange={(date) => handleCompagnieChange(date ? date.format('YYYY-MM-DD') : null, index, 'dateDebut')}
                                        />
                                        <br />
                                        <label>Date Fin <span style={{ color: 'red' }}>* </span></label>
                                        <DatePicker
                                            className="form-control"
                                            value={comp.dateFin ? moment(comp.dateFin) : null}
                                            onChange={(date) => handleCompagnieChange(date ? date.format('YYYY-MM-DD') : null, index, 'dateFin')}
                                        />
                                    </div>
                                ))}
                               
                                <br /><br />
                                <div className="box-footer">
                                    <button type="button" className="btn btn-primary" onClick={showModal} style={{...buttonStyle, backgroundColor: 'rgba(96, 122, 214, 0.95)',marginLeft:"11%"  }}>Enregistrer</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                    <button type="button" className="btn btn-secondary" onClick={handleCancel}style={buttonStyle}>Annuler</button>
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
                onCancel={handleCancell}
            >
                <p>Êtes-vous sûr de vouloir sauvegarder ce courtier ?</p>
            </Modal>
        </>
    );
}

export default Create_Points;
