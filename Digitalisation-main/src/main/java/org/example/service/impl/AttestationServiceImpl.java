package org.example.service.impl;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.PdfWriter;
import jakarta.transaction.Transactional;
import org.example.entity.*;
import org.example.repository.*;
import org.example.service.AttestationService;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Service
public class AttestationServiceImpl implements AttestationService {

    private final AttestationRepository repo;
    @Autowired
    private AttestationsAutoriseesRepository attestationsAutoriseesRepository;

    @Autowired
    private Type_attestationRepository typeAttestationRepository;

    @Autowired
    private VehiculeRepository vehiculeRepository;

    @Autowired
    private Modele_VehiculeRepository modeleVehiculeRepository;

    @Autowired
    private SoldePrepayeRepository soldePrepayeRepository;

    @Autowired
    private HistoriqueStatutAttRepository historiqueStatutAttRepository;
    @Autowired
    private CompagnieRepository compagnieRepository;

    @Autowired
    private Statut_AttRepository statutAttRepository;
    @Autowired
    public AttestationServiceImpl(AttestationRepository repo) {
        this.repo = repo;
    }

    @Override
    public void saveorUpdate(Attestation attestations) {

        repo.save(attestations);
    }
    @Override
    public List<Attestation> listAll() {

        return this.repo.findAll();
    }

    @Override
    public void deleteAttestation(Long id) {

        repo.deleteById(id);
    }
    @Override
    public Attestation getAttestationByID(Long attestationid) {

        return repo.findById(attestationid).get();
    }

