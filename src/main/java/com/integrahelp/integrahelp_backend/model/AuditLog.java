package com.integrahelp.integrahelp_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity @Table(name = "audit_logs")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class AuditLog {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String ticketNumber;
    private String action;     // CREATED, STATUS_CHANGED
    private String oldStatus;
    private String newStatus;
    private String performedBy;
    private LocalDateTime timestamp;

    @PrePersist
    public void pre() { timestamp = LocalDateTime.now(); }
}