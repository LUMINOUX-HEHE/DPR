package com.mdoner.backend.controller;

import com.mdoner.backend.service.DprProcessingService;
import com.mdoner.backend.entity.DprDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/dpr")
@CrossOrigin(origins = "*")
public class IngestionController {

    private final DprProcessingService processingService;

    @Autowired
    public IngestionController(DprProcessingService processingService) {
        this.processingService = processingService;
    }

    @PostMapping("/upload")
    public ResponseEntity<Object> uploadDpr(@RequestParam("file") MultipartFile file) {
        try {
            // 1. Validate File Type
            if (!"application/pdf".equals(file.getContentType())) {
                throw new IllegalArgumentException("Only PDF files are allowed.");
            }

            // 2. Initiate Async Processing
            String jobId = processingService.initiateProcessing(file);

            // 3. Return Job ID
            Map<String, String> response = new HashMap<>();
            response.put("jobId", jobId);
            response.put("status", "SUBMITTED");
            response.put("message", "File uploaded successfully. Processing started.");

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Processing Failed");
            error.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/list")
    public ResponseEntity<Object> listAllDprs() {
        try {
            var allDocs = processingService.getAllDocuments();

            // Transform to response format
            var dprList = allDocs.stream()
                    .map(doc -> {
                        Map<String, Object> dprData = new HashMap<>();
                        dprData.put("jobId", doc.getJobId());
                        dprData.put("filename", doc.getFilename());
                        dprData.put("status", doc.getStatus() != null ? doc.getStatus().toString() : "UNKNOWN");
                        dprData.put("uploadDate", doc.getIngestTimestamp());

                        // Add analysis result if completed
                        if (doc.getStatus() == DprDocument.ValidationStatus.COMPLETED
                                && doc.getAnalysisResult() != null) {
                            dprData.put("analysisResult", doc.getAnalysisResult());
                        }

                        return dprData;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(dprList);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Failed to fetch DPR list");
            error.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @GetMapping("/status/{jobId}")
    public ResponseEntity<Object> getStatus(@PathVariable String jobId) {
        DprDocument doc = processingService.getStatus(jobId);

        if (doc == null) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> response = new HashMap<>();
        response.put("jobId", doc.getJobId());
        response.put("status", doc.getStatus());
        response.put("filename", doc.getFilename());

        // Map internal status to explicit UI lifecycle states
        String lifecycleStatus = "NOT_STARTED";
        if (doc.getStatus() != null) {
            switch (doc.getStatus()) {
                case UPLOADED:
                    lifecycleStatus = "NOT_STARTED";
                    break;
                case EXTRACTING:
                case ExtractingTEXT:
                case ANALYZING:
                    lifecycleStatus = "IN_PROGRESS";
                    break;
                case COMPLETED:
                    lifecycleStatus = "COMPLETED";
                    break;
                case FAILED:
                    lifecycleStatus = "FAILED";
                    break;
            }
        }
        response.put("lifecycleStatus", lifecycleStatus);

        if (doc.getStatus() == DprDocument.ValidationStatus.COMPLETED) {
            response.put("result", doc.getAnalysisResult());
        } else if (doc.getStatus() == DprDocument.ValidationStatus.FAILED) {
            response.put("error", doc.getValidationRemarks());
        }

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Object> deleteDpr(@PathVariable String jobId) {
        try {
            processingService.deleteDocument(jobId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Document deleted successfully.");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "Deletion Failed");
            error.put("message", e.getMessage());
            return ResponseEntity.internalServerError().body(error);
        }
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleBadReq(IllegalArgumentException e) {
        Map<String, String> response = new HashMap<>();
        response.put("error", "Invalid Input");
        response.put("message", e.getMessage());
        return ResponseEntity.badRequest().body(response);
    }
}
