package com.integrahelp.integrahelp_backend.service;

import com.integrahelp.integrahelp_backend.model.Department;
import com.integrahelp.integrahelp_backend.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service @RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository deptRepo;

    public List<Department> getAll() { return deptRepo.findAll(); }
    public Department getById(Long id) { return deptRepo.findById(id).orElseThrow(); }
}
