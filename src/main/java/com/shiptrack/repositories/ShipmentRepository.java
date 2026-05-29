package com.shiptrack.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shiptrack.models.Shipment;

@Repository
public interface ShipmentRepository extends JpaRepository<Shipment, Long>{

}
