package com.mdoner.backend.service;

import com.mdoner.backend.dto.StructuredDPR;
import com.mdoner.backend.entity.DprSection;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class StructureMapper {

        private String normalize(String text) {
                if (text == null)
                        return "";
                // Remove common numbering/bullet patterns at start of lines (e.g., 1.1, a),
                // (i))
                // And unify whitespace
                return text.replaceAll("(?m)^[\\d\\.\\s\\-a-zA-Z\\)\\(]{1,10}(?=\\s[A-Z])", "")
                                .replaceAll("\\s+", " ")
                                .trim();
        }

        public StructuredDPR mapToStructure(String dprId, String rawText) {
                Map<String, String> extractedSections = new HashMap<>();
                String normalizedText = normalize(rawText);
                boolean isComplete = true;

                DprSection[] sections = DprSection.values();
                for (int i = 0; i < sections.length; i++) {
                        DprSection section = sections[i];

                        // Build regex from label + aliases
                        StringBuilder patternBuilder = new StringBuilder("(?i)(");
                        patternBuilder.append(Pattern.quote(section.getLabel()));
                        for (String alias : section.getAliases()) {
                                patternBuilder.append("|").append(Pattern.quote(alias));
                        }
                        patternBuilder.append(")");

                        // Lookahead for next section header or end of string
                        StringBuilder lookaheadBuilder = new StringBuilder("(?=(");
                        for (int j = i + 1; j < sections.length; j++) {
                                lookaheadBuilder.append(Pattern.quote(sections[j].getLabel())).append("|");
                                for (String alias : sections[j].getAliases()) {
                                        lookaheadBuilder.append(Pattern.quote(alias)).append("|");
                                }
                        }
                        lookaheadBuilder.append("$))");

                        Pattern pattern = Pattern.compile(
                                        patternBuilder.toString() + "(.*?)" + lookaheadBuilder.toString(),
                                        Pattern.DOTALL);
                        Matcher matcher = pattern.matcher(normalizedText);

                        if (matcher.find()) {
                                String content = matcher.group(2).trim();
                                extractedSections.put(section.name(), content);
                        } else if (section.isMandatory()) {
                                isComplete = false;
                        }
                }

                StructuredDPR structured = new StructuredDPR(dprId, rawText, extractedSections);
                structured.setComplete(isComplete);
                return structured;
        }
}
