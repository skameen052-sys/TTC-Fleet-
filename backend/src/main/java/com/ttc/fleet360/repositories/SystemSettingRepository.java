package com.ttc.fleet360.repositories;

import com.ttc.fleet360.entities.SystemSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SystemSettingRepository extends JpaRepository<SystemSetting, Long> {
    Optional<SystemSetting> findBySettingKey(String settingKey);
    List<SystemSetting> findBySettingGroup(String settingGroup);
    List<SystemSetting> findByIsPublicTrue();
}
