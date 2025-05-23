package org.example.controller;


import org.eclipse.microprofile.openapi.annotations.security.SecurityRequirement;
import org.example.Dto.RoleDto;
import org.example.entity.Role;
import org.example.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("api/v1/type")
@SecurityRequirement(name = "Keycloak")
public class RoleController {
    @Autowired
    private RoleService roleService;

    @PostMapping("/save")
    private Long saveType(@RequestBody Role type) {
        roleService.saveorUpdate(type);
        return type.getId();
    }

    @GetMapping(value = "/getall")
    public List<RoleDto> getTypes() {
        return roleService.listAll().stream().map(RoleDto::toDto).collect(Collectors.toList());
    }

    @PutMapping(value = "/edit/{id}")
    private RoleDto update(@RequestBody Role type, @PathVariable(name = "id") Long Id) {
        type.setId(Id);
        roleService.saveorUpdate(type);
        return RoleDto.toDto(type);

    }
    @DeleteMapping("/delete/{id}")
    private void deleteType(@PathVariable("id") Long Id) {
        roleService.deleteType(Id);
    }


    @RequestMapping("/search/{id}")
    private RoleDto getFactures(@PathVariable(name = "id") Long typeid) {
        return RoleDto.toDto(roleService.getTypeByID(typeid));
    }
}
