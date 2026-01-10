package com.mdoner.backend.repository;

import com.mdoner.backend.entity.DprDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface DprRepository extends JpaRepository<DprDocument, UUID> {
    DprDocument findByStorageReference(String storageReference);
}
