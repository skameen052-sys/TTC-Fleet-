package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.Route;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RouteRepository extends JpaRepository<Route, Long> {
    Optional<Route> findByRouteCode(String routeCode);
    List<Route> findByStatus(String status);
}
