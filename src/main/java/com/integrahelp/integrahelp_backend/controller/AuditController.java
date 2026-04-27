package com.integrahelp.integrahelp_backend.controller;

import com.integrahelp.integrahelp_backend.model.AuditLog;
import com.integrahelp.integrahelp_backend.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController @RequestMapping("/api/audit")
@RequiredArgsConstructor @CrossOrigin
public class AuditController {
    private final AuditLogRepository auditRepo;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> all() {
        return ResponseEntity.ok(auditRepo.findAll());
    }

    @GetMapping("/{ticketNo}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AuditLog>> byTicket(@PathVariable String ticketNo) {
        return ResponseEntity.ok(auditRepo.findByTicketNumber(ticketNo));
    }
}
