package com.mdoner.backend.service;

import com.mdoner.backend.entity.DprDocument;
import com.mdoner.backend.repository.DprRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DprProcessingServiceTest {

    @Mock
    private StorageService storageService;
    @Mock
    private PdfExtractionService extractionService;
    @Mock
    private StructureMapper structureMapper;
    @Mock
    private RuleEngineService ruleEngine;
    @Mock
    private DprRepository dprRepository;
    @Mock
    private ScoringService scoringService;
    @Mock
    private DprAsyncProcessor asyncProcessor;

    @InjectMocks
    private DprProcessingService dprProcessingService;

    @Test
    public void testProcessAsync_Success() throws Exception {
        // Setup Mocks
        DprDocument doc = new DprDocument("test.pdf", "storage-ref");
        doc.setJobId("JOB-123");
        doc.setId(java.util.UUID.randomUUID());

        // Execute
        dprProcessingService.initiateProcessing(
                new org.springframework.mock.web.MockMultipartFile("file", "test.pdf", "application/pdf", new byte[0]));

        // Verify Interaction
        verify(asyncProcessor).processAsync(any());
    }
}
