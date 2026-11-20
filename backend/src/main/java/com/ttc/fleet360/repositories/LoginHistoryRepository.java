package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.LoginHistory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {
    Page<LoginHistory> findAllByOrderByTimestampDesc(Pageable pageable);
    List<LoginHistory> findByEmailOrderByTimestampDesc(String email);
    List<LoginHistory> findTop10ByOrderByTimestampDesc();
}
