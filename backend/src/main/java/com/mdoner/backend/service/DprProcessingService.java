package com.mdoner.backend.service;

import com.mdoner.backend.entity.DprDocument;
import com.mdoner.backend.repository.DprRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class DprProcessingService {

    private final StorageService storageService;
    private final DprRepository dprRepository;
    private final DprAsyncProcessor asyncProcessor;

    @Autowired
    public DprProcessingService(
            StorageService storageService,
            DprRepository dprRepository,
            DprAsyncProcessor asyncProcessor) {
        this.storageService = storageService;
        this.dprRepository = dprRepository;
        this.asyncProcessor = asyncProcessor;
    }

    /**
     * Initiates the DPR processing pipeline.
     * Returns a Job ID immediately for polling.
     */
    public String initiateProcessing(MultipartFile file) throws Exception {
        // 1. Store File
        String filename = storageService.store(file);

        // 2. Create Initial Record
        DprDocument doc = new DprDocument(file.getOriginalFilename(), filename);
        doc.setStatus(DprDocument.ValidationStatus.UPLOADED);
        doc = dprRepository.save(doc);

        // 3. Trigger Async Processing
        asyncProcessor.processAsync(doc);

        return doc.getJobId();
    }

    // Legacy support or direct call if needed
    public DprDocument getStatus(String jobId) {
        return dprRepository.findAll().stream()
                .filter(d -> jobId.equals(d.getJobId()))
                .findFirst()
                .orElse(null);
    }

    public java.util.List<DprDocument> getAllDocuments() {
        return dprRepository.findAll();
    }

    public void deleteDocument(String jobId) {
        DprDocument doc = getStatus(jobId);
        if (doc != null) {
            dprRepository.delete(doc);
            if (doc.getStorageReference() != null) {
                storageService.delete(doc.getStorageReference());
            }
        }
    }
}
