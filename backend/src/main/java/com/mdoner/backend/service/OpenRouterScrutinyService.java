package com.mdoner.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.mdoner.backend.entity.DprDocument;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;

@Service
public class OpenRouterScrutinyService {

    private static final Logger logger = LoggerFactory.getLogger(OpenRouterScrutinyService.class);

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${ai.api.key}")
    private String apiKey;

    @Value("${ai.api.url:https://openrouter.ai/api/v1/chat/completions}")
    private String apiUrl;

    @Value("${ai.model.name:allenai/olmo-3.1-32b-think}")
    private String modelName;

    @Async
    public CompletableFuture<String> scrutinize(DprDocument document) {
        try {
            // 1. Prepare Content
            String allText = document.getAllText();
            if (allText == null || allText.isEmpty()) {
                return CompletableFuture.completedFuture(
                        "{\"error\":\"Empty document content\",\"overallScore\":0,\"riskLevel\":\"HIGH\"}");
            }

            // 2. Hard Guardrail: Pre-validate Financial Data Presence via Regex
            // Matches currency markers, cost terms, unit prices, and NHB-specific markers
            boolean financialDataDetected = allText.matches(
                    "(?is).*(Rs\\.|INR|Crore|Lakhs|Estimated Cost|Project Cost|Means of Finance|Summary of Project Cost|Manpower Cost|Unit Price|Cost Table|OPEX|CAPEX|per unit|per month|Machinery|Equipment Cost|Civil Works|Protected cultivation|PHM cost|NHB|National Horticulture Board).*");

            // Truncate if necessary (approx 25k tokens ~ 100k chars)
            String safeText = truncate(allText, 100000);

            // 3. Call LLM with Single-Shot Prompt and Metadata Hint
            ObjectNode analysisResult = callLLM(safeText, financialDataDetected);

            // 4. Post-processing Guardrail: Enforce Score Floor and Status
            if (analysisResult != null && financialDataDetected) {
                JsonNode sections = analysisResult.path("documentAnalysis").path("sections");
                if (sections.isArray()) {
                    for (JsonNode section : sections) {
                        if ("FINANCIALS".equals(section.path("section").asText())) {
                            ObjectNode finSection = (ObjectNode) section;
                            // Enforce Status if AI missed it
                            String currentStatus = finSection.path("status").asText();
                            if (currentStatus.isEmpty()) {
                                // Try presence if status is missing
                                currentStatus = finSection.path("presence").asText();
                            }

                            if ("MISSING".equals(currentStatus) || "ABSENT".equals(currentStatus)
                                    || currentStatus.isEmpty()) {
                                finSection.put("status", "INCOMPLETE");
                                finSection.put("presence", "INCOMPLETE"); // Mirror for UI
                                finSection.put("reason",
                                        "Financial cost structures and summary tables are present; however, final project cost totals and projections are incomplete or template-based and require applicant-specific inputs.");
                                finSection.put("summary",
                                        "Financial cost structures and summary tables are present; however, final project cost totals and projections are incomplete or template-based and require applicant-specific inputs."); // Legacy
                            }
                            // Enforce Score Floor (Min 65 for Detailed/Template-based/Incomplete as per NHB
                            // rules)
                            if (finSection.path("score").asInt() < 65) {
                                finSection.put("score", 65);
                            }
                        }
                    }
                }
            }

            // 5. Fallback if null
            if (analysisResult == null) {
                return CompletableFuture.completedFuture(
                        "{\"error\":\"AI Analysis Failed\",\"overallScore\":{\"score\":0,\"riskLevel\":\"UNKNOWN\"}}");
            }

            // 6. Return the raw JSON structure
            return CompletableFuture.completedFuture(objectMapper.writeValueAsString(analysisResult));

        } catch (Exception e) {
            logger.error("Scrutiny failed", e);
            return CompletableFuture.completedFuture(
                    "{\"error\":\"Scrutiny failed\",\"details\":\"" + e.getMessage() + "\"}");
        }
    }

