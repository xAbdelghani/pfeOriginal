package org.example.service.impl;

import jakarta.persistence.EntityNotFoundException;
import org.apache.commons.lang3.RandomStringUtils;
import org.example.Dto.*;
import org.example.entity.*;
import org.example.repository.*;
import org.example.security.KeycloakSecurityUtil;
import org.example.service.CompagnieService;
import org.example.service.EmailService;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.ResourceNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import jakarta.ws.rs.core.Response;
import java.util.Collections;
import java.util.Map;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.RoleRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
@Service
public class CompagnieServiceImpl implements CompagnieService {

    @Autowired
    private CompagnieRepository repo;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private PointventeRepository pointventeRepo;

    @Autowired
    private CompagniePointVenteRepository compagniePointVenteRepository;
    @Autowired
    private Type_attestationRepository type_attestationRepository;
    @Autowired
    private AttestationsAutoriseesRepository attestationsAutoriseesRepository;


    @Autowired
    private KeycloakSecurityUtil keycloakSecurityUtil;
    public void saveorUpdate(Compagnie compagnies) {

        Compagnie compagnie= repo.save(compagnies);
        List<Type_attestation> typeAttestations= type_attestationRepository.findAll();
        for (Type_attestation typeAttestation : typeAttestations) {
            AttestationsAutoriseesKey key = new AttestationsAutoriseesKey(compagnie.getId(), typeAttestation.getId());
            if (!attestationsAutoriseesRepository.existsById(key)) {
                AttestationsAutorisees attestationsAutorisees = new AttestationsAutorisees();
                attestationsAutorisees.setId(key);
                attestationsAutorisees.setOwneratau(compagnie);
                attestationsAutorisees.setOwnertatau(typeAttestation);
                attestationsAutorisees.setFlag(false);
                attestationsAutoriseesRepository.save(attestationsAutorisees);
            }
        }}

   public void Update(Compagnie compagnies) {

        repo.save(compagnies);

    }

