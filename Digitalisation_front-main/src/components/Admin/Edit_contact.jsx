import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Link, useLocation ,useParams} from 'react-router-dom';
import { Modal,Select } from 'antd';
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const Edit_Contact = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { compagnieId } = useParams();
    const [fonctions, setFonctions] = useState([]);

    const [contact, setContact] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [cancelAlertVisible, setCancelAlertVisible] = useState(false);
    const { Option } = Select;

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
        setContact(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const recuperation = () => {
        const { contact } = location.state;
        setContact(contact);
    };

    const update = async () => {
        try {
            await axiosInstance.put(`http://localhost:8080/api/v1/contact/edit/${contact.id}`, {
                nomc: contact.nomc,
                fax: contact.fax,
                emailc: contact.emailc,
                telephonec: contact.telephonec,
                prenomc:contact.prenomc,
          
                fonctionDto :contact.fonctionDto,
               ownerco: { id: compagnieId }
            });
         navigate(`/admin/contacts/${compagnieId}`)
            localStorage.setItem('updateMessage', 'La mise à jour du contact a été sauvegardée avec succès.');
        } catch (err) {
          navigate(`/admin/contacts/${compagnieId}`)
            localStorage.setItem('errorupdateMessage', 'La mise à jour du contact a échoué.');
        }
    };

    async function Load() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/fonction/getall");
        setFonctions(result.data);
        console.log(result.data);
      }   
      useEffect(() => {
        Load();
      }, []);

    const handleCancell = () => {
        setCancelAlertVisible(true);
        localStorage.setItem('cancelMessage', 'Vous avez annulé la mise à jour du contact.');
        navigate('/admin/contacts');
    };

    const handleQualiteChange = (value) => {
        const selectedFonction = fonctions.find(fonction => fonction.id === value);
        setContact(prevState => ({
            ...prevState,
            fonctionDto: selectedFonction
 
        }));
    };

    return (
        <>
            <div className="container">
                <br />
                <br />
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 card">
                        <h1 className="text-center">Mise à jour Contact</h1>
                        <div className="card-body">
                            <form>
                            <div className="form-group">
                                    <label className="text-center">Fonction</label>
                                    <Select
                                        className="custom-select"
                                        showSearch
                                        placeholder="Choisir Fonction"
                                        optionFilterProp="children"
                                        value={contact.fonctionDto?.id}
                                        onChange={handleQualiteChange}
                                    >
                                        {fonctions.map((fonction) => (
                                            <Option key={fonction.id} value={fonction.id}>
                                                {fonction.qualite}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="form-group">
                                    <label className="text-center">Nom</label>
                                    <input type="text" className="form-control" name="nomc" value={contact.nomc} onChange={handleChange} />
                                </div>

                                <div className="form-group">
                                    <label className="text-center">Prenom</label>
                                    <input type="text" className="form-control" name="nomc" value={contact.prenomc} onChange={handleChange} />
                                </div>
                               
                               
                               
                                <div className="form-group">
                                    <label className="text-center"> Fixe</label>
                                    <PhoneInput
                                       
                                        country={'ma'}
                                        value={contact.fax || ''} // Assurez-vous de vérifier si telephone est null avant de l'utiliser
                                       
                                        onChange={(value) => setContact(prevState => ({ ...prevState, fax: value }))}
                                        inputClass="form-control phone-input"
                                        inputStyle={{
                                            width: '100%'
                                        }}
                                    />
                                </div>
                                
                                <div className="form-group">
                                    <label className="text-center">Email</label>
                                    <input type="email" className="form-control" name="emailc" value={contact.emailc} onChange={handleChange} />
                                </div>
                                
                         
                                <div className="form-group">
                                    <label className="text-center"> Téléphone</label>
                                    <PhoneInput
                                       
                                        country={'ma'}
                                        value={contact.telephonec || ''} // Assurez-vous de vérifier si telephone est null avant de l'utiliser
                                        onChange={(value) => setContact(prevState => ({ ...prevState, telephonec: value }))}
                                        inputClass="form-control phone-input"
                                        inputStyle={{
                                            width: '100%'
                                        }}
                                    />
                                </div> 
                               <br/>
                              
                                <div className="box-footer">
                                    <button type="button" className="btn btn-primary" onClick={showModal} style={{backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"19%"}}>Modifier</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                  
                                        <button type="button" className="btn btn-secondary" onClick={() => navigate(`/admin/contacts/${compagnieId}`)}>Annuler</button>
                                    
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
                <p>Êtes-vous sûr de vouloir mettre à jour ce contact ?</p>
            </Modal>
        </>
    );
}

export default Edit_Contact;
