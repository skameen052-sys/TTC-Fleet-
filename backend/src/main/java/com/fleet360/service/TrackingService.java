package com.fleet360.service;

import com.fleet360.model.LiveGpsLocation;
import com.fleet360.repository.GpsTrackingRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class TrackingService {
    private final GpsTrackingRepository gpsTrackingRepository;

    public TrackingService(GpsTrackingRepository gpsTrackingRepository) {
        this.gpsTrackingRepository = gpsTrackingRepository;
    }

    public List<LiveGpsLocation> getAllLiveLocations() {
        return gpsTrackingRepository.findAll();
    }

    public LiveGpsLocation updateLocation(@NonNull LiveGpsLocation location) {
        location.setTimestamp(LocalDateTime.now());
        return gpsTrackingRepository.save(location);
    }
}