    @Transactional
    @Override
    public byte[] genererAttestation(String json) throws IOException, DocumentException {
        // Parsing du fichier JSON
        JSONObject jsonObject = new JSONObject(json);
        String raisonSocial = jsonObject.getString("raison_social");
        JSONArray attestationsDemandes = jsonObject.getJSONArray("attestations");

        // Recherche de la compagnie par raison sociale
        Compagnie compagnie = compagnieRepository.findCompagniesByRaisonSocial(raisonSocial)
                .orElseThrow(() -> new IllegalArgumentException("Compagnie non trouvée"));

        // Vérification des types d'attestations autorisées et calcul du total des prix
        BigDecimal totalPrix = BigDecimal.ZERO;
        for (int i = 0; i < attestationsDemandes.length(); i++) {
            JSONObject attestationJson = attestationsDemandes.getJSONObject(i);
            Long typeAttestationId = attestationJson.getLong("type_attestation_id");
            Type_attestation typeAttestation = typeAttestationRepository.findById(typeAttestationId)
                    .orElseThrow(() -> new IllegalArgumentException("Type d'attestation non trouvé"));

            AttestationsAutoriseesKey key = new AttestationsAutoriseesKey(compagnie.getId(), typeAttestationId);
            AttestationsAutorisees autorisation = attestationsAutoriseesRepository.findById(key)
                    .orElseThrow(() -> new IllegalArgumentException("Type d'attestation non autorisé pour cette compagnie"));

            if (!autorisation.isFlag()) {
                throw new IllegalArgumentException("Type d'attestation non autorisé");
            }

            totalPrix = totalPrix.add(typeAttestation.getPrix_unitaire());
        }

        // Vérification du solde de la compagnie si non abonnée
        if (compagnie.getAbonnements().isEmpty()) {
            BigDecimal soldeCompagnie = compagnie.getSoldeCompagnie();
            if (soldeCompagnie == null || soldeCompagnie.compareTo(totalPrix) < 0) {
                throw new IllegalArgumentException("Solde insuffisant");
            }
        }

        // Récupération du statut "En cours"
        Statut_Att statutEnCours = statutAttRepository.findByLibelles("En cours")
                .orElseThrow(() -> new IllegalArgumentException("Statut 'En cours' non trouvé"));

        // Gestion des véhicules et génération des attestations
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        for (int i = 0; i < attestationsDemandes.length(); i++) {
            JSONObject attestationJson = attestationsDemandes.getJSONObject(i);
            String immatriculation = attestationJson.getString("immatriculation");
            Long typeAttestationId = attestationJson.getLong("type_attestation_id");
            LocalDate dateImmatriculation = LocalDate.parse(attestationJson.getString("date_immatriculation"), DateTimeFormatter.ISO_DATE);

            // Récupération ou création du modèle de véhicule
            Modele_Vehicule modeleVehicule = new Modele_Vehicule();
            modeleVehicule.setDesignation(attestationJson.getString("modele_designation"));
            modeleVehicule.setType(attestationJson.getString("modele_type"));
            modeleVehicule.setMarque(attestationJson.getString("modele_marque"));
            modeleVehicule.setAnnee(attestationJson.getInt("modele_annee"));
            modeleVehicule.setPuissanceFiscale(attestationJson.getDouble("modele_puissance_fiscale"));
            modeleVehicule.setCarburant(attestationJson.getString("modele_carburant"));


            Modele_Vehicule existingModele = modeleVehiculeRepository.findByDesignationAndMarqueAndTypeAndAnnee(
                    modeleVehicule.getDesignation(),
                    modeleVehicule.getMarque(),
                    modeleVehicule.getType(),
                    modeleVehicule.getAnnee()
            ).orElse(null);

            if (existingModele == null) {
                existingModele = modeleVehiculeRepository.save(modeleVehicule);
            }

            // Récupération ou création du véhicule
            Vehicule vehicule = vehiculeRepository.findByImmatriculation(immatriculation).orElse(null);
            if (vehicule == null) {
                vehicule = new Vehicule();
                vehicule.setImmatriculation(immatriculation);
                vehicule.setDate_Immatriculation(dateImmatriculation);
                vehicule.setModeleVehicule(existingModele);
                vehiculeRepository.save(vehicule);
            } else {
                List<Attestation> anciennesAttestations = repo.findByVehicule(vehicule);
                boolean enCours = anciennesAttestations.stream()
                        .anyMatch(a -> {
                            List<HistoriqueStatutAtt> historiques = historiqueStatutAttRepository.findHistoriqueStatutAttByAttestationOrderByDateStatutDesc(a);
                            return !historiques.isEmpty() && "En cours".equals(historiques.get(0).getStatut());
                        });

                if (enCours) {
                    throw new IllegalArgumentException("Une attestation est déjà en cours pour ce véhicule");
                }

                vehicule.setModeleVehicule(existingModele);
                vehiculeRepository.save(vehicule);
            }

            // Génération de l'attestation
            Attestation attestation = new Attestation();
            attestation.setVehicule(vehicule);
            attestation.setOwnertat(typeAttestationRepository.findById(typeAttestationId).orElseThrow(() -> new IllegalArgumentException("Type d'attestation non trouvé")));
            attestation.setDate_Generation(LocalDate.now());
            attestation.setOwnerat(compagnie);

            // Génération du fichier PDF
            try {
                byte[] pdfData = generatePDF(vehicule, compagnie, attestation.getOwnertat());
                attestation.setNomFichier(vehicule.getImmatriculation() + "_attestation.pdf");
                attestation.setFichierData(pdfData);
                baos.write(pdfData);
            } catch (IOException | DocumentException e) {
                throw new RuntimeException("Erreur lors de la génération du PDF", e);
            }

            repo.save(attestation);

            // Mise à jour des historiques
            HistoriqueStatutAtt historique = new HistoriqueStatutAtt();
            historique.setAttestation(attestation);
            historique.setStatut("En cours");
            historique.setDateStatut(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
            historique.setStatutAtt(statutEnCours); // Associer l'ID du statut "En cours"
            historiqueStatutAttRepository.save(historique);
        }

        // Mise à jour du solde de la compagnie seulement si non abonnée
        if (compagnie.getAbonnements().isEmpty()) {
            BigDecimal soldeCompagnie = compagnie.getSoldeCompagnie();
            if (soldeCompagnie != null) {
                compagnie.setSoldeCompagnie(soldeCompagnie.subtract(totalPrix));
                compagnieRepository.save(compagnie);
            }
        }

        return baos.toByteArray();
    }

    private byte[] generatePDF(Vehicule vehicule, Compagnie compagnie, Type_attestation typeAttestation) throws DocumentException, IOException {
        Document document = new Document();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();
        // Add the logo
        Image logo = Image.getInstance("src/main/resources/static/images/orsys.png");
        logo.scaleToFit(150, 50);
        document.add(logo);
        // Add the title
        Paragraph title = new Paragraph("Attestation Automobile", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18));
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        // Add the content

        document.add(new Paragraph("Compagnie: " + compagnie.getRaisonSocial()));
        document.add(new Paragraph("Adresse: " + compagnie.getAdresse()));
        document.add(new Paragraph("Email: " + compagnie.getEmail()));
        document.add(new Paragraph("Téléphone: " + compagnie.getTelephone()));
        document.add(new Paragraph("Véhicule: " + vehicule.getImmatriculation()));
        document.add(new Paragraph("Modèle: " + (vehicule.getModeleVehicule() != null ? vehicule.getModeleVehicule().getDesignation() : "Inconnu")));
        document.add(new Paragraph("Type d'attestation: " + typeAttestation.getLibelle()));
        document.add(new Paragraph("Prix unitaire: " + typeAttestation.getPrix_unitaire() + " " + typeAttestation.getDevise()));
        document.close();
        return baos.toByteArray();
    }

