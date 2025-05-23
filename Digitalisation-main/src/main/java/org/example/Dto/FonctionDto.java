package org.example.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Fonction;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class FonctionDto {
    private Long id;

    private String qualite;

    private List<ContactDto> contactDto;

    public static FonctionDto toDto(Fonction fonction){
        return FonctionDto.builder()
                .id(fonction.getId())
                .qualite(fonction.getQualite())
                //.contactDto(((fonction.getContacts().stream().map(ContactDto::toDto).collect(Collectors.toList()))))
                .build();
    }

    public static Fonction convertFonctionDtoToEntity(FonctionDto fonctionDto) {
        Fonction fonction = new Fonction();
        fonction.setId(fonctionDto.getId());
        fonction.setQualite(fonctionDto.getQualite());
        // Assurez-vous d'initialiser les autres attributs de l'entité Fonction si nécessaire

        return fonction;
    }
}
