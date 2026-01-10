package com.mdoner.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mdoner.backend.entity.DprSection;
import org.springframework.stereotype.Service;

import java.util.Iterator;

@Service
public class ScoringService {

    private final ObjectMapper objectMapper = new ObjectMapper();

    public ObjectNode calculateWeightedScore(ArrayNode sectionAnalysis) {
        double totalWeightedScore = 0.0;
        double totalPossibleWeight = 0.0;
        int analyzedSections = 0;
        int weakSections = 0;
        int missingSections = 0;

        Iterator<JsonNode> elements = sectionAnalysis.elements();
        while (elements.hasNext()) {
            JsonNode sectionNode = elements.next();
            String sectionName = sectionNode.path("sectionName").asText();
            String status = sectionNode.path("status").asText("PRESENT");
            int rawScore = sectionNode.path("score").asInt();

            // Match with Ontology Enum
            DprSection ontology = findOntology(sectionName);
            if (ontology != null) {
                double sectionScore = rawScore; // Already 0-100 from backend scoring logic

                // Handle status semantics - no penalties, scores already reflect quality
                if ("WEAK".equalsIgnoreCase(status) || "PRESENT_BUT_WEAK".equalsIgnoreCase(status)) {
                    // Score already reflects weakness (50-65 range)
                    // Only apply penalty if mandatory section is critically weak
                    if (ontology.isMandatory() && rawScore < 50) {
                        sectionScore *= 0.7; // 30% penalty for critically weak mandatory sections
                    }
                    weakSections++;
                } else if ("MISSING".equalsIgnoreCase(status)) {
                    sectionScore = 0;
                    missingSections++;
                }

                // Calculate weighted contribution (weight is 0-1, score is 0-100)
                // Each section contributes its score * weight to the final score
                totalWeightedScore += (sectionScore * ontology.getWeight());
                totalPossibleWeight += (100.0 * ontology.getWeight()); // Max possible for this section
                analyzedSections++;
            }
        }

        // Final score calculation - normalize to 0-100 range
        int finalScore = 0;
        if (totalPossibleWeight > 0) {
            // totalWeightedScore is already weighted sum of actual scores
            // totalPossibleWeight is the weighted sum of maximum possible scores
            double normalizedScore = (totalWeightedScore / totalPossibleWeight) * 100.0;
            finalScore = (int) Math.round(normalizedScore);
        }

        // Create Report
        ObjectNode scoreReport = objectMapper.createObjectNode();
        scoreReport.put("finalScore", finalScore);

        // Risk level determination - adjusted for legacy DPRs
        String riskLevel = "LOW";
        if (finalScore < 50) {
            riskLevel = "HIGH";
        } else if (finalScore < 65) {
            riskLevel = "MEDIUM";
        } else {
            riskLevel = "LOW";
        }

        scoreReport.put("riskLevel", riskLevel);
        scoreReport.put("analyzedSections", analyzedSections);
        scoreReport.put("weakSections", weakSections);
        scoreReport.put("missingSections", missingSections);

        return scoreReport;
    }

    private DprSection findOntology(String sectionName) {
        try {
            return DprSection.valueOf(sectionName);
        } catch (IllegalArgumentException e) {
            for (DprSection s : DprSection.values()) {
                if (s.getLabel().equalsIgnoreCase(sectionName))
                    return s;
            }
            return null;
        }
    }
}
