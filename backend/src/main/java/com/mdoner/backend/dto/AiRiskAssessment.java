package com.mdoner.backend.dto;

import java.util.List;

import lombok.Data;

@Data
public class AiRiskAssessment {
    private String dprId;
    private double riskScore; // 0.0 to 100.0
    private String overallRiskLevel; // LOW, MEDIUM, HIGH, CRITICAL
    private List<RiskFactor> riskFactors;
    private List<ComplianceObservation> observations;

    // Inner classes for detailed breakdown
    public static class RiskFactor {
        public String category; // COST, TIMELINE, ENVIRONMENTAL
        public String description;
        public String severity;
    }

    public static class ComplianceObservation {
        public String section;
        public String remark;
        public boolean isCompliant;
    }

    // Getters and Setters omitted for brevity
}
