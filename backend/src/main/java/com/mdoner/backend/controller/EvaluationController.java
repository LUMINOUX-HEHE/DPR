package com.mdoner.backend.controller;

import com.mdoner.backend.repository.DprRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/evaluation")
@CrossOrigin(origins = "*")
public class EvaluationController {

    private final DprRepository dprRepository;
    private final com.mdoner.backend.service.OpenRouterScrutinyService scrutinyService;

    @Autowired
    public EvaluationController(DprRepository dprRepository,
            com.mdoner.backend.service.OpenRouterScrutinyService scrutinyService) {
        this.dprRepository = dprRepository;
        this.scrutinyService = scrutinyService;
    }

    /**
     * Trigger AI Scrutiny for a specific DPR.
     * PRE-CONDITION: DPR must be already ingested and validated (Rule-Based).
     */
    @PostMapping("/scrutinize/{dprId}")
    public ResponseEntity<Object> triggerScrutiny(@PathVariable UUID dprId) {
        return dprRepository.findById(dprId)
                .map(dprDoc -> {
                    // Call AI Interface
                    String aiResponse = "Processing...";
                    try {
                        // NOTE: dprDoc needs extracted text populated for accurate results.
                        // If allText is null, the service returns an error JSON properly.
                        aiResponse = scrutinyService.scrutinize(dprDoc).get();
                    } catch (Exception e) {
                        aiResponse = "{\"error\": \"AI Execution Interrupted: " + e.getMessage() + "\"}";
                    }

                    Map<String, Object> response = new HashMap<>();
                    response.put("status", "COMPLETED");
                    response.put("message", "Scrutiny initiated successfully.");
                    response.put("ai_assessment", aiResponse);

                    return ResponseEntity.ok((Object) response);
                })
                .orElse(ResponseEntity.notFound().build());
    }
}