    @Override
    public List<Attestation> getAttestationsByCompanyId(Long companyId) {
        return repo.findByOwneratId(companyId); // Ajout de l'implémentation
    }



    @Scheduled(cron ="0 0 0 * * ?")
    @Transactional
    public void verifierEtAjouterHistorique(){
        LocalDate today = LocalDate.now();
        List<Attestation> attestations = repo.findByDateFin(today);
        Statut_Att statutfin= statutAttRepository.findByLibelles("Términée").orElseThrow(() -> new IllegalArgumentException("Statut 'Terminee' non trouvé"));
        for(Attestation attestation : attestations){
            HistoriqueStatutAtt historique = new HistoriqueStatutAtt();
            historique.setAttestation(attestation);
            historique.setDateStatut(today.toString());
            historique.setStatut("Terminée");
            historique.setStatutAtt(statutfin);
            historiqueStatutAttRepository.save(historique);
        }
    }

    @Override
    @Transactional
    public Attestation modifierAttestation(String json) {
        JSONObject jsonObject = new JSONObject(json);
        Long attestationId = jsonObject.getLong("id_attestation");
        Optional<Attestation> attestationOpt = repo.findById(attestationId);

        if (!attestationOpt.isPresent()) {
            throw new IllegalArgumentException("Attestation non trouvée");
        }

        Attestation attestation = attestationOpt.get();
        boolean isDateChanged = false;

        if (jsonObject.has("date_Debut")) {
            LocalDate newDateDebut = LocalDate.parse(jsonObject.getString("date_Debut"), DateTimeFormatter.ISO_DATE);
            if (!newDateDebut.equals(attestation.getDate_Debut())) {
                isDateChanged = true;
                attestation.setDate_Debut(newDateDebut);
            }
        }

        if (jsonObject.has("date_Fin")) {
            LocalDate newDateFin = LocalDate.parse(jsonObject.getString("date_Fin"), DateTimeFormatter.ISO_DATE);
            if (!newDateFin.equals(attestation.getDateFin())) {
                isDateChanged = true;
                attestation.setDateFin(newDateFin);
            }
        }

        if (isDateChanged) {
            ajouterHistoriqueStatut(attestation, "Prolonge");
        }

        if (jsonObject.has("vehicule")) {
            JSONObject vehiculeJson = jsonObject.getJSONObject("vehicule");
            Vehicule vehicule = attestation.getVehicule();

            if (vehiculeJson.has("immatriculation")) {
                vehicule.setImmatriculation(vehiculeJson.getString("immatriculation"));
            }

            if (vehiculeJson.has("date_Immatriculation")) {
                LocalDate dateImmatriculation = LocalDate.parse(vehiculeJson.getString("date_Immatriculation"), DateTimeFormatter.ISO_DATE);
                vehicule.setDate_Immatriculation(dateImmatriculation);
            }

            if (vehiculeJson.has("modeleVehicule")) {
                JSONObject modeleJson = vehiculeJson.getJSONObject("modeleVehicule");
                Modele_Vehicule modele = vehicule.getModeleVehicule();
                if (modeleJson.has("designation")) {
                    modele.setDesignation(modeleJson.getString("designation"));
                }
                if (modeleJson.has("type")) {
                    modele.setType(modeleJson.getString("type"));
                }
                if (modeleJson.has("marque")) {
                    modele.setMarque(modeleJson.getString("marque"));
                }
                if (modeleJson.has("annee")) {
                    modele.setAnnee(modeleJson.getInt("annee"));
                }
                if (modeleJson.has("puissanceFiscale")) {
                    modele.setPuissanceFiscale(modeleJson.getDouble("puissanceFiscale"));
                }
                if (modeleJson.has("carburant")) {
                    modele.setCarburant(modeleJson.getString("carburant"));
                }
                modeleVehiculeRepository.save(modele);
            }
            vehiculeRepository.save(vehicule);
        }

        repo.save(attestation);
        return attestation;
    }

