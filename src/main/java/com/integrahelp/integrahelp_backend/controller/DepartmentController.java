package com.integrahelp.integrahelp_backend.controller;

import com.integrahelp.integrahelp_backend.model.Department;
import com.integrahelp.integrahelp_backend.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/departments")
@RequiredArgsConstructor @CrossOrigin
public class DepartmentController {
    private final DepartmentService deptService;

    @GetMapping
    public ResponseEntity<List<Department>> getAll() {
        return ResponseEntity.ok(deptService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getById(@PathVariable Long id) {
        return ResponseEntity.ok(deptService.getById(id));
    }
}
