package com.fleet360.repository;

import com.fleet360.model.VehicleDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<VehicleDocument, Long> {
    List<VehicleDocument> findByStatus(String status);
    List<VehicleDocument> findByExpiryDateBefore(LocalDate date);
}
