package org.example.Dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.example.entity.Role;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RoleDto {
    private Long id;

    private String typee;



    public static RoleDto toDto(Role type){
        return RoleDto.builder()
                .id(type.getId())
                .typee(type.getTypee())

                .build();
    }
}
