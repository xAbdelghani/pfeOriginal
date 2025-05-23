import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter as Router, Route, Routes, Navigate, Outlet, useLocation } from 'react-router-dom';
import './App.css';
import Edit_Compagnies from './components/Admin/EditCompagnie';
import Compagnies from './components/Admin/compagnies';
import Create_Compagnies from './components/Admin/create_compagnie';
import Attestationtest from './components/Admin/test';
import Edit_attestation from './components/Admin/Edit_attestations';
import Attestation from './components/Admin/attestation';
import Create_attestation from './components/Admin/create_attestation';
import Layoutt from "./components/Client/layout";
import ContactPage from "./components/Client/ContactPage";
import Facture from "./components/Admin/facture";
import Profil from "./components/Client/Profil";
import Login from "./components/Client/Login";
import Abonnements from "./components/Admin/abonnement";
import Create_Abonnements from "./components/Admin/create_abonnement";
import Edit_Abonnements from "./components/Admin/Edit_abonnement";
import Type_Abonnements from "./components/Admin/typeabonnement";
import Create_TypeAbonnements from "./components/Admin/create_typeabonnement";
import Edit_typeAbonnements from "./components/Admin/Edit_typeabonnement";
import Navbar1 from "./components/Admin/navbar1";
import { Layout, Menu, theme } from 'antd';
import orsyss from "../src/assets/orsyss.png";
import SoldePrepayes from "./components/Admin/solde";
import ContactList from "./components/Admin/ContactList";
import Edit_Contact from "./components/Admin/Edit_contact";
import Create_contact from "./components/Admin/create_contact";
import Fonctions from "./components/Admin/Fonction";
import Create_Fonctions from "./components/Admin/create_fonction";
import Edit_fonctions from "./components/Admin/Edit_fonction";
import Contact from "./components/Admin/contact";
import Pointventes from "./components/Admin/Pointvente";
import Create_Points from "./components/Admin/CreatePoint";
import Edit_points from "./components/Admin/Edit_Point";
import CompagnieList from "./components/Admin/CompagnieList";
import CreateCompagnies from "./components/Admin/Createcompagnies";
import EditCompagnies from "./components/Admin/Edit_compagnie";
import Types from "./components/Admin/Type";
import Create_Types from "./components/Admin/Create_Type";
import Edit_types from "./components/Admin/Edit_Type";
import ViewUser from "./components/Admin/Apercu";
import Factures from "./components/Admin/Facturee";
import AddFacture from "./components/Admin/Create_Facture";
import EditFacture from "./components/Admin/Edit_Facture";
import Agences from "./components/Admin/Agence";
import Create_Agences from "./components/Admin/Create_agence";
import Edit_Agences from "./components/Admin/Edit_Agence";
import Create_Soldes from "./components/Admin/Create_Solde";
import Edit_Soldes from "./components/Admin/Edit_solde";
import Offres from "./components/Admin/Offre";
import Create_Offres from "./components/Admin/Create_offre";
import Edit_offres from "./components/Admin/Edit_offre";
import ViewAbonnement from "./components/Admin/ViewAbonnement";
import ViewSolde from "./components/Admin/ViewSolde";
import EditContact from "./components/Admin/Editcontact";
import Createcontact from "./components/Admin/CreateContact";
import StatusA from "./components/Admin/StatusA";
import Create_StatutAs from "./components/Admin/Create_Statut";
import Edit_StatutAs from "./components/Admin/EditStatus";
import Breadcrumbs from "./components/Admin/breadcrumbNameMap";
import Relation from "./components/Admin/relation";
import StatusC from "./components/Admin/StatusC";
import Create_StatutC from "./components/Admin/Create_StatutC";
import Edit_StatutC from "./components/Admin/EditStatusC";
import Home from "./components/Admin/home";
import ProtectedRoute from './components/ProtectedRoute';
import { KeycloakProvider } from './components/KeycloakContext';
import Compte from "./components/Admin/compte";
import Create_compte from "./components/Admin/createcompte";
import Type_Attestations from "./components/Admin/typeattestation";
import Create_TypeAttestations from "./components/Admin/create_typeattestation";
import Edit_typeAttestations from "./components/Admin/Edit_typeattestation";
import Vehicules from "./components/Admin/Vehicule";
import ModeleVehicules from "./components/Admin/Modelevehicule";
import AttestationsAutorisees from "./components/Admin/AttestationsAutorisees";
import StatusAtt from "./components/Admin/StatusAtt";
import Create_StatutAtt from "./components/Admin/create_statusAtt";
import Edit_StatutAtt from "./components/Admin/EditStatusatt";
import Navbar from "./components/Client/layout";
import Home1 from "./components/Client/home1";
import Forbidden from "./components/403";
import Abonnementc from "./components/Client/abonnementc";
import Autorise from "./components/Client/Autorise";
import Prepaiement from "./components/Client/Prepaiement";
import Contactclient from "./components/Client/contactclient";
import Create_contactc from "./components/Client/createcontactc";
import Facturec from "./components/Client/factureclient";
import Edit_Contactc from "./components/Client/editcontact";
import AppHeader from "./components/AppHeader";

const { Content, Sider, Header } = Layout;

const ClientLayout = () => (
  <>
    <Navbar />
 
  </>
);

const AdminLayout = () => (
  <>
    <Navbar1 />
 
  </>
);

