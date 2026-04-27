package com.integrahelp.integrahelp_backend.repository;

import com.integrahelp.integrahelp_backend.model.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByDepartmentId(Long deptId);
    List<Ticket> findByRaisedById(Long userId);
    List<Ticket> findByStatus(Ticket.Status status);
    List<Ticket> findByAnonymousTrue();
}
