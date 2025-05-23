import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Select } from 'antd';
import { Link } from 'react-router-dom';
import { Alert, Modal } from 'antd';
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Create_Agences = () => {
    const [agenceid, setId] = useState('');
    const [agences, setUsers] = useState([]);
    const [noma, setNoma] = useState("");
    const [adressea, setAdressea] = useState("");
    const [telephonea, setTelephonea] = useState("");
    const [date_Debuta, setDate_Debuta] = useState("");
    const [date_fina, setDate_fina] = useState("");
    const [compagnies, setCompagnies] = useState([]);
    const [startedFilling, setStartedFilling] = useState(false);

   
    const [alertVisible, setAlertVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [cancelAlertVisible, setCancelAlertVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        Load();
        LoadCompagnies();
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
    const handleChange = () => {
        setStartedFilling(true); // Mettre à jour l'état lorsque vous commencez à remplir les champs
    };
    async function Load() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/agence/getall");
        setUsers(result.data);
    }
    async function LoadCompagnies() {
        try {
            const result = await axiosInstance.get("http://localhost:8080/api/v1/compagnie/getall"); // Ajustez l'URL en fonction de votre API
            setCompagnies(result.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des compagnies:", error);
        }
    }

    async function save(event) {
        event.preventDefault();
        try {
            await axiosInstance.post("http://localhost:8080/api/v1/agence/save", {
                noma:noma,
                adressea:adressea,
                telephonea:telephonea,
                date_Debuta:date_Debuta,
                date_fina:date_fina,
                ownerag:{id:agenceid},
                


               
            });
            setAlertVisible(true);
            setNoma("");
            setAdressea("");
            setTelephonea("");
            setDate_Debuta("");
            setDate_Debuta("");
            setDate_fina("");
            Load();
            navigate("/admin/Agence");
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
        navigate('/admin/Agence');
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
                        <h1 className="text-center">Nouvelle Agence</h1>
                        <div className="card-body">
                            <form>
                            <div className="form-group"> 
                         
                                    <label className="text-center">Raison Social de la Compagnie <span style={{ color: 'red' }}>* </span></label>
                                    <Select
                                        className="custom-select"
                                        showSearch
                                        placeholder="Choisir Raison Social"
                                        optionFilterProp="children"
                                        onChange={(value) => setId(value)}
                                    >
                                        {compagnies.map((compagnie) => (
                                            <Option key={compagnie.id} value={compagnie.id}>
                                                {compagnie.raison_social}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                <br/>
                                <div className="form-group">
                               
                                    <label className="text-center"> Raison social <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" className="form-control" value={noma} onChange={(event) => setNoma(event.target.value)} placeholder="Entrez Adresse" onChangee={handleChange} />
                                </div>
                                <br/> 
                            <div className="form-group">
                           
                                    <label className="text-center"> Adresse <span style={{ color: 'red' }}>* </span></label>
                                    <input type="text" className="form-control" value={adressea} onChange={(event) => setAdressea(event.target.value)} placeholder="Entrez Adresse" />
                                </div>
                                <br/> 
                                <div className="form-group">
                                    <label className="text-center" > Telephone</label>
                                    <PhoneInput
                                      
                                        country={'ma'}
                                        value={telephonea}
                                        onChange={setTelephonea}
                                        inputClass="form-control phone-input"
                                        inputStyle={{
                                            width: '100%' ,
                                        

                                        }}
                                    />
                                </div>
                                <br/> 

                                <div className="form-group">
                              
                                    <label className="text-center">Date Debut <span style={{ color: 'red' }}>* </span></label>
                                    <input type="date" className="form-control" value={date_Debuta} onChange={(event) => setDate_Debuta(event.target.value)} placeholder="Entrez Date debut" />
                                </div>
                                <br/>
                                
                               
                           <br/>
                           <br/>
                                <div className="box-footer">
                                    <button type="button" className="btn btn-primary " onClick={showModal} style={{...buttonStyle,backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"11%"}}>Enregistrer</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                    <button type="button" className="btn btn-secondary " onClick={handleCancel} style={buttonStyle} >Annuler</button>
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

export default Create_Agences;
