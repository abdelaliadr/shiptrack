package com.shiptrack.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


import org.springframework.stereotype.Service;

import com.shiptrack.dtos.CreateShipmentRequest;
import com.shiptrack.dtos.ShipmentDetailResponse;
import com.shiptrack.dtos.ShipmentResponse;
import com.shiptrack.dtos.TrackingEventResponse;
import com.shiptrack.dtos.UpdateStatusRequest;
import com.shiptrack.models.Shipment;
import com.shiptrack.models.ShipmentStatus;
import com.shiptrack.models.TrackingEvent;
import com.shiptrack.models.User;
import com.shiptrack.repositories.ShipmentRepository;
import com.shiptrack.repositories.TrackingEventRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ShipmentService {
	
	private final ShipmentRepository shipmentRepository;
    private final TrackingEventRepository trackingEventRepository;

    // ===== Create a shipment =====
    public ShipmentResponse createShipment(CreateShipmentRequest request, User owner) {

        Shipment shipment = Shipment.builder()
                .senderName(request.getSenderName())
                .senderPhone(request.getSenderPhone())
                .senderAddress(request.getSenderAddress())
                .senderCity(request.getSenderCity())
                .receiverName(request.getReceiverName())
                .receiverPhone(request.getReceiverPhone())
                .receiverAddress(request.getReceiverAddress())
                .receiverCity(request.getReceiverCity())
                .weightKg(request.getWeightKg())
                .description(request.getDescription())
                .status(ShipmentStatus.PENDING)
                .owner(owner)
                .build();

        Shipment savedShipment = shipmentRepository.save(shipment);

        // Create the first tracking event automatically
        TrackingEvent firstEvent = TrackingEvent.builder()
                .shipment(shipment)
                .status(ShipmentStatus.PENDING)
                .note("Shipment created")
                .createdBy(owner)
                .build();

        trackingEventRepository.save(firstEvent);

        return toShipmentResponse(savedShipment);
    }

    // ===== Get all shipments for the logged-in business user =====
    public List<ShipmentResponse> getMyShipments(User owner) {
        return shipmentRepository.findByOwnerId(owner.getId())
                .stream()
                .map(this::toShipmentResponse)
                .toList();
    }

    // ===== Public tracking by ID =====
    public ShipmentDetailResponse getShipmentById(Long id) {

        Shipment shipment = shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));

        List<TrackingEvent> events = trackingEventRepository.findByShipmentIdOrderByCreatedAtAsc(id);

        List<TrackingEventResponse> eventResponses = events.stream()
                .map(e -> new TrackingEventResponse(
                        e.getStatus(),
                        e.getNote(),
                        e.getLocation(),
                        e.getCreatedAt()
                ))
                .toList();

        return new ShipmentDetailResponse(
                shipment.getId(),
                shipment.getSenderName(),
                shipment.getSenderCity(),
                shipment.getReceiverName(),
                shipment.getReceiverCity(),
                shipment.getWeightKg(),
                shipment.getStatus(),
                shipment.getCreatedAt(),
                eventResponses
        );
    }
    
    
    public ShipmentResponse updateStatus(Long shipmentId, UpdateStatusRequest request, User updatedBy) {
    	Shipment shipment = shipmentRepository.findById(shipmentId)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
    	
    	shipment.setStatus(request.getStatus());
    	
    	if(request.getStatus() == ShipmentStatus.DELIVERED) {
    		shipment.setDeliveredAt(LocalDateTime.now());
    	}
    	
    	Shipment savedShipment = shipmentRepository.save(shipment);
    	
    	//creating new event after status update
    	TrackingEvent event = TrackingEvent.builder()
                .shipment(savedShipment)
                .status(request.getStatus())
                .note(request.getNote())
                .location(request.getLocation())
                .createdBy(updatedBy)
                .build();
    	
    	trackingEventRepository.save(event);
    	
    	return toShipmentResponse(shipment);
    }

    // ===== Helper: Entity → simple response =====
    private ShipmentResponse toShipmentResponse(Shipment shipment) {
        return new ShipmentResponse(
                shipment.getId(),
                shipment.getSenderName(),
                shipment.getSenderCity(),
                shipment.getReceiverName(),
                shipment.getReceiverCity(),
                shipment.getWeightKg(),
                shipment.getStatus(),
                shipment.getCreatedAt()
        );
    }
	
}