    private void ajouterHistoriqueStatut(Attestation attestation, String statutLibelle) {
        Statut_Att statut = statutAttRepository.findByLibelles(statutLibelle)
                .orElseThrow(() -> new IllegalArgumentException("Statut '" + statutLibelle + "' non trouvé"));

        HistoriqueStatutAtt historique = new HistoriqueStatutAtt();
        historique.setAttestation(attestation);
        historique.setStatut(statutLibelle);
        historique.setDateStatut(LocalDate.now().toString());
        historique.setStatutAtt(statut);

        historiqueStatutAttRepository.save(historique);
    }

    @Transactional
    @Override
    public byte[] generatePDF(Attestation attestation) throws DocumentException, IOException {
        Vehicule vehicule = attestation.getVehicule();
        Compagnie compagnie = attestation.getOwnerat();
        Type_attestation typeAttestation = attestation.getOwnertat();

        Document document = new Document();
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();

        // Add the logo
        Image logo = Image.getInstance("src/main/resources/static/images/orsys.png");
        logo.scaleToFit(150, 50);
        document.add(logo);

        // Add the title
        Paragraph title = new Paragraph("Attestation Automobile", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18));
        title.setAlignment(Paragraph.ALIGN_CENTER);
        document.add(title);

        // Add the content
        document.add(new Paragraph("Compagnie: " + compagnie.getRaisonSocial()));
        document.add(new Paragraph("Adresse: " + compagnie.getAdresse()));
        document.add(new Paragraph("Email: " + compagnie.getEmail()));
        document.add(new Paragraph("Téléphone: " + compagnie.getTelephone()));
        document.add(new Paragraph("Véhicule: " + vehicule.getImmatriculation()));
        document.add(new Paragraph("Modèle: " + (vehicule.getModeleVehicule() != null ? vehicule.getModeleVehicule().getDesignation() : "Inconnu")));
        document.add(new Paragraph("Type d'attestation: " + typeAttestation.getLibelle()));
        document.add(new Paragraph("Prix unitaire: " + typeAttestation.getPrix_unitaire() + " " + typeAttestation.getDevise()));

        document.close();
        return baos.toByteArray();
    }
}


