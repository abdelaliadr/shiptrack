package com.shiptrack.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shiptrack.models.Shipment;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long>{
	
	List<Shipment> findByOwnerId(Long ownerId);

}
