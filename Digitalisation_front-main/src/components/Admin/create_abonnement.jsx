import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Select, Alert, Modal, InputNumber } from 'antd';
import { useNavigate } from "react-router-dom";
import currencyCodes from 'currency-codes';

const Create_Abonnements = () => { 
    const [compagnieId, setCompagnieId] = useState('');
    const [typeAbonnementId, setTypeAbonnementId] = useState('');
    const [statutAId, setStatutAId] = useState('');
    const [statutAs, setStatutAs] = useState([]);
    const [montant, setMontant] = useState(0.00);
    const [date_Abonnement, setDate_Abonnement] = useState("");
    const [date_Fin, setDate_Fin] = useState("");
    const [devise, setDevise] = useState("");
    const [statut, setStatut] = useState("Actif");
    const [compagnies, setCompagnies] = useState([]);
    const [typeAbonnements, setTypeAbonnements] = useState([]);
    const [alertVisible, setAlertVisible] = useState(false);
    const [errorVisible, setErrorVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [errors, setErrors] = useState({});
    
    const navigate = useNavigate();

    useEffect(() => {
        loadCompagnies();
        loadTypeAbonnements();
        loadStatutAs();
    }, []);

    const showModal = () => {
        setModalVisible(true);
    };

    const handleOk = async(event) => {
        event.preventDefault();
        setModalVisible(false);
        if (await checkPrepaymentBalance()) {
            checkExistingAbonnementAndSave(event);
        }
    };

    const handleCancel = () => {
        setModalVisible(false);
    };

    async function loadCompagnies() {
        try {
            const result = await axiosInstance.get("http://localhost:8080/api/v1/compagnie/getall");
            setCompagnies(result.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des compagnies:", error);
        }
    }

    async function loadTypeAbonnements() {
        try {
            const result = await axiosInstance.get("http://localhost:8080/api/v1/typeabonnement/getall");
            setTypeAbonnements(result.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des types d'abonnement:", error);
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

    const validateMontant = (montant) => {
        const montantRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
        if (!montantRegex.test(montant)) {
            setErrors(prevErrors => ({ ...prevErrors, montant: "Le montant n'est pas valide. Il doit être un nombre." }));
            return false;
        } else {
            setErrors(prevErrors => ({ ...prevErrors, montant: '' }));
            return true;
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!date_Abonnement) newErrors.date_Abonnement = "* Ce champ est obligatoire";
        if (!date_Fin) newErrors.date_Fin = "* Ce champ est obligatoire";
        if (!devise) newErrors.devise = "* Ce champ est obligatoire";
        if (!validateMontant(montant)) newErrors.montant = "Le montant n'est pas valide. Il doit être un nombre.";
        return newErrors;
    };

    
    async function checkPrepaymentBalance() {
        try {
            const result = await axiosInstance.get(`http://localhost:8080/api/v1/compagnie/${compagnieId}`);
            const compagnie = result.data;
            
            // Vérifier si la compagnie a un solde prépayé
            if (compagnie.soldePrepayeDto.length > 0) {
                // Vérifier chaque solde prépayé
                const hasNonZeroBalance = compagnie.soldePrepayeDto.some(soldePrepaye => soldePrepaye.solde_attestation !== 0);
                
                // Si l'un des soldes prépayés a un solde_attestation différent de 0
                if (hasNonZeroBalance) {
                    setErrors({ date_Abonnement: "La compagnie a un solde de prépaiement non nul." });
                    setErrorVisible(true);
                    return false;
                }
            }
            
            // Si aucun solde prépayé n'a un solde_attestation différent de 0
            return true;
        } catch (error) {
            console.error("Erreur lors de la vérification du solde de prépaiement:", error);
            return false;
        }
    }
    
    

    async function checkExistingAbonnementAndSave(event) {
        event.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorVisible(true);
            return;
        }

        try {
            const result = await axiosInstance.get(`http://localhost:8080/api/v1/abonnement/getall/${compagnieId}`);
            const existingAbonnements = result.data;
            const isOverlap = existingAbonnements.some((abonnement) => 
                new Date(abonnement.date_Fin) >= new Date(date_Abonnement)
            );

            if (isOverlap) {
                setErrors({ date_Abonnement: "Tu peut pas créer une nouvel abonnement au tant que l'abonnement actuel est en cours." });
                setErrorVisible(true);
                return;
            } else {
                save();
            }
        } catch (error) {
            console.error("Erreur lors de la vérification de l'abonnement existant:", error);
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
            await axiosInstance.post("http://localhost:8080/api/v1/abonnement/save/"+statutAId, {
                montant,
                date_Abonnement,
                date_Fin,
                devise,
                statut,
                ownerab: { id: compagnieId },
                ownertab: { id: typeAbonnementId }
            });
            setAlertVisible(true);
            resetForm();
            navigate("/admin/Abonnements");
            localStorage.setItem('successMessage', 'Le nouvel abonnement a été sauvegardé avec succès.');
        } catch (err) {
            setErrorVisible(true);
            localStorage.setItem('errorsuccessMessage', 'Le nouvel abonnement n\'a pas été sauvegardé avec succès.');
        }
    }

    const resetForm = () => {
        setCompagnieId('');
        setTypeAbonnementId('');
        setMontant(0.00);
        setDate_Abonnement('');
        setDate_Fin('');
        setDevise('');
        setStatut('Actif');
    };

    const { Option } = Select;

    const handleCancelAbonnement = () => {
        setModalVisible(false);
        navigate('/admin/Abonnements');
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création de l\'abonnement.');
    };
    const currencyOptions = currencyCodes.codes().map(code => ({
        value: code,
        label: `${code} - ${currencyCodes.code(code).currency}`
    }));

    const buttonStyle = {
        width: '120px', // Taille identique pour les boutons
        height: '40px', // Taille identique pour les boutons
    };


    return (
        <>
            {errorVisible && (
                <Alert
                    message="Erreur"
                    description="L'enregistrement de l'abonnement a échoué."
                    type="error"
                    showIcon
                    style={{ position: 'absolute', bottom: 20, right: 20 }}
                />
            )}
            <br/>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 card">
                        <h1 className="text-center">Nouvel Abonnement</h1>
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
                                    <label className="text-center">Type Abonnement <span style={{ color: 'red' }}>* </span></label>
                                    <Select
                                        className="custom-select"
                                        showSearch
                                        placeholder="Choisir Type"
                                        optionFilterProp="children"
                                        onChange={(value) => setTypeAbonnementId(value)}
                                    >
                                        {typeAbonnements.map((typeAbonnement) => (
                                            <Option key={typeAbonnement.id} value={typeAbonnement.id}>
                                                {typeAbonnement.libelle}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                               
                                <div className="form-group">
                                    {errors.montant && <span className="text-danger">{errors.montant}</span>}
                                    <label className="text-center">Montant <span style={{ color: 'red' }}>* </span></label>
                                    <InputNumber
                                        className="form-control custom-input-number"
                                        min={0}
                                        step={0.01}
                                        value={montant}
                                        onChange={value => setMontant(value)}
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
                                    <label className="text-center">Date Début <span style={{ color: 'red' }}>* </span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={date_Abonnement}
                                        onChange={(event) => setDate_Abonnement(event.target.value)}
                                        placeholder="Entrez Date Début"
                                    />
                                </div>

                                <div className="form-group">
                                    {errors.date_Fin && <div style={{ color: 'red' }}>{errors.date_Fin}</div>}
                                    <label className="text-center">Date Fin <span style={{ color: 'red' }}>* </span></label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        value={date_Fin}
                                        onChange={(event) => setDate_Fin(event.target.value)}
                                        placeholder="Entrez Date Fin"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-center">Statut <span style={{ color: 'red' }}>* </span></label>
                                    <Select
                                        className="custom-select"
                                        showSearch
                                        placeholder="Choisir Statut"
                                        optionFilterProp="children"
                                        onChange={(value) => setStatutAId(value)}
                                    >
                                        {statutAs.map((StatutA) => (
                                            <Option key={StatutA.id} value={StatutA.id}>
                                                {StatutA.libellep}
                                            </Option>
                                        ))}
                                    </Select>
                                </div>
                            {/*   
                                <div className="form-group">
                                    <label className="text-center">Statut</label><br />
                                    <div className="form-check form-check-inline">
                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="statut"
                                            id="statutActive"
                                            value="Actif"
                                            checked={statut === "Actif"}
                                            onChange={(event) => setStatut(event.target.value)}
                                        />
                                        <label className="form-check-label" htmlFor="statutActive">Actif</label>
                                    </div>
                                </div>
                                */}

                                <br />
                                <div className="box-footer">
                                    <button type="button" className="btn btn-primary" onClick={showModal} style={{...buttonStyle,backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"11%"}}>Enregistrer</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                    <button type="button" className="btn btn-secondary" onClick={handleCancelAbonnement} style={buttonStyle}>Annuler</button>
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
                onCancel={handleCancel}
            >
                <p>Êtes-vous sûr de vouloir sauvegarder cet abonnement ?</p>
            </Modal>
        </>
    );
}

export default Create_Abonnements;
