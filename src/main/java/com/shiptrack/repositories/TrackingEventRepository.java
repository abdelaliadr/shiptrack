package com.shiptrack.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shiptrack.models.TrackingEvent;

@Repository
public interface TrackingEventRepository extends JpaRepository<TrackingEvent, Long>{

}