function AppContent() {
  const location = useLocation();
  return (
    <Layout style={{ height: '100vh' }}>
      {location.pathname !== '/Login' && <AppHeader />}
      <Layout style={{ padding: '0 0px ', backgroundColor: '#ffffff' }}>
        <Routes>
          <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>}>
            <Route path="" element={<Home />} />
            <Route path="compagnies" element={<Compagnies />} />
            <Route path="create" element={<Create_Compagnies />} />
            <Route path="Edit" element={<Edit_Compagnies />} />
            <Route path="Attestations" element={<Attestation />} />
            <Route path="createA" element={<Create_attestation />} />
            <Route path="EditA" element={<Edit_attestation />} />
            <Route path="Contact" element={<ContactPage />} />
            <Route path="Contactall" element={<Contact />} />
            <Route path="Facture" element={<Facture />} />
            <Route path="Abonnements" element={<Abonnements />} />
            <Route path="createAb" element={<Create_Abonnements />} />
            <Route path="EditAb" element={<Edit_Abonnements />} />
            <Route path="Nvtype" element={<Type_Abonnements />} />
            <Route path="createt" element={<Create_TypeAbonnements />} />
            <Route path="EditT" element={<Edit_typeAbonnements />} />
            <Route path="Editfo" element={<Edit_fonctions />} />
            <Route path="solde" element={<SoldePrepayes />} />
            <Route path="fonction" element={<Fonctions />} />
            <Route path="createFo" element={<Create_Fonctions />} />
            <Route path="contact/add/:compagnieId" element={<Create_contact />} />
            <Route path="contacte/:compagnieId" element={<Edit_Contact />} />
            <Route path="contacts/:compagnieId" element={<ContactList />} />
            <Route path="compa/:pointventeId" element={<Relation />} />
            <Route path="contacte" element={<EditContact />} />
            <Route path="Createcontact" element={<Createcontact />} />
            <Route path="Point" element={<Pointventes />} />
            <Route path="createP" element={<Create_Points />} />
            <Route path="EditP" element={<Edit_points />} />
            <Route path="compagnies/:pointventeId" element={<CompagnieList />} />
            <Route path="createc/:pointventeId" element={<CreateCompagnies />} />
            <Route path="Editc/:pointventeId" element={<EditCompagnies />} />
            <Route path="Type" element={<Types />} />
            <Route path="createty" element={<Create_Types />} />
            <Route path="Editty" element={<Edit_types />} />
            <Route path="Apercu/:compagnieId" element={<ViewUser />} />
            <Route path="factures/:compagnieId" element={<Factures />} />
            <Route path="ajouter-facture/:compagnieId" element={<AddFacture />} />
            <Route path="modifier-facture/:compagnieId" element={<EditFacture />} />
            <Route path="Agence" element={<Agences />} />
            <Route path="CreateAg" element={<Create_Agences />} />
            <Route path="EditAg" element={<Edit_Agences />} />
            <Route path="CreateSo" element={<Create_Soldes />} />
            <Route path="EditSo" element={<Edit_Soldes />} />
            <Route path="Offre" element={<Offres />} />
            <Route path="createof" element={<Create_Offres />} />
            <Route path="Editof" element={<Edit_offres />} />
            <Route path="viewAbonnement/:abonnementId" element={<ViewAbonnement />} />
            <Route path="viewSolde/:soldeId" element={<ViewSolde />} />
            <Route path="Statut" element={<StatusA />} />
            <Route path="StatutC" element={<StatusC />} />
            <Route path="createSt" element={<Create_StatutAs />} />
            <Route path="createStC" element={<Create_StatutC />} />
            <Route path="EditSt" element={<Edit_StatutAs />} />
            <Route path="EditStC" element={<Edit_StatutC />} />
            <Route path="Compte" element={<Compte />} />
            <Route path="CreateCompte" element={<Create_compte />} />
            <Route path="typeattestation" element={<Type_Attestations />} />
            <Route path="createtyp" element={<Create_TypeAttestations />} />
            <Route path="EditTyp" element={<Edit_typeAttestations />} />
            <Route path="Vehicule" element={<Vehicules />} />
            <Route path="Autorise" element={<AttestationsAutorisees />} />
            <Route path="Modele" element={<ModeleVehicules />} />
            <Route path="StatutA" element={<StatusAtt />} />
            <Route path="createStAtt" element={<Create_StatutAtt />} />
            <Route path="EditStA" element={<Edit_StatutAtt />} />
          </Route>
          <Route path="/client" element={<ProtectedRoute allowedRoles={['client-abonnement']}><ClientLayout /></ProtectedRoute>}>
            <Route path="" element={<Home1 />} />
            <Route path="Profil" element={<Profil />} />
            <Route path="Contactez" element={<ContactPage />} />
            <Route path="compagnies" element={<Compagnies />} />
            <Route path="abon" element={<Abonnementc />} />
            <Route path="autorises" element={<Autorise />} />
            <Route path="contact" element={<Contactclient />} />
            <Route path="prepaiement" element={<Prepaiement />} />
            <Route path="contact/add/:compagnieId" element={<Create_contactc />} />
            <Route path="facture" element={<Facturec />} />
            <Route path="contacte/:compagnieId" element={<Edit_Contactc />} />
          </Route>
          <Route path="/Login" element={<Login />} />
          <Route path="/403" element={<Forbidden />} />
          <Route path="*" element={<Navigate to='/Login' />} />
        </Routes>
        <Layout style={{ padding: '0 0px ', backgroundColor: '#ffffff' }}>
          
        </Layout>
      </Layout>
    </Layout>
  );
}

function App() {
  return (
    <KeycloakProvider>
      <Router>
        <AppContent />
      </Router>
    </KeycloakProvider>
  );
}

export default App;
