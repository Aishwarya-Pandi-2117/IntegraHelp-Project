package com.integrahelp.integrahelp_backend.dto;

import com.integrahelp.integrahelp_backend.model.Ticket;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data @Builder
public class TicketResponse {
    private Long id;
    private String ticketNumber;
    private String departmentName;
    private String issueType;
    private String status;
    private String raisedBy;  // masked if anonymous
    private boolean anonymous;
    private String assignedTo;
    private String description;
    private String priority;
    private List<Map<String, String>> fields;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TicketResponse from(Ticket t) {
        return TicketResponse.builder()
            .id(t.getId())
            .ticketNumber(t.getTicketNumber())
            .departmentName(t.getDepartment() != null ? t.getDepartment().getName() : "")
            .issueType(t.getIssueType())
            .status(t.getStatus().name())
            .raisedBy(t.isAnonymous() ? "Anonymous" :
                (t.getRaisedBy() != null ? t.getRaisedBy().getFullName() : ""))
            .anonymous(t.isAnonymous())
            .assignedTo(t.getAssignedTo() != null ? t.getAssignedTo().getFullName() : "")
            .description(t.getDescription())
            .priority(t.getPriority())
            .createdAt(t.getCreatedAt())
            .updatedAt(t.getUpdatedAt())
            .build();
    }
}
