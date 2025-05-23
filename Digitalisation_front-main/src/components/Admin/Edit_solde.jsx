import React, { useState, useEffect } from "react";
import "./navbar.css";
import "bootstrap/dist/css/bootstrap.css";
import axiosInstance from "../../core/axiosConfig";
import { Link, useLocation } from 'react-router-dom';
import { Select, Modal } from 'antd';
import { useNavigate } from "react-router-dom";
import currencyCodes from 'currency-codes';

const Edit_Soldes = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [abonnement, setAbonnement] = useState({});
    const [modalVisible, setModalVisible] = useState(false);
    const [cancelAlertVisible, setCancelAlertVisible] = useState(false);
    const [compagnies, setCompagnies] = useState([]);
    const [compagnie_id, setCompagnie_id] = useState("");
    const [selectedStatut, setSelectedStatut] = useState('');
    const [statutAs, setStatutAs] = useState([]);

    useEffect(() => {
      
        if (location.state && location.state.abonnement) {
            const abonnementData = location.state.abonnement;
            setAbonnement(abonnementData);
            if (abonnementData.statutHistorique && abonnementData.statutHistorique.length > 0) {
                const latestStatut = abonnementData.statutHistorique.sort((a, b) => new Date(b.date) - new Date(a.date))[0];
                setSelectedStatut(latestStatut.libellep);
            }
            loadStatutAs();
            LoadCompagnies();
          
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
        setAbonnement(prevState => ({
            ...prevState,
            [name]: value,
        }));
    };
    const loadStatutAs = async () => {
        try {
            const result = await axiosInstance.get("http://localhost:8080/api/v1/statutA/getall");
            setStatutAs(result.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des statuts:", error);
        }
    };

    const handleRaisonChange = (value) => {
        const selectedCompagnie = compagnies.find(compagnie => compagnie.id === value);
        setAbonnement(prevState => ({
            ...prevState,
            compagnieDto: selectedCompagnie
        }));
    };
    const handleStatutChange = (value) => {
        setSelectedStatut(value);
        const selectedStatut = statutAs.find(statut => statut.id === value);
        setAbonnement(prevState => ({
            ...prevState,
            statut: selectedStatut.libellep,
        }));
    };

    const update = async () => {
        try {
            await axiosInstance.put(`http://localhost:8080/api/v1/solde/edit/${abonnement.id}`, {
                ...abonnement,
              //  raison: abonnement.statut === "Suspendu" ? abonnement.raison : null,
                compagnieDto: abonnement.compagnieDto,
                date_Abonnement: abonnement.date_Abonnement,    
                solde: abonnement.solde,
                devise: abonnement.devise,
                statut: selectedStatut,
            });
            navigate("/admin/solde");
            localStorage.setItem('updateMessage', 'Le mise à jour de compagnie a été sauvegardée avec succès.');
        } catch (err) {
            navigate("/admin/solde");
            localStorage.setItem('errorupdateMessage', 'Compagnie Update Failed');
        }
    };

    const { Option } = Select;

    const handleCancell = () => {
        setCancelAlertVisible(true);
        localStorage.setItem('cancelMessage', 'Vous avez annulé la création de la compagnie.');
        navigate("/admin/solde");
    };

    async function LoadCompagnies() {
        try {
            const result = await axiosInstance.get("http://localhost:8080/api/v1/compagnie/getall");
            setCompagnies(result.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des compagnies:", error);
        }
    };
    const handleDeviseChange = (value) => {
        setAbonnement(prevState => ({
            ...prevState,
            devise: value,
        }));
    };
    const currencyOptions = currencyCodes.codes().map(code => ({
        value: code,
        label: `${code} - ${currencyCodes.code(code).currency}`
    }));


    return (
        <>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-6 col-sm-6 card">
                        <h1 className="text-center">Mise à jour Prepaiement</h1>
                        <div className="card-body">
                            <form>
                                <div className="form-group">
                                    <label className="text-center">Raison Social de la Compagnie</label>
                                    <Select
                                        className="custom-select"
                                        showSearch
                                        placeholder="Choisir Raison Sociale"
                                        optionFilterProp="children"
                                        value={abonnement.raison_social}
                                        onChange={handleRaisonChange}
                                    >
                                        {compagnies.map((compagnie) => (
                                            <Select.Option key={compagnie.id} value={compagnie.id}>
                                                {compagnie.raison_social}
                                            </Select.Option>
                                        ))}
                                    </Select>
                                </div>
        
                                <div className="form-group">
                                    <label className="text-center"> Coût</label>
                                    <input type="text" className="form-control" name="solde" value={abonnement.solde} onChange={handleChange} />
                                </div>

                               
                                <div className="form-group">
                                    
                                    <label className="text-center">Devise </label>
                                    <Select
                                        className="custom-select"
                                        options={currencyOptions}
                                        value={abonnement.devise} // Utiliser directement la valeur de l'état
                                        onChange={handleDeviseChange} // Corriger ici
                                        placeholder="Choisir Devise"
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="text-center"> date abonnement</label>
                                    <input type="date" className="form-control" name="date_Abonnement" value={abonnement.date_Abonnement} onChange={handleChange} />
                                </div>
                                

                                    {/*abonnement.statut === "Suspendu" && (
                                        <div className="form-group mt-2">
                                            <label className="text-center">Motif de l'inactivation</label>
                                            <textarea className="form-control" name="raison" value={abonnement.raison || ''} onChange={handleChange}></textarea>
                                        </div>
                                    )*/}
                           

                                <br />

                                <div className="box-footer">
                                    <button type="button" className="btn btn-primary" onClick={showModal} style={{backgroundColor :'rgba(96, 122, 214, 0.95)',marginLeft:"19%"}}>Modifier</button>
                                    <span style={{ margin: '0 100px' }}></span>
                                    <Link to="/admin/solde">
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

export default Edit_Soldes;
