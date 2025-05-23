package org.example.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.text.Format;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "Attestation")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Attestation {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(name = "date_Generation")
    private LocalDate date_Generation;

    @Column(name = "date_Debut")
    private LocalDate date_Debut;

    @Column(name = "date_Fin")
    private LocalDate dateFin;

    @Column(name = "QR_Code")
    private String qrCode;

    @Column(name = "Référence_Flotte", nullable = true)
    private String referenceFlotte;

    @Column(name = "Reste_Attributs_JSON", columnDefinition = "TEXT")
    private String resteAttributsJson;
    @Column(name = "Chemin_Dépôt_Attestation_Générée", nullable = true)
    private String cheminDepotAttestationGeneree;
    @Column(name = "nom_Fichier")
    private String nomFichier;

    @Lob
    @Column(name = "fichier_Data")
    private byte[] fichierData;

    /*@Column(name = "prix")
    private Double prix;

    @Column(name = "statut")
    private String statut;*/

    @ManyToOne
    @JoinColumn(name = "compagnie_id")
    private Compagnie ownerat;

    @ManyToOne
    @JoinColumn(name = "typeattestation_id")
    private Type_attestation ownertat;

    @ManyToOne
    @JoinColumn(name = "vehicule_id")
    private Vehicule vehicule;

    @ManyToOne
    @JoinColumn(name = "facture_id")
    private Facture facture;

    @OneToMany(mappedBy = "attestation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HistoriqueStatutAtt> historiqueStatutAtts = new ArrayList<>();

}
