package com.mdoner.backend.service;

import com.mdoner.backend.dto.StructuredDPR;
import com.mdoner.backend.dto.ValidationReport;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class RuleEngineService {

    public ValidationReport validate(StructuredDPR dpr) {
        ValidationReport report = new ValidationReport(dpr.getId());

        // 1. Completeness Rule
        checkMandatorySections(dpr, report);

        // 2. Budget Sanity Rule
        checkBudgetSanity(dpr, report);

        // 3. Timeline Feasibility Rule (Basic)
        checkTimelineFeasibility(dpr, report);

        return report;
    }

    private void checkMandatorySections(StructuredDPR dpr, ValidationReport report) {
        Map<String, String> segments = dpr.getSections();
        for (com.mdoner.backend.entity.DprSection section : com.mdoner.backend.entity.DprSection.values()) {
            if (section.isMandatory()) {
                if (!segments.containsKey(section.name()) || segments.get(section.name()).trim().isEmpty()) {
                    report.addIssue("Missing Mandatory Section: " + section.getLabel(), true);
                }
            }
        }
    }

    private void checkBudgetSanity(StructuredDPR dpr, ValidationReport report) {
        String financials = dpr.getSections().get(com.mdoner.backend.entity.DprSection.FINANCIALS.name());
        if (financials != null) {
            // Heuristic: Look for "Total Cost" or "Grand Total" followed by numbers
            Pattern costPattern = Pattern.compile("(?i)(Total|Cost|Budget|Expenditure)[\\s\\S]{0,20}?(\\d+[.,]?\\d*)");
            Matcher matcher = costPattern.matcher(financials);

            if (!matcher.find()) {
                report.addIssue("Financial Section present but no clear Total Cost identified.", false);
            }
        }
    }

    private void checkTimelineFeasibility(StructuredDPR dpr, ValidationReport report) {
        String timeline = dpr.getSections().get(com.mdoner.backend.entity.DprSection.TIMELINE.name());
        if (timeline != null && timeline.length() < 50) {
            report.addIssue("Timeline section appears too brief for a comprehensive DPR.", false);
        }
    }
}
