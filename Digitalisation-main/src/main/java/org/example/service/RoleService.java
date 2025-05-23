package org.example.service;



import org.example.entity.Role;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RoleService {
    void saveorUpdate(Role types);
    List<Role> listAll();
    void deleteType(Long id);
    Role getTypeByID(Long typeid);
}
