package com.mdoner.backend.entity;

public enum DprSection {
    EXECUTIVE_SUMMARY("Executive Summary", 0.10, true,
            new String[] { "Introduction", "Project Overview", "Background" }),
    OBJECTIVES("Objectives", 0.15, true, new String[] { "Project Objectives", "Purpose", "Goals" }),
    TECHNICAL_SPECS("Technical Specifications", 0.25, true,
            new String[] { "Brief Specification", "Plant & Equipment", "Equipment Details", "Technical Details" }),
    FINANCIALS("Financials", 0.30, true,
            new String[] { "Cost Estimates", "Estimated Expenditure", "Revenue & Profitability", "Project Cost" }),
    TIMELINE("Timeline", 0.10, true, new String[] { "Implementation Schedule", "Phasing Plan", "Schedule" }),
    RISKS("Risks & Mitigation", 0.10, false, new String[] { "Constraints", "Operational Considerations", "Impact" });

    private final String label;
    private final double weight;
    private final boolean mandatory;
    private final String[] aliases;

    DprSection(String label, double weight, boolean mandatory, String[] aliases) {
        this.label = label;
        this.weight = weight;
        this.mandatory = mandatory;
        this.aliases = aliases;
    }

    public String getLabel() {
        return label;
    }

    public double getWeight() {
        return weight;
    }

    public boolean isMandatory() {
        return mandatory;
    }

    public String[] getAliases() {
        return aliases;
    }
}
