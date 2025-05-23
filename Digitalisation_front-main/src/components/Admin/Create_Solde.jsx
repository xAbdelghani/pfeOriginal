import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Select } from 'antd';
import { Link } from 'react-router-dom';
import { Alert, Modal,InputNumber  } from 'antd';
import { useNavigate, useParams } from "react-router-dom";
import currencyCodes from 'currency-codes';


const Create_Soldes = () => {

    const [abonnementId, setId] = useState('');
    const [compagnieId, setCompagnieId] = useState('');
    const [offreId, setOffreId] = useState('');

    const [solde, setSolde] = useState(0.00);
    const [date_Abonnement, setDate_Abonnement] = useState("");

    const [type, setType] = useState("Prepaiement");
    const [devise, setDevise] = useState("");
    const [statut, setStatut] = useState("Actif");
    const [compagnies, setCompagnies] = useState([]);
    const [statutAId, setStatutAId] = useState('');
    const [statutAs, setStatutAs] = useState([]);

    const [abonnementes, setUsers] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [cancelAlertVisible, setCancelAlertVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [offres, setOffres] = useState([]);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        Load();
        LoadCompagnies();
        loadStatutAs();
        
    }, []);

    const showModal = () => {

        setModalVisible(true);
        // Initialiser les valeurs de l'abonnement en fonction du type sélectionné

    };

    const handleOk = (event) => {
        event.preventDefault();
        setModalVisible(false);
        checkExistingAbonnementAndSave(event);
   

    };

    const handleCancell = () => {
        setModalVisible(false);
    };

    async function Load() {
        const result = await axiosInstance.get("http://localhost:8080/api/v1/solde/getall");
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

    async function loadStatutAs() {
        try {
            const result = await axiosInstance.get("http://localhost:8080/api/v1/statutA/getall");
            setStatutAs(result.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des types d'abonnement:", error);
        }
    }
    const validateMontant = (solde) => {
        const montantRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
        if (!montantRegex.test(solde)) {
            setErrors(prevErrors => ({ ...prevErrors, solde: "Le montant n'est pas valide. Il doit être un nombre." }));
            return false;
        } else {
            setErrors(prevErrors => ({ ...prevErrors, solde: '' }));
            return true;
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!date_Abonnement) newErrors.date_Abonnement = "* Ce champ est obligatoire";
        if (!devise) newErrors.devise = "* Ce champ est obligatoire";

        if (!validateMontant(solde)) newErrors.solde = "Le montant n'est pas valide. Il doit être un nombre.";
        return newErrors;
    };

    
    async function checkExistingAbonnementAndSave(event) {
        event.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorVisible(true);
            return;
        }
    
        try {
            // Vérifie les soldes existants pour cette compagnie
            const existingSoldesResponse = await axiosInstance.get(`http://localhost:8080/api/v1/solde/getall/${compagnieId}`);
            const existingSoldes = existingSoldesResponse.data;
            
            // Vérifie si l'un des soldes existants a un solde attestation différent de zéro
            const hasNonZeroSolde = existingSoldes.some(solde => solde.solde_attestation !== 0);
            
            // Vérifie si l'un des abonnements de la compagnie a une date de fin après la date de début du nouveau solde prépayé
            const existingAbonnementsResponse = await axiosInstance.get(`http://localhost:8080/api/v1/abonnement/getall/${compagnieId}`);
            const existingAbonnements = existingAbonnementsResponse.data;
            
            const hasAbonnementWithEndDateAfterStart = existingAbonnements.some(abonnement => new Date(abonnement.date_Fin) > new Date(date_Abonnement));
            
            if (hasNonZeroSolde || hasAbonnementWithEndDateAfterStart) {
                // Affiche une erreur si l'une des conditions n'est pas remplie
                setErrors({ solde: "Vous ne pouvez pas créer un nouveau solde prépayé car l'un des soldes existants a un solde attestation différent de zéro ou un abonnement actif se termine après la date de début de ce solde." });
                setErrorVisible(true);
                return;
            } else {
                // Enregistre le nouveau solde prépayé si toutes les conditions sont remplies
                save();
            }
        } catch (error) {
            console.error("Erreur lors de la vérification des abonnements existants:", error);
        }
    }
    
    async function save() {
        
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorVisible(true);
            return;
        }
        try {
            console.log(statutAId);
            await axiosInstance.post(`http://localhost:8080/api/v1/solde/save`, {

                devise: devise,
                solde: solde,
                date_Abonnement: date_Abonnement,
                type:type,
              
                ownerso: { id: compagnieId },
               

            });
            setAlertVisible(true);
            setId("");

            setSolde(0.00);
            setDate_Abonnement("");
            setDevise("");
            setType("Prepaiement");
         
            navigate("/admin/solde");
            localStorage.setItem('successMessage', 'La nouvelle compagnie a été sauvegardée avec succès.');
        } catch (err) {
            setErrorVisible(true);
            localStorage.setItem('errorsuccessMessage', 'La nouvelle compagnie n\'est pas sauvegardée avec succès.');
        }
    }

    const { Option } = Select;

    const currencyOptions = currencyCodes.codes().map(code => ({
        value: code,
        label: `${code} - ${currencyCodes.code(code).currency}`
    }));
    const handleCancel = () => {
        setCancelAlertVisible(true);
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création de la compagnie.');
        navigate('/admin/solde');
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
                        <h1 className="text-center">Nouveau Solde</h1>
                        <div className="card-body">
                            <form>

                                <div className="form-group">
                                    <label className="text-center">Raison Social de la Compagnie <span style={{ color: 'red' }}>* </span></label>
                                    <Select
                                        className="custom-select"
                                        showSearch
                                        placeholder="Choisir Raison Social"
                                        optionFilterProp="children"
                                        onChange={(value) => setCompagnieId(value)}
                                    >
                                        {compagnies.map((compagnie) => (
                                            <Option key={compagnie.id} value={compagnie.id}>
                                                {compagnie.raison_social}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>

                                <div className="form-group">
                               
                                    <label className="text-center">Type </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={type}
                                       
                                       
                                    />
                                    
                                </div>

                                <div className="form-group">
                                {errors.solde && <span className="text-danger">{errors.solde}</span>}
                                    <label className="text-center">Coùt <span style={{ color: 'red' }}>* </span></label>
                                    <InputNumber
                                        className="form-control custom-input-number"
                                        min={0}
                                        step={0.01}
                                        value={solde}
                                        onChange={value => setSolde(value)}
                                        formatter={value => `${Number(value).toFixed(2)}`}
                                        parser={value => parseFloat(value.replace(/[^0-9.]/g, ''))}
                                       style={{ height: "35px", /* ajustez la hauteur selon vos besoins */
                                       padding: "1px",
                                       fontsize: "16px" }}
                                    />
                                </div>


                                <div className="form-group">
                                    {errors.devise && <div style={{ color: 'red' }}>{errors.devise}</div>}
                                    <label className="text-center">Devise <span style={{ color: 'red' }}>* </span></label>
                                    <Select
                                        className="custom-select"
                                        options={currencyOptions}
                                        value={devise} // Utiliser directement la valeur de l'état
                                        onChange={(value) => setDevise(value)} // Corriger ici
                                        placeholder="Choisir Devise"
                                    />

                                </div>



                                <div className="form-group">
                                    {errors.date_Abonnement && <div style={{ color: 'red' }}>{errors.date_Abonnement}</div>}
                                    <label className="text-center">Date Abonnement <span style={{ color: 'red' }}>* </span></label>
                                    <input type="date" className="form-control" value={date_Abonnement} onChange={(event) => setDate_Abonnement(event.target.value)} placeholder="Entrez Date debut" />
                                </div>




                              

                                <br />
                                <div className="box-footer">
                                    <button type="button" className="btn btn-primary " onClick={showModal} style={{...buttonStyle, backgroundColor: 'rgba(96, 122, 214, 0.95)',marginLeft:"11%"  }}>Enregistrer</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                    <button type="button" className="btn btn-secondary " onClick={handleCancel}style={buttonStyle} >Annuler</button>
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
                <p>Êtes-vous sûr de vouloir sauvegarder ce prepaiement ?</p>
            </Modal>
        </>
    );
}

export default Create_Soldes;