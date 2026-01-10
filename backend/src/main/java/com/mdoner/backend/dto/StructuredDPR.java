package com.mdoner.backend.dto;

import java.util.Map;

public class StructuredDPR {
    private String id;
    private String rawText;
    private Map<String, String> sections;
    private boolean isComplete;

    // Getters, Setters, Constructors
    public StructuredDPR() {
        this.sections = new java.util.HashMap<>();
    }

    public StructuredDPR(String id, String rawText, Map<String, String> sections) {
        this.id = id;
        this.rawText = rawText;
        this.sections = sections;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRawText() {
        return rawText;
    }

    public void setRawText(String rawText) {
        this.rawText = rawText;
    }

    public Map<String, String> getSections() {
        return sections;
    }

    public void setSections(Map<String, String> sections) {
        this.sections = sections;
    }

    public boolean isComplete() {
        return isComplete;
    }

    public void setComplete(boolean complete) {
        isComplete = complete;
    }
}
