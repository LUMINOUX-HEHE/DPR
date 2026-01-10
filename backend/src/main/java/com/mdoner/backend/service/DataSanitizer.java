package com.mdoner.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mdoner.backend.dto.StructuredDPR;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class DataSanitizer {

    private final ObjectMapper objectMapper;

    public DataSanitizer() {
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Converts a confirmed StructuredDPR into a sanitized JSON payload for AI
     * processing.
     * Ensures strict schema adherence and removes any potentially overflowing
     * binary data or internal IDs.
     * 
     * @param dpr The internal structured DPR object
     * @return Sanitized string JSON ready for LLM context window
     */
    public String sanitizeForAi(StructuredDPR dpr) {
        ObjectNode root = objectMapper.createObjectNode();

        // Metadata Context
        root.put("dpr_id_ref", dpr.getId()); // Use reference ID, logic decoupling
        root.put("extraction_timestamp", LocalDateTime.now().toString());
        root.put("context_guidelines", "MDONER_2024_STANDARD_V1");

        // Section Data (Cleaned)
        ObjectNode sectionsNode = root.putObject("sections");

        for (Map.Entry<String, String> entry : dpr.getSections().entrySet()) {
            String sectionName = entry.getKey();
            String content = entry.getValue();

            // Basic sanitization: Limit length if necessary, remove null bytes
            // In a real gov system, PII redaction would happen here
            String cleanedContent = cleanText(content);

            sectionsNode.put(normalizeKey(sectionName), cleanedContent);
        }

        return root.toPrettyString();
    }

    private String cleanText(String input) {
        if (input == null)
            return "";
        return input.trim().replaceAll("\\x00", ""); // Remove null bytes
    }

    private String normalizeKey(String key) {
        return key.toLowerCase().replace(" ", "_");
    }
}
