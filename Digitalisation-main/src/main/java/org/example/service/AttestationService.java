package org.example.service;

import com.itextpdf.text.DocumentException;
import org.example.entity.Attestation;
import org.example.entity.Compagnie;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public interface AttestationService {
    void saveorUpdate(Attestation attestations);

    List<Attestation> listAll();

    void deleteAttestation(Long id);

    Attestation getAttestationByID(Long attestationid);
    //void genererAttestation(String json);
    byte[] genererAttestation(String json)throws IOException, DocumentException;
    List<Attestation> getAttestationsByCompanyId(Long companyId);

   // void verifierEtAjouterHistorique();
   Attestation modifierAttestation(String json);
    byte[] generatePDF(Attestation attestation) throws DocumentException, IOException;

}
