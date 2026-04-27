package com.integrahelp.integrahelp_backend.dto;

import lombok.Data;
import java.util.List;
import java.util.Map;

@Data
public class TicketRequest {
    private Long departmentId;
    private String issueType;
    private String description;
    private String priority;
    private boolean anonymous;
    private List<Map<String, String>> fields;
    // Each map: {fieldName, fieldValue, fieldType}
}
