import React from 'react';
import { Breadcrumb } from 'antd';
import { Link, useLocation } from 'react-router-dom';

const breadcrumbNameMap = {
  '/admin/create': 'Créer Compagnie',
  '/admin/Edit': 'Modifier Compagnie',
  '/admin/Attestations': 'Attestations',
  '/admin/createA': 'Créer Attestation',
  '/admin/EditA': 'Modifier Attestation',
  '/admin/Contact': 'Contact',
  '/admin/Contactall': 'Tous les Contacts',
  '/admin/Createcontact': 'Créer Contact',
  '/admin/Facture': 'Facture',
  '/admin/Profil': 'Profil',
  '/admin/Abonnements': 'Abonnements',
  '/admin/createAb': 'Créer Abonnement',
  '/admin/EditAb': 'Modifier Abonnement',
  '/admin/Nvtype': 'Types d\'Abonnement',
  '/admin/createt': 'Créer Type Abonnement',
  '/admin/EditT': 'Modifier Type Abonnement',
  '/admin/EditFo': 'Modifier Fonction',
  '/admin/solde': 'Prépaiements',
  '/admin/fonction': 'Fonctions',
  '/admin/createfo': 'Créer Fonction',
  '/admin/contact/add/:compagnieId': 'Ajouter Contact',
  '/admin/contacte': 'Modifier Contact',

  '/admin/Point': 'Courtiers',
  '/admin/createP': 'Créer un Courtier',
  '/admin/EditP': 'Modifier un Courtier',
  '/admin/compagnies': 'Compagnies',
  '/admin/createc': 'Créer Compagnie',
  '/admin/Editc': 'Modifier Compagnie',
  '/admin/Type': 'Types',
  '/admin/createty': 'Créer Type',
  '/admin/Editty': 'Modifier Type',
 
  '/admin/ajouter-facture': 'Ajouter Facture',
  '/admin/modifier-facture': 'Modifier Facture',
  '/admin/Agence': 'Agences',
  '/admin/createAg': 'Créer Agence',
  '/admin/EditAg': 'Modifier Agence',
  '/admin/createSo': 'Créer Solde',
  '/admin/EditSo': 'Modifier Solde',
  '/admin/Offre': 'Offres',
  '/admin/createof': 'Créer Offre',
  '/admin/Editof': 'Modifier Offre',
  '/admin/Compte': 'Liste de Login',
  '/admin/Abonnements/viewSolde': 'Voir Prépaiement',
  '/admin/Statut': 'Statut',
  '/admin/StatutC': 'Statut Courtier',
  '/admin/StatutA': 'Statut Attestation',
  '/admin/createSt': 'Créer Statut',
  '/admin/EditSt': 'Modifier Statut',
  '/admin/createStC': 'Créer Statut',
  '/admin/EditStC': 'Modifier Statut',
  '/admin/Abonnements/viewAbonnement': 'Voir Abonnement',
  '/admin/compagnies/Apercu': 'Apercu',
  '/admin/compagnies/contacts': 'Liste des Contacts',
  '/admin/CreateCompte': 'Créer Compte',
  '/admin/compagnies/factures': 'Factures',

  '/admin/typeattestation': 'Types d\'Attestations',
  '/admin/createtyp': 'Créer Type Attestation',
  '/admin/EditTyp': 'Modifier Type Attestation',

  '/admin/Vehicule': 'Liste des Vehicules',
  '/admin/Modele': 'Liste des Modèles de Vehicules',
  '/admin/Autorise': 'Autorisation des types attestations',
  '/client/Profil':'Profil Compagnie',
  '/client/Contact':'Contact',
  '/client/Contactez':'Contactez-vouz',
  '/client/abon':'Abonnements',
  '/client/prepaiement':'Prepaiments',
  '/client/autorises':'Attestations Disponibles',
  '/client/facture':'Factures',
  '/client/contact/add/:compagnieId':'Ajouter contact',
  '/client/contacte/:compagnieId':'Mise à jour  contact'
};

