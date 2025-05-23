package org.example.service.impl;

import org.example.entity.Role;
import org.example.repository.RoleRepository;
import org.example.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    private RoleRepository repo;
    @Override
    public void saveorUpdate(Role types) {
        repo.save(types);
    }

    @Override
    public List<Role> listAll() {
        return this.repo.findAll();
    }

    @Override
    public void deleteType(Long id) {
        repo.deleteById(id);

    }

    @Override
    public Role getTypeByID(Long typeid) {
        return repo.findById(typeid).get();
    }
}
