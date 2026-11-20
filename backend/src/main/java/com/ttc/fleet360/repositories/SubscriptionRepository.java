package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.Subscription;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    Optional<Subscription> findBySubscriptionCode(String subscriptionCode);

    List<Subscription> findByEndDateBetweenOrderByEndDateAsc(LocalDate fromDate, LocalDate toDate);

    @Query("SELECT s FROM Subscription s WHERE " +
           "(:search IS NULL OR LOWER(s.companyName) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "OR LOWER(s.subscriptionCode) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:status IS NULL OR s.status = :status)")
    Page<Subscription> searchSubscriptions(@Param("search") String search, @Param("status") String status, Pageable pageable);

    long countByStatus(String status);
}