    public void updateLoginAndGeneratePassword(Long compagnieId, String nom) {
        Compagnie compagnie = repo.findById(compagnieId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid compagnie Id: " + compagnieId));

        // Générer un nouveau mot de passe
        String generatedPassword = RandomStringUtils.randomAlphanumeric(10);

        // Encoder le mot de passe avant de le sauvegarder
        String encodedPassword = passwordEncoder.encode(generatedPassword);

        // Mettre à jour le login et le mot de passe de la compagnie
        compagnie.setNom(nom);
        compagnie.setPassword(encodedPassword);

        // Sauvegarder les modifications
        repo.save(compagnie);

        // Envoyer le nouveau mot de passe par email
        emailService.sendEmail(compagnie.getEmail(), "Votre nouveau mot de passe", "Votre nouveau mot de passe est : " + generatedPassword);
        updateKeycloakUser(compagnie, generatedPassword);
    }
    private void updateKeycloakUser(Compagnie compagnie, String password) {
        Keycloak keycloak = keycloakSecurityUtil.getKeycloakInstance();
        UsersResource usersResource = keycloak.realm(keycloakSecurityUtil.getRealm()).users();
        List<UserRepresentation> existingUsers = usersResource.search(compagnie.getNom());
        String userId;

        if (existingUsers.isEmpty()) {
            UserRepresentation user = new UserRepresentation();
            user.setUsername(compagnie.getNom());
            user.setEmail(compagnie.getEmail());
            user.setEnabled(true);
            user.setEmailVerified(true);

            Response response = usersResource.create(user);
            userId = CreatedResponseUtil.getCreatedId(response);
        } else {
            userId = existingUsers.get(0).getId();
        }

        CredentialRepresentation passwordCredential = new CredentialRepresentation();
        passwordCredential.setTemporary(false);
        passwordCredential.setType(CredentialRepresentation.PASSWORD);
        passwordCredential.setValue(password);
        usersResource.get(userId).resetPassword(passwordCredential);

        assignKeycloakRoles(keycloak, userId, compagnie);
    }


    /*private void assignKeycloakRoles(Keycloak keycloak, String userId, Compagnie compagnie) {
        UsersResource usersResource = keycloak.realm(keycloakSecurityUtil.getRealm()).users();

        if (compagnie.getAbonnements() != null && !compagnie.getAbonnements().isEmpty()) {
            RoleRepresentation role = keycloak.realm(keycloakSecurityUtil.getRealm()).roles().get("client-abonnement").toRepresentation();
            usersResource.get(userId).roles().realmLevel().add(Collections.singletonList(role));
        }

        if (compagnie.getSoldePrepayes() != null && !compagnie.getSoldePrepayes().isEmpty()) {
            RoleRepresentation role = keycloak.realm(keycloakSecurityUtil.getRealm()).roles().get("client-prepaiement").toRepresentation();
            usersResource.get(userId).roles().realmLevel().add(Collections.singletonList(role));
        }
    }*/
    private void assignKeycloakRoles(Keycloak keycloak, String userId, Compagnie compagnie) {
        UsersResource usersResource = keycloak.realm(keycloakSecurityUtil.getRealm()).users();

       // if (compagnie.getAbonnements() != null && !compagnie.getAbonnements().isEmpty()) {
            RoleRepresentation role = keycloak.realm(keycloakSecurityUtil.getRealm()).roles().get("client-abonnement").toRepresentation();
            usersResource.get(userId).roles().realmLevel().add(Collections.singletonList(role));
    }

    public List<Compagnie> listAll() {

        return this.repo.findAll();
    }


    public void deleteCompagnie(Long id) {

        repo.deleteById(id);
    }

    public Compagnie getCompagnieByID(Long compagnieid) {

        return repo.findById(compagnieid).get();
    }

    public List<CompagnieDto> getCompagniesWithNonNullNom() {
        List<Compagnie> compagnies = repo.findByNomIsNotNull();
        return compagnies.stream().map(CompagnieDto::toDto).collect(Collectors.toList());
    }


    @Override
    public CompagnieDto updateCompagniee(Long compagnieId, CompagnieDto updatedCompagnieDto) {
        Optional<Compagnie> existingCompagnieOptional = repo.findById(compagnieId);
        if (existingCompagnieOptional.isPresent()) {
            Compagnie existingCompagnie = existingCompagnieOptional.get();

            // Mise à jour des champs de la compagnie existante avec les valeurs fournies dans updatedCompagnieDto
            existingCompagnie.setNom(updatedCompagnieDto.getNom());
            existingCompagnie.setRaisonSocial(updatedCompagnieDto.getRaison_social());
            existingCompagnie.setAdresse(updatedCompagnieDto.getAdresse());
            existingCompagnie.setTelephone(updatedCompagnieDto.getTelephone());
            existingCompagnie.setEmail(updatedCompagnieDto.getEmail());
            existingCompagnie.setStatut(updatedCompagnieDto.getStatut());
            existingCompagnie.setPassword(updatedCompagnieDto.getPassword());

            // Mise à jour des collections associées (abonnement, agence, etc.)
            // Cela dépend de la structure de votre modèle et de votre logique métier
            existingCompagnie.getContacts().clear();
            for (ContactDto contactDto : updatedCompagnieDto.getContactDto()) {
                existingCompagnie.getContacts().add(ContactDto.convertContactDtoToEntity(contactDto));
            }




            existingCompagnie.getAgences().clear();
            for (AgenceDto agenceDto : updatedCompagnieDto.getAgenceDto()) {
                existingCompagnie.getAgences().add(AgenceDto.convertAgenceDtoToEntity(agenceDto));
            }

            existingCompagnie.getAbonnements().clear();
            for (AbonnementDto abonnementDto : updatedCompagnieDto.getAbonnement()) {
                existingCompagnie.getAbonnements().add(AbonnementDto.convertAbonnementDtoToEntity(abonnementDto));
            }
            existingCompagnie.getSoldePrepayes().clear();
            for (SoldePrepayeDto soldePrepayeDto : updatedCompagnieDto.getSoldePrepayeDto()) {
                existingCompagnie.getSoldePrepayes().add(SoldePrepayeDto.convertSoldeprepayeDtoToEntity(soldePrepayeDto));
            }

            // Enregistrement de la compagnie mise à jour dans la base de données
            Compagnie savedCompagnie = repo.save(existingCompagnie);

            // Conversion de l'entité Compagnie en DTO pour renvoyer la réponse
            return CompagnieDto.toDto(savedCompagnie);
        } else {
            // Si la compagnie avec l'ID donné n'est pas trouvée, on lance une exception
            throw new EntityNotFoundException("Compagnie not found with id: " + compagnieId);
        }
    }
@Override
    public void transferLoginAndPasswordToNull(Long compagnieId) {
        Compagnie compagnie = repo.findById(compagnieId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid compagnie Id: " + compagnieId));

        compagnie.setNom(null);
        compagnie.setPassword(null);

        repo.save(compagnie);
    }
    @Override
    public void updateCompagnie(Long compagnieId, Long pointventeId, LocalDate dateDebut, LocalDate dateFin) {
        Compagnie compagnie = repo.findById(compagnieId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid compagnie Id: " + compagnieId));
        Pointvente pointvente = pointventeRepo.findById(pointventeId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid pointvente Id: " + pointventeId));

        List<RelationPointventeCompagnie> relations = compagniePointVenteRepository.findByCompagnieAndPointvente(compagnie, pointvente);
        if (!relations.isEmpty()) {
            RelationPointventeCompagnie relation = relations.get(0);
            relation.setDateDebut(dateDebut);
            relation.setDateFin(dateFin);
            compagniePointVenteRepository.save(relation);
        } else {
            RelationPointventeCompagnie newRelation = new RelationPointventeCompagnie();
            newRelation.setCompagnie(compagnie);
            newRelation.setPointvente(pointvente);
            newRelation.setDateDebut(dateDebut);
            newRelation.setDateFin(dateFin);
            compagniePointVenteRepository.save(newRelation);
        }
    }


@Override
    public List<CompagnieDto> getCompagniesWithNullNom() {
        List<Compagnie> compagnies = repo.findByNomIsNull();
        return compagnies.stream().map(CompagnieDto::toDto).collect(Collectors.toList());
    }

@Override
public Optional<Compagnie> findCompagnieByEmail(String email) {
    return repo.findByEmail(email);
}
    @Override
    public Long findCompagnieIdByEmail(String email) {
        return repo.findIdByEmail(email);
    }
}
