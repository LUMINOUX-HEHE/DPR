package com.mdoner.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.mdoner.backend.dto.StructuredDPR;
import com.mdoner.backend.dto.ValidationReport;
import com.mdoner.backend.entity.DprDocument;
import com.mdoner.backend.repository.DprRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.nio.file.Path;
import java.util.concurrent.CompletableFuture;

@Service
public class DprAsyncProcessor {

    private static final Logger logger = LoggerFactory.getLogger(DprAsyncProcessor.class);

    private final StorageService storageService;
    private final PdfExtractionService extractionService;
    private final StructureMapper structureMapper;
    private final RuleEngineService ruleEngine;
    private final DprRepository dprRepository;
    private final OpenRouterScrutinyService scrutinyService; // Updated service
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public DprAsyncProcessor(
            StorageService storageService,
            PdfExtractionService extractionService,
            StructureMapper structureMapper,
            RuleEngineService ruleEngine,
            DprRepository dprRepository,
            OpenRouterScrutinyService scrutinyService) {
        this.storageService = storageService;
        this.extractionService = extractionService;
        this.structureMapper = structureMapper;
        this.ruleEngine = ruleEngine;
        this.dprRepository = dprRepository;
        this.scrutinyService = scrutinyService;
    }

    @Async
    public void processAsync(DprDocument doc) {
        try {
            logger.info("Job {}: Starting Async Processing...", doc.getJobId());

            // --- Step 1: Extraction ---
            doc.setStatus(DprDocument.ValidationStatus.EXTRACTING);
            dprRepository.save(doc);

            Path filePath = storageService.load(doc.getStorageReference());
            String rawText = extractionService.extractText(filePath);

            // Set text for AI context
            doc.setAllText(rawText);

            // --- Step 2: Structure Mapping (Kept for Rules) ---
            StructuredDPR structuredDPR = structureMapper.mapToStructure(doc.getId().toString(), rawText);

            // --- Step 3: Rule Based Validation (Fast Fail / Warning) ---
            ValidationReport report = ruleEngine.validate(structuredDPR);
            doc.setValidationRemarks(report.getIssues().toString());

            // --- Step 4: AI Analysis (Full Document Single-Shot) ---
            doc.setStatus(DprDocument.ValidationStatus.ANALYZING);
            dprRepository.save(doc);

            CompletableFuture<String> aiResultFuture = scrutinyService.scrutinize(doc);
            String aiJson = aiResultFuture.get();
            logger.info("Job {}: AI Raw Response: {}", doc.getJobId(), aiJson);

            // Validate that it's valid JSON
            try {
                JsonNode analysisNode = objectMapper.readTree(aiJson);
                // Ensure no error field
                if (analysisNode.has("error")) {
                    logger.warn("Job {}: AI returned error: {}", doc.getJobId(), analysisNode.get("error"));
                    doc.setStatus(DprDocument.ValidationStatus.FAILED);
                    doc.setValidationRemarks(analysisNode.get("error").asText());
                } else {
                    doc.setAnalysisResult(aiJson);
                    doc.setStatus(DprDocument.ValidationStatus.COMPLETED);
                    logger.info("Job {}: Processing Completed Successfully.", doc.getJobId());
                }
            } catch (Exception e) {
                logger.error("Job {}: JSON Parsing Failed", doc.getJobId(), e);
                doc.setStatus(DprDocument.ValidationStatus.FAILED);
                doc.setValidationRemarks("Analysis Output Invalid");
            }

            dprRepository.save(doc);

        } catch (Exception e) {
            logger.error("Job {}: Processing Failed", doc.getJobId(), e);
            doc.setStatus(DprDocument.ValidationStatus.FAILED);
            doc.setValidationRemarks("Processing Error: " + e.getMessage());
            dprRepository.save(doc);
        }
    }
}
