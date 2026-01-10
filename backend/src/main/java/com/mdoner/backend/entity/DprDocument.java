package com.mdoner.backend.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "dpr_documents")
@Data
public class DprDocument {

    public DprDocument() {
    }

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String filename;

    @Column(nullable = false, unique = true)
    private String storageReference; // UUID filename on disk

    @Column(nullable = false)
    private String fileHash; // SHA-256 for audit

    @Column(unique = true)
    private String jobId; // For async tracking

    @Enumerated(EnumType.STRING)
    private ValidationStatus status;

    @Column(columnDefinition = "TEXT")
    private String validationRemarks; // Rule-engine output

    @Column(columnDefinition = "TEXT")
    private String analysisResult; // Detailed AI JSON output

    @CreationTimestamp
    private LocalDateTime ingestTimestamp;

    @Transient
    private String allText; // Full document content for AI context

    public enum ValidationStatus {
        UPLOADED,
        EXTRACTING,
        ExtractingTEXT, // Legacy compatible
        ANALYZING,
        COMPLETED,
        FAILED
    }

    public DprDocument(String filename, String storageReference) {
        this.filename = filename;
        this.storageReference = storageReference;
        this.status = ValidationStatus.UPLOADED;
        this.fileHash = "PENDING_HASH";
        this.jobId = UUID.randomUUID().toString();
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }

    public String getStorageReference() {
        return storageReference;
    }

    public void setStorageReference(String storageReference) {
        this.storageReference = storageReference;
    }

    public String getFileHash() {
        return fileHash;
    }

    public void setFileHash(String fileHash) {
        this.fileHash = fileHash;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public ValidationStatus getStatus() {
        return status;
    }

    public void setStatus(ValidationStatus status) {
        this.status = status;
    }

    public String getValidationRemarks() {
        return validationRemarks;
    }

    public void setValidationRemarks(String validationRemarks) {
        this.validationRemarks = validationRemarks;
    }

    public String getAnalysisResult() {
        return analysisResult;
    }

    public void setAnalysisResult(String analysisResult) {
        this.analysisResult = analysisResult;
    }

    public LocalDateTime getIngestTimestamp() {
        return ingestTimestamp;
    }

    public void setIngestTimestamp(LocalDateTime ingestTimestamp) {
        this.ingestTimestamp = ingestTimestamp;
    }

    public String getAllText() {
        return allText;
    }

    public void setAllText(String allText) {
        this.allText = allText;
    }
}
