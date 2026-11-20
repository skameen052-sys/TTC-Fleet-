package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.BranchUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BranchUserRepository extends JpaRepository<BranchUser, Long> {
    List<BranchUser> findByBranchId(Long branchId);
    List<BranchUser> findByUserId(Long userId);
    Optional<BranchUser> findByBranchIdAndUserId(Long branchId, Long userId);
    void deleteByBranchIdAndUserId(Long branchId, Long userId);
}
