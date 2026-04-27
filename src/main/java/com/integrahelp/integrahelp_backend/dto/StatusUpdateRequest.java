package com.integrahelp.integrahelp_backend.dto;

import lombok.Data;

@Data
public class StatusUpdateRequest {
    private String status; // SUBMITTED | IN_PROGRESS | RESOLVED
    private String comment;
}