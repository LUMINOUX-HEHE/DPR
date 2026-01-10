package com.mdoner.backend.entity;

import com.mdoner.backend.model.ProjectStatus;
import com.mdoner.backend.model.RiskLevel;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "projects")
@Data
@NoArgsConstructor
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status;

    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;

    private Double budget;

    private String location;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