    private ObjectNode callLLM(String content, boolean financialDataDetected) throws Exception {

        String systemPrompt = "You are an AI evaluator for Government / PSU / NHB / SIH-style Detailed Project Reports (DPRs).\n\n"
                + "ROLE & EVALUATION PHILOSOPHY:\n"
                + "- Act as a decision-support evaluator, not a rejection engine.\n"
                + "- Assume good faith in feasibility reports unless evidence proves otherwise.\n"
                + "- Missing documentation ≠ project infeasibility.\n"
                + "- penalize ABSENCE of sections, but do NOT exaggerate risk or downgrade viable projects.\n"
                + "- EVIDENCE-FIRST RULE: Every generated summary MUST include Chapter numbers, Page numbers (or page ranges), and Headings used for extraction.\n\n"
                + "CONSERVATIVE GOVERNMENT-GRADE LANGUAGE (MANDATORY):\n"
                + "- Replace speculative or absolute language with neutral phrasing:\n"
                + "    ❌ \"No financials\" ✅ \"Financial data distributed; final values pending state inputs\"\n"
                + "    ❌ \"Incomplete DPR\" ✅ \"Template-based DPR requiring state customization\"\n"
                + "    ❌ \"Complete absence of timeline\" ✅ \"Detailed milestones not specified\"\n"
                + "    ❌ \"Financials are truncated\" ✅ \"Final values pending confirmation\"\n"
                + "    ❌ \"No risk assessment provided\" ✅ \"Risk analysis not explicitly documented\"\n\n"
                + "FINANCIAL EVALUATION LOGIC (STRICT - 3 STATES ONLY):\n"
                + "- Classify the FINANCIALS section using EXACTLY one of these status states:\n"
                + "    1. COMPLETE: Totals, projections, and summaries are fully populated and consistent.\n"
                + "    2. INCOMPLETE: Financial tables/headings exist (Project Cost, Means of Finance, etc.), but contain template placeholders or blank totals.\n"
                + "    3. MISSING: Complete absence of financial tables, cost sections, or financial headings.\n\n"
                + "- MANDATORY WORDING FOR 'INCOMPLETE':\n"
                + "    If status is INCOMPLETE, you MUST state: \"Financial cost structures and summary tables are present; however, final project cost totals and projections are incomplete or template-based and require applicant-specific inputs.\"\n\n"
                + "- FORBIDDEN PHRASES:\n"
                + "    ❌ \"Total project cost is not calculated\"\n"
                + "    ❌ \"Final project cost totals are missing\"\n"
                + "    ❌ \"Financial data absent\"\n\n"
                + "TASK:\n"
                + "- Analyze the document and return a STRUCTURED JSON evaluation.\n"
                + "- For EVERY section, provide 3–6 bullet points in the 'summary' field.\n"
                + "- Ensure ALL sections (EXECUTIVE_SUMMARY, TECHNICAL_SPECS, FINANCIALS, RISKS, TIMELINE) are present in 'documentAnalysis.sections'.\n\n"
                + "EXPECTED OUTPUT FORMAT (JSON ONLY):\n"
                + "{\n"
                + "  \"overallScore\": { \"score\": <int>, \"riskLevel\": \"...\", \"confidence\": \"...\" },\n"
                + "  \"summary\": \"<Overall document summary>\",\n"
                + "  \"documentAnalysis\": {\n"
                + "    \"sections\": [\n"
                + "      {\n"
                + "        \"section\": \"EXECUTIVE_SUMMARY | TECHNICAL_SPECS | FINANCIALS | RISKS | TIMELINE\",\n"
                + "        \"presence\": \"<PRESENT | PARTIAL | ABSENT | COMPLETE | INCOMPLETE | MISSING>\",\n"
                + "        \"status\": \"<COMPLETE | INCOMPLETE | MISSING>\",\n"
                + "        \"summary\": \"<3-6 bullets with evidence labels>\",\n"
                + "        \"reason\": \"<Mandatory wording for INCOMPLETE financials or detailed justification>\",\n"
                + "        \"score\": <int>,\n"
                + "        \"evidence\": { \"chapters\": [], \"pageRanges\": [], \"headingsFound\": [] }\n"
                + "      }\n"
                + "    ]\n"
                + "  }\n"
                + "}";

        String userMsg = "DOCUMENT CONTENT:\n" + content;
        if (financialDataDetected) {
            userMsg = "PRE-VALIDATION NOTE: Financial cost tables, headings, or unit prices were detected. Ensure FINANCIALS status is at least 'INCOMPLETE' with a score >= 65 and follows the mandatory wording standard.\n\n"
                    + userMsg;
        }

        Map<String, Object> payload = Map.of(
                "model", modelName,
                "messages", List.of(
                        Map.of("role", "system", "content", systemPrompt),
                        Map.of("role", "user", "content", userMsg)),
                "temperature", 0.1,
                "max_tokens", 4000,
                "response_format", Map.of("type", "json_object"));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        ResponseEntity<String> response = restTemplate.postForEntity(
                apiUrl, new HttpEntity<>(payload, headers), String.class);

        if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null)
            return null;

        JsonNode root = objectMapper.readTree(response.getBody());
        String contentString = root.path("choices").path(0).path("message").path("content").asText();

        return (ObjectNode) objectMapper.readTree(contentString);
    }

    private String truncate(String s, int max) {
        if (s == null)
            return "";
        return s.length() > max ? s.substring(0, max) : s;
    }
}
