package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.SubscriptionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionPlanRepository extends JpaRepository<SubscriptionPlan, Long> {
    Optional<SubscriptionPlan> findByPlanCode(String planCode);
    List<SubscriptionPlan> findAllByOrderByDisplayOrderAsc();
    List<SubscriptionPlan> findByIsActiveTrueOrderByDisplayOrderAsc();
}
