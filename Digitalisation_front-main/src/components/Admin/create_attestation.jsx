import React, {  useState ,useEffect} from "react";
import "../Admin/navbar.css"
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Link, useLocation } from 'react-router-dom';
import { Alert, Modal } from 'antd';
import { useNavigate } from "react-router-dom";

const Create_attestation = () => {
    const [attestationid, setId] = useState('');
    const [date_Generation, setDate_Generation] = useState("");
    const [date_Debut, setDate_Debut] = useState("");
    const [date_Fin, setDate_Fin] = useState("");
    const [prix, setPrix] = useState('');
    const [statut, setStatut] = useState("");
    const [attestations, setUsers] = useState([]);
    const [file, setFile] = useState(null);
    const [alertVisible, setAlertVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [cancelAlertVisible, setCancelAlertVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();



    // Fonction de gestion pour mettre à jour le fichier lorsqu'il est sélectionné
    

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
        const result = await axiosInstance.get("http://localhost:8080/api/v1/attestation/getall");
        setUsers(result.data);
        console.log(result.data);
    }

     const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    const save = async (event) => {
        event.preventDefault();
    
        if (!file) {
            alert("Veuillez sélectionner un fichier.");
            return;
        }
    
        const formData = new FormData();
        formData.append("fichier", file);
        formData.append("date_Generation", date_Generation);
        formData.append("date_Debut", date_Debut);
        formData.append("date_Fin", date_Fin);
        formData.append("prix", prix);
        formData.append("statut", statut);
    
        try {
            await axiosInstance.post("http://localhost:8080/api/v1/attestation/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
         
            setDate_Generation("");
            setDate_Debut("");
            setDate_Fin("");
            setPrix("");
            setStatut("");
            Load();
            navigate("/admin/Attestations");
            localStorage.setItem('successMessage', 'La nouvelle Attestation a été sauvegardée avec succès.');
        } catch (err) {
            setErrorVisible(true);
            localStorage.setItem('errorsuccessMessage', 'La nouvelle Attestation n\'est pas sauvegardée avec succès.');
        }
    };
    const handleCancel = () => {
        setCancelAlertVisible(true);
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création de la compagnie.');
        navigate('/admin/Attestations');
    };
    const buttonStyle = {
        width: '120px', // Taille identique pour les boutons
        height: '40px', // Taille identique pour les boutons
    };

    
    return (
        <>
        <div className="container">
            <br/>
                <br/>
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-6 col-sm-6 card">
                    <h1 className="text-center">Nouvelle Attestation</h1>
                    
                    <div className="card-body">
                        <form >
                            <div className="form-group">
                                <label className="text-center">Compagnie Date Generation</label>
                                <input type="date" className="form-control" value={date_Generation} onChange={(event) => setDate_Generation(event.target.value)} placeholder="Enter Attestationnie Date Generation" />
                            </div>

                            <br/>

                            <div className="form-group">
                                <label className="text-center">attestation Date Debut</label>
                                <input type="date" className="form-control" value={date_Debut} onChange={(event) => setDate_Debut(event.target.value)} placeholder="Enter Attestation Date debut" />
                            </div>

                            <br/>

                            <div className="form-group">
                                <label className="text-center">attestation Date Fin</label>
                                <input type="date" className="form-control" value={date_Fin} onChange={(event) => setDate_Fin(event.target.value)} placeholder="Enter Attestation Date Fin" />
                            </div>

                            <br/>

                            <div className="form-group">
    <label htmlFor="file">Sélectionner un fichier</label>
    <input type="file" id="file" name="fichier" onChange={handleFileChange} accept="application/pdf" />
</div>


                            <br/>

                            <div className="form-group">
                                <label className="text-center">Attestation Prix</label>
                                <input type="text" className="form-control" value={prix} onChange={(event) => setPrix(event.target.value)} placeholder="Enter attestation Prix" />
                            </div>

                            <br/>

                            <br/>

                            <div className="form-group">
                                <label className="text-center">Attestation Statut</label><br />
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="statut" id="statutActive" value="Payé" checked={statut === "Payé"} onChange={(event) => setStatut(event.target.value)} />
                                    <label className="form-check-label" htmlFor="statutActive">Payé</label>
                                </div>
                                <span style={{margin: '0 10px'}}></span>
                                <div className="form-check form-check-inline">
                                    <input className="form-check-input" type="radio" name="statut" id="statutInactive" value="Non_Payé" checked={statut === "Non_Payé"} onChange={(event) => setStatut(event.target.value)} />
                                    <label className="form-check-label" htmlFor="statutInactive">Non_Payé</label>
                                </div>
                            </div>

                            <br/>

                            <div className="box-footer">
                                <button type="button" className="btn btn-primary " onClick={showModal} style={{...buttonStyle,backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"11%"}}>Submit</button>
                                <span style={{margin: '0 100px'}}></span>
                                
                                <button type="button" className="btn btn-secondary " onClick={handleCancel}style={buttonStyle}>Annuler</button>
                               
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
                <p>Êtes-vous sûr de vouloir sauvegarder cette attestation ?</p>
            </Modal>
      </>
        
    );
}

export default Create_attestation;