const Breadcrumbs = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);

  const breadcrumbItems = [
    <Breadcrumb.Item key="home" style={{ backgroundColor: '#ffffff' }}>
      <Link to="/admin" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '14px', textDecoration: 'none' }}><strong>Gestion digitalisée des attestations automobiles</strong></Link>
    </Breadcrumb.Item>,
  ];

  pathSnippets.forEach((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    const breadcrumbLabel = breadcrumbNameMap[url];
    if (breadcrumbLabel) {
      breadcrumbItems.push(
        <Breadcrumb.Item key={url}>
          <Link to={url} style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '14px', textDecoration: 'none' }}>
          <strong>
            {breadcrumbLabel}</strong>
          </Link>
        </Breadcrumb.Item>
      );
    } else if (url === '/admin/Apercu') {
      breadcrumbItems.push(
        <Breadcrumb.Item key="/admin/compagnies">
          <Link to="/admin/compagnies" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '14px', textDecoration: 'none' }}>
          <strong>
            Compagnies</strong>
          </Link>
        </Breadcrumb.Item>
      );
      breadcrumbItems.push(
        <Breadcrumb.Item key={url}>
          <Link to={url} style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '14px', textDecoration: 'none' }}>
          <strong>
            Apercu</strong>
          </Link>
        </Breadcrumb.Item>
      );
    } else if (url === '/admin/viewAbonnement') {
      breadcrumbItems.push(
        <Breadcrumb.Item key="/admin/Abonnements">
          <Link to="/admin/Abonnements" style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px', textDecoration: 'none' }}>
          <strong>
            Abonnements</strong>
          </Link>
        </Breadcrumb.Item>
      );
      breadcrumbItems.push(
        <Breadcrumb.Item key={url}>
          <Link to={url} style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '14px', textDecoration: 'none' }}>
          <strong>
            Voir Abonnement</strong>
          </Link>
        </Breadcrumb.Item>
      );
    } else if (url === '/admin/viewSolde') {
      breadcrumbItems.push(
        <Breadcrumb.Item key="/admin/solde">
          <Link to="/admin/solde" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '14px', textDecoration: 'none' }}>
          <strong>
            Prépaiements</strong>
          </Link>
        </Breadcrumb.Item>
      );
      breadcrumbItems.push(
        <Breadcrumb.Item key={url}>
          <Link to={url} style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px', textDecoration: 'none' }}>
          <strong>
            Voir Prépaiement
            </strong>
          </Link>
        </Breadcrumb.Item>
      );
    }else if (url === '/admin/contacts') {
      breadcrumbItems.push(
        <Breadcrumb.Item key="/admin/compagnies">
          <Link to="/admin/compagnies" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '14px', textDecoration: 'none' }}>
          <strong>
            Compagnies  </strong>
          </Link>
        </Breadcrumb.Item>
      );
      breadcrumbItems.push(
        <Breadcrumb.Item key={url}>
          <Link to={url} style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '14px', textDecoration: 'none' }}>
          <strong>
          Liste des Contacts   </strong>
          </Link>
        </Breadcrumb.Item>
      );
    }else if (url === '/admin/factures') {
      breadcrumbItems.push(
        <Breadcrumb.Item key="/admin/compagnies">
          <Link to="/admin/compagnies" style={{ color: 'rgba(0, 0, 0, 0.5)', fontSize: '14px', textDecoration: 'none' }}>
            <strong> Compagnies  </strong>
          </Link>
        </Breadcrumb.Item>
      );
      breadcrumbItems.push(
        <Breadcrumb.Item key={url}>
          <Link to={url} style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '14px', textDecoration: 'none' }}>
          <strong>Liste des Factures   </strong>
          </Link>
        </Breadcrumb.Item>
      );
    }
  });

  return (
    <Breadcrumb separator=">">
      {breadcrumbItems}
    </Breadcrumb>
  );
};

export default Breadcrumbs;
