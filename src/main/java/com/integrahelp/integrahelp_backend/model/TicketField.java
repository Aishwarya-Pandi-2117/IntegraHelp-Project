package com.integrahelp.integrahelp_backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity @Table(name = "ticket_fields")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class TicketField {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;

    private String fieldName;   // "Floor Number"
    private String fieldValue;  // "3"
    private String fieldType;   // TEXT | NUMBER | SELECT
}