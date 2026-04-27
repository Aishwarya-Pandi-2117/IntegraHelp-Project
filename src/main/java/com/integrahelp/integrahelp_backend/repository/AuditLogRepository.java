package com.integrahelp.integrahelp_backend.repository;

import com.integrahelp.integrahelp_backend.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {
    List<AuditLog> findByTicketNumber(String ticketNumber);
}
