package com.integrahelp.integrahelp_backend.service;

import com.integrahelp.integrahelp_backend.dto.TicketRequest;
import com.integrahelp.integrahelp_backend.model.*;
import com.integrahelp.integrahelp_backend.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.stream.Collectors;

@Service @RequiredArgsConstructor
public class TicketService {
    private final TicketRepository ticketRepo;
    private final DepartmentRepository deptRepo;
    private final UserRepository userRepo;
    private final AuditLogRepository auditRepo;
    private final ExcelAuditService excelAudit;

    public Ticket createTicket(TicketRequest req, String username) {
        Department dept = deptRepo.findById(req.getDepartmentId()).orElseThrow(()->new RuntimeException("Department not found"));
        User raiser = null;
        if(!req.isAnonymous() && username != null && !"guest".equals(username)) {
            raiser=userRepo.findByUsername(username).orElse(null);
        }
        Ticket ticket = Ticket.builder()
            .department(dept).issueType(req.getIssueType())
            .description(req.getDescription()).priority(req.getPriority())
            .anonymous(req.isAnonymous()).raisedBy(raiser)
            .build();

        // Map dynamic fields
        if (req.getFields() != null) {
            List<TicketField> fields = req.getFields().stream().map(f -> {
                TicketField tf = new TicketField();
                tf.setFieldName(f.get("fieldName"));
                tf.setFieldValue(f.get("fieldValue"));
                tf.setFieldType(f.get("fieldType"));
                tf.setTicket(ticket);
                return tf;
            }).collect(Collectors.toList());
            ticket.setFields(fields);
        }

        Ticket saved = ticketRepo.save(ticket);
        logAudit(saved, "CREATED", null, "SUBMITTED",
            req.isAnonymous() ? "ANONYMOUS" : username);
        excelAudit.logToExcel(saved);
        return saved;
    }

    public Ticket updateStatus(Long id, String newStatus, String adminUsername) {
        Ticket ticket = ticketRepo.findById(id).orElseThrow();
        String old = ticket.getStatus().name();
        User admin = userRepo.findByUsername(adminUsername).orElse(null);
        ticket.setStatus(Ticket.Status.valueOf(newStatus));
        ticket.setAssignedTo(admin);
        Ticket updated = ticketRepo.save(ticket);
        logAudit(updated, "STATUS_CHANGED", old, newStatus, adminUsername);
        excelAudit.logToExcel(updated);
        return updated;
    }

    public List<Ticket> getTicketsByDept(Long deptId) {
        return ticketRepo.findByDepartmentId(deptId);
    }

    public List<Ticket> getMyTickets(String username) {
        User user = userRepo.findByUsername(username).orElseThrow();
        return ticketRepo.findByRaisedById(user.getId());
    }

    public List<Ticket> getAllTickets() { return ticketRepo.findAll(); }

    private void logAudit(Ticket t, String action, String old,
            String newSt, String by) {
        auditRepo.save(AuditLog.builder()
            .ticketNumber(t.getTicketNumber())
            .action(action).oldStatus(old).newStatus(newSt)
            .performedBy(by).build());
    }
}