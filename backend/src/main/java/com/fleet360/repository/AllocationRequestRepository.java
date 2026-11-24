package com.fleet360.repository;

import com.fleet360.model.AllocationRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AllocationRequestRepository extends JpaRepository<AllocationRequest, Long> {
    Optional<AllocationRequest> findByRequestId(String requestId);
    Optional<AllocationRequest> findByShipmentId(String shipmentId);
    List<AllocationRequest> findByStatus(String status);
}
