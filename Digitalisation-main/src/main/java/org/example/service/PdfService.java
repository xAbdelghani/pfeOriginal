package org.example.service;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.example.Dto.CompagnieDto;
import org.example.Dto.FactureDto;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

@Service
public class PdfService {

    public ByteArrayResource generatePdf(FactureDto factureDto) throws DocumentException, IOException {
        // Ajuster les marges du document
        Document document = new Document(PageSize.A4, 36, 36, 50, 50);
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        PdfWriter writer = PdfWriter.getInstance(document, out);
        HeaderFooterPageEvent event = new HeaderFooterPageEvent();
        writer.setPageEvent(event);

        document.open();

        // Ajout de styles
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18, BaseColor.BLACK);
        Font boldFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK);
        Font normalFont = FontFactory.getFont(FontFactory.HELVETICA, 12, BaseColor.BLACK);

        // Titre de la facture
        Paragraph title = new Paragraph("Facture", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);

        // Saut de ligne
        document.add(Chunk.NEWLINE);

        // Tableau des détails de la facture
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{1, 3});  // Augmenter la proportion pour la deuxième colonne
        table.setSpacingBefore(10f);
        table.setSpacingAfter(10f);

        // Ajouter des cellules avec un padding plus grand
        addCell(table, "RaisonSocial:", boldFont, 10);
        addCell(table, factureDto.getRaison_social(), normalFont, 10);

//        addCell(table, "Login:", boldFont, 10);
//        addCell(table, factureDto.getNom(), normalFont, 10);

        addCell(table, "Email:", boldFont, 10);
        addCell(table, factureDto.getEmail(), normalFont, 10);

        addCell(table, "Téléphone:", boldFont, 10);
        addCell(table, factureDto.getTelephone(), normalFont, 10);

        addCell(table, "Adresse:", boldFont, 10);
        addCell(table, factureDto.getAdresse(), normalFont, 10);

        addCell(table, "Date:", boldFont, 10);
        addCell(table, factureDto.getDate_Debutt().toString(), normalFont, 10);

        addCell(table, "Type:", boldFont, 10);
        addCell(table, factureDto.getTypeF(), normalFont, 10);

        addCell(table, "Taxe:", boldFont, 10);
        addCell(table, factureDto.getTaxe().toString(), normalFont, 10);

        addCell(table, "Prime:", boldFont, 10);
        addCell(table, factureDto.getPrime().toString(), normalFont, 10);

        addCell(table, "Date Echeance:", boldFont, 10);
        addCell(table, factureDto.getDate_Echeance().toString(), normalFont, 10);

        addCell(table, "Date Reglement:", boldFont, 10);
        addCell(table, factureDto.getDate_Reglement().toString(), normalFont, 10);

        addCell(table, "Statut:", boldFont, 10);
        addCell(table, factureDto.getStatut(), normalFont, 10);

        document.add(table);

        document.close();

        return new ByteArrayResource(out.toByteArray());
    }

    private void addCell(PdfPTable table, String text, Font font, float padding) {
        PdfPCell cell = new PdfPCell(new Phrase(text, font));
        cell.setBorderWidth(1);
        cell.setPadding(padding);  // Ajuster le padding des cellules
        table.addCell(cell);
    }

    class HeaderFooterPageEvent extends PdfPageEventHelper {

        private Image logo;

        public HeaderFooterPageEvent() {
            try {
                // Chargez l'image du logo
                logo = Image.getInstance("src/main/resources/static/images/orsys.png");
                logo.scaleToFit(100, 50); // Ajustez la taille du logo si nécessaire
                logo.setAlignment(Element.ALIGN_CENTER);
            } catch (BadElementException | IOException e) {
                e.printStackTrace();
            }
        }

        @Override
        public void onStartPage(PdfWriter writer, Document document) {
            PdfPTable header = new PdfPTable(1);
            try {
                header.setWidths(new int[]{24});
                header.setTotalWidth(527);
                header.setLockedWidth(true);
                header.getDefaultCell().setFixedHeight(40);
                header.getDefaultCell().setBorder(Rectangle.BOTTOM);
                header.getDefaultCell().setHorizontalAlignment(Element.ALIGN_CENTER);
                header.addCell(logo);
                document.add(header);
            } catch (DocumentException de) {
                throw new ExceptionConverter(de);
            }
        }

        @Override
        public void onEndPage(PdfWriter writer, Document document) {
            PdfPTable footer = new PdfPTable(1);
            try {
                footer.setWidths(new int[]{50});
                footer.setTotalWidth(527);
                footer.setLockedWidth(true);
                footer.getDefaultCell().setFixedHeight(100);
                footer.getDefaultCell().setBorder(Rectangle.TOP);
                footer.getDefaultCell().setHorizontalAlignment(Element.ALIGN_CENTER);
                footer.addCell(new Phrase("Merci pour votre confiance", FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, BaseColor.BLACK)));
                document.add(footer);
            } catch (DocumentException de) {
                throw new ExceptionConverter(de);
            }
        }
    }
}
