import React, { useState, useEffect } from "react";
import axiosInstance from "../../core/axiosConfig";
import { useNavigate, useParams } from 'react-router-dom'; // Utilisation de useParams pour obtenir l'ID de la compagnie
import { Alert, Modal } from 'antd';
import { Select } from 'antd';
import '../Admin/navbar.css';

import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
 

const Create_contactc = () => {
    const { compagnieId } = useParams(); // Récupère l'ID de la compagnie depuis l'URL
    const [nomc, setNomc] = useState('');
    const [contactId, setId] = useState('');
    const [prenomc, setPrenomc] = useState('');
    const [fonctions, setFonctions] = useState([]);
    const [fax, setFax] = useState('');
    const [emailc, setEmailc] = useState('');
    const [telephonec, setTelephonec] = useState('');
    const [remarquec, setRemarquec] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const { Option } = Select;
    const navigate = useNavigate();

    const showModal = () => {
        setModalVisible(true);
    };
    useEffect(() => {
        Load();
      }, []);
      async function Load() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/fonction/getall");
        setFonctions(result.data);
        console.log(result.data);
      }    

    const handleOk = async (event) => {
        event.preventDefault();
        try {
            await axiosInstance.post('http://localhost:8080/api/v1/contact/save', {
                nomc,
                prenomc,
                fax,
                emailc,
                telephonec,
               
                ownerco: { id: compagnieId }, // Ajoute l'ID de la compagnie dans la requête
                ownerfo: {id: contactId}
            });
            
            setAlertVisible(true);
            setTimeout(() => navigate(`/client/Contact`), 2000); // Redirige vers la liste des contacts de la compagnie
        } catch (err) {
            setErrorVisible(true);
        } finally {
            setModalVisible(false);
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
    };
    const buttonStyle = {
        width: '120px', // Taille identique pour les boutons
        height: '40px', // Taille identique pour les boutons
    };


    return (
        <>
            {alertVisible && (
                <Alert
                    message="Succès"
                    description="Contact créé avec succès."
                    type="success"
                    showIcon
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            )}
            {errorVisible && (
                <Alert
                    message="Erreur"
                    description="La création du contact a échoué."
                    type="error"
                    showIcon
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            )}
            <div className="container">
                <br />
                <br />
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-8 col-sm-10 card">
                        <h1 className="text-center">Nouveau Contact</h1>
                        <div className="card-body">
                            <form>
                            <div className="form-group">
                         
                                    <label >Fonction <span style={{ color: 'red' }}>* </span></label>
                                    <Select
                                        className="custom-select"
                                        showSearch
                                        placeholder="Choisir Fonction"
                                        optionFilterProp="children"
                                        onChange={(value) => setId(value)}
                                    >
                                        {fonctions.map((fonction) => (
                                            <Option key={fonction.id} value={fonction.id}>
                                                {fonction.qualite}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="form-group">
                               
                                    <label>Nom <span style={{ color: 'red' }}>* </span></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={nomc}
                                        onChange={(e) => setNomc(e.target.value)}
                                        placeholder="Entrez le nom "
                                    />
                                </div>

                                
                                <div className="form-group">
                               
                               <label>Prenom <span style={{ color: 'red' }}>* </span></label>
                               <input
                                   type="text"
                                   className="form-control"
                                   value={prenomc}
                                   onChange={(e) => setPrenomc(e.target.value)}
                                   placeholder="Entrez le prenom "
                               />
                           </div>
                               
                                <div className="form-group">
                                <label  > Fixe</label>
                                    <PhoneInput
                                      
                                        country={'ma'}
                                        value={fax}
                                        onChange={setFax}
                                        inputClass="form-control phone-input"
                                        inputStyle={{
                                            width: '100%' ,
                                        

                                        }}
                                    />
                                </div>
                               
                             
                                <div className="form-group">
                                
                                    <label>Email <span style={{ color: 'red' }}>* </span></label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        value={emailc}
                                        onChange={(e) => setEmailc(e.target.value)}
                                        placeholder="Entrez l'email "
                                    />
                                </div>
                            
                                <div className="form-group">
                                    <label  > Telephone</label>
                                    <PhoneInput
                                      
                                        country={'ma'}
                                        value={telephonec}
                                        onChange={setTelephonec}
                                        inputClass="form-control phone-input"
                                        inputStyle={{
                                            width: '100%' ,
                                        

                                        }}
                                    />
                                </div>
                               
                                
                                <br />
                                <div className="box-footer text-center">
                                    <button type="button" className="btn btn-primary" onClick={showModal} style={{...buttonStyle,backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"11%"}}>Enregistrer</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                    <button type="button" className="btn btn-secondary" onClick={() => navigate(`/client/Contact`)}style={buttonStyle}>Annuler</button>
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
                <p>Êtes-vous sûr de vouloir sauvegarder ce contact ?</p>
            </Modal>
        </>
    );
};

export default Create_contactc; 
