import React, {  useState ,useEffect, useRef} from "react";
import "../Admin/navbar.css"
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Link, useLocation } from 'react-router-dom';
import { Select ,Modal} from 'antd';
import { useNavigate } from "react-router-dom";

const Edit_attestation = () => {
    const date_Generationref = useRef("")
    
    const date_Debutref = useRef("")
    const date_Finref = useRef("")
    const prixref = useRef('')
    
  
    const location = useLocation();
    


    const [attestationid, setId] = useState('');
    const [date_Generation, setDate_Generation] = useState("");
    const [date_Debut, setDate_Debut] = useState("");
    const [date_Fin, setDate_Fin] = useState("");
    const [prix, setPrix] = useState('');
    const [statut, setStatut] = useState("");
    const [attestations, setUsers] = useState([]);
    const [file, setFile] = useState(null);
    const [nomFihier, setNomFichier] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const navigate = useNavigate();
    const [cancelAlertVisible, setCancelAlertVisible] = useState(false);


    // Fonction de gestion pour mettre à jour le fichier lorsqu'il est sélectionné
    

    useEffect(() => {
        recuperation();
    }, []);

    const showModal = () => {
        setModalVisible(true);
    };

    const handleOk = (event) => {
        event.preventDefault();
    setModalVisible(false);
    update(event); 
    };

    const handleCancell = () => {
        setModalVisible(false);
    };


    async function recuperation() {
        const resultat  = await location.state.attestation;
            
        date_Generationref.current.value= resultat.date_Generation;
        date_Debutref.current.value= resultat.date_Debut;
        date_Finref.current.value= resultat.date_Fin;
        prixref.current.value= resultat.prix;
        setId(resultat.id);
        setDate_Generation(resultat.date_Generation);
        setDate_Debut(resultat.date_Debut);
        setDate_Fin(resultat.date_Fin);
        setPrix(resultat.prix); 
        setStatut(resultat.statut); 
        setNomFichier(resultat.nomFichier);
        }

    async function Load() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/attestation/getall");
        setUsers(result.data);
        console.log(result.data);
    }

     const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };
    
    async function update(event) {
        event.preventDefault();

        if (!file && !attestationid) {
            alert("Veuillez sélectionner une attestation à mettre à jour.");
            return;
        }

        try {
            const formData = new FormData();
            file && formData.append("file", file);
            formData.append("date_Generation", date_Generation);
            formData.append("date_Debut", date_Debut);
            formData.append("date_Fin", date_Fin);
            formData.append("prix", prix);
            formData.append("statut", statut);

            await axiosInstance.put(`http://localhost:8080/api/v1/attestation/edit/${attestationid}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });

            navigate("/admin/attestations");
            localStorage.setItem('updateMessage', 'Le mise à jour de attestation a été sauvegardée avec succès.');
            Load();
        } catch (err) {
            navigate("/admin/attestations");
            localStorage.setItem('errorupdateMessage', 'attestation Update Failed');
        }
    }
    const handleCancel = () => {
        setCancelAlertVisible(true);
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création de la compagnie.');
        
            navigate('/attestations');
   
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
                                <input type="date" className="form-control" ref={date_Generationref} onChange={(event) => setDate_Generation(event.target.value)} placeholder="Enter Attestationnie Date Generation" />
                            </div>

                            <br/>

                            <div className="form-group">
                                <label className="text-center">attestation Date Debut</label>
                                <input type="date" className="form-control" ref={date_Debutref} onChange={(event) => setDate_Debut(event.target.value)} placeholder="Enter Attestation Date debut" />
                            </div>

                            <br/>

                            <div className="form-group">
                                <label className="text-center">attestation Date Fin</label>
                                <input type="date" className="form-control" ref={date_Finref} onChange={(event) => setDate_Fin(event.target.value)} placeholder="Enter Attestation Date Fin" />
                            </div>

                            <br/>

                            <div className="form-group">
                            <label className="text-center">Nom du fichier à modifier : {nomFihier}</label>
    <input type="file" id="file" name="fichier" onChange={handleFileChange} accept="application/pdf" />
</div>


                            <br/>

                            <div className="form-group">
                                <label className="text-center">Attestation Prix</label>
                                <input type="text" className="form-control" ref={prixref} onChange={(event) => setPrix(event.target.value)} placeholder="Enter attestation Prix" />
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
                            <button type="button" className="btn btn-primary " onClick={showModal}style={{backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"19%"}}>Modifier</button>
                                <span style={{margin: '0 100px'}}></span>
                                <Link to="/admin/Attestations">
                                <button type="button" className="btn btn-secondary " onClick={handleCancel}>Annuler</button>
                                </Link>
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
                <p>Êtes-vous sûr de vouloir UPDATE cette attestation ?</p>
            </Modal>
        </>
        
    );
}

export default Edit_attestation;
