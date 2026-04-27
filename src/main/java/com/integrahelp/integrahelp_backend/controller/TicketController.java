package com.integrahelp.integrahelp_backend.controller;

import com.integrahelp.integrahelp_backend.dto.*;
import com.integrahelp.integrahelp_backend.model.Ticket;
import com.integrahelp.integrahelp_backend.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.stream.Collectors;

@RestController @RequestMapping("/api/tickets")
@RequiredArgsConstructor @CrossOrigin
public class TicketController {
    private final TicketService ticketService;

    @PostMapping
    public ResponseEntity<TicketResponse> create(@RequestBody TicketRequest req,
            Authentication auth) {
        String user = auth != null ? auth.getName() : "guest";
        Ticket t = ticketService.createTicket(req, user);
        return ResponseEntity.ok(TicketResponse.from(t));
    }

    @GetMapping("/my")
    public ResponseEntity<List<TicketResponse>> myTickets(Authentication auth) {
    	return ResponseEntity.ok(
            ticketService.getMyTickets(auth.getName())
                .stream().map(TicketResponse::from).collect(Collectors.toList()));
    }

    @GetMapping("/department/{deptId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TicketResponse>> byDept(@PathVariable Long deptId) {
        return ResponseEntity.ok(
            ticketService.getTicketsByDept(deptId)
                .stream().map(TicketResponse::from).collect(Collectors.toList()));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<TicketResponse>> all() {
        return ResponseEntity.ok(
            ticketService.getAllTickets()
                .stream().map(TicketResponse::from).collect(Collectors.toList()));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<TicketResponse> updateStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest req,
            Authentication auth) {
        Ticket t = ticketService.updateStatus(id, req.getStatus(), auth.getName());
        return ResponseEntity.ok(TicketResponse.from(t));
    }
}