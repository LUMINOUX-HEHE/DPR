package com.mdoner.backend.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class ValidationReport {
    public enum Status {
        PASS, FAIL, FLAGGED
    }

    private String dprId;
    private Status status;
    private List<String> issues;
    private LocalDateTime timestamp;

    public ValidationReport(String dprId) {
        this.dprId = dprId;
        this.status = Status.PASS; // Default to PASS, degrade if issues found
        this.issues = new ArrayList<>();
        this.timestamp = LocalDateTime.now();
    }

    public void addIssue(String issue, boolean isBlocking) {
        this.issues.add(issue);
        if (isBlocking) {
            this.status = Status.FAIL;
        } else if (this.status != Status.FAIL) {
            this.status = Status.FLAGGED;
        }
    }

    // Getters
    public String getDprId() {
        return dprId;
    }

    public Status getStatus() {
        return status;
    }

    public List<String> getIssues() {
        return issues;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }
}
