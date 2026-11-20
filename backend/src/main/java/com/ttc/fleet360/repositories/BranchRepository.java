package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.Branch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BranchRepository extends JpaRepository<Branch, Long> {
    Optional<Branch> findByBranchCode(String branchCode);
    boolean existsByBranchCode(String branchCode);

    @Query("SELECT b FROM Branch b WHERE " +
           "(:search IS NULL OR LOWER(b.branchName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(b.city) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(b.branchCode) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR b.status = :status)")
    Page<Branch> searchBranches(@Param("search") String search, @Param("status") String status, Pageable pageable);

    long countByStatus(String status);
}
