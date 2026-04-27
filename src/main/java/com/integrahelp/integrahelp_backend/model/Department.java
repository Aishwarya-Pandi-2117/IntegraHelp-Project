package com.integrahelp.integrahelp_backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity @Table(name = "departments")
@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class Department {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;   
    private String code;   
    private String icon;   
    private String description;

    @Column(columnDefinition = "TEXT")
    private String issueTypesJson; // JSON array of issue types
}