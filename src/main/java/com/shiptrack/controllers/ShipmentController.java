package com.shiptrack.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shiptrack.config.UserPrincipal;
import com.shiptrack.dtos.CreateShipmentRequest;
import com.shiptrack.dtos.ShipmentDetailResponse;
import com.shiptrack.dtos.ShipmentResponse;
import com.shiptrack.dtos.UpdateStatusRequest;
import com.shiptrack.models.User;
import com.shiptrack.services.ShipmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/shipments")
@RequiredArgsConstructor
public class ShipmentController {

    private final ShipmentService shipmentService;

    // Only BUSINESS users can create shipments
    @PostMapping
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<ShipmentResponse> createShipment(
            @RequestBody CreateShipmentRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        ShipmentResponse response = shipmentService.createShipment(request, principal.getUser());
        return ResponseEntity.ok(response);
    }

    // Only BUSINESS users can see their own shipments
    @GetMapping("/my")
    @PreAuthorize("hasRole('BUSINESS')")
    public ResponseEntity<List<ShipmentResponse>> getMyShipments(
            @AuthenticationPrincipal UserPrincipal principal) {

        return ResponseEntity.ok(shipmentService.getMyShipments(principal.getUser()));
    }

    // Public — anyone can track a shipment by ID, no login needed
    @GetMapping("/{id}")
    public ResponseEntity<ShipmentDetailResponse> getShipmentById(@PathVariable Long id) {
        return ResponseEntity.ok(shipmentService.getShipmentById(id));
       
    }
    
    // Agent and Admins can change the status on the shipments
    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
    public ResponseEntity<ShipmentResponse> updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest request, @AuthenticationPrincipal UserPrincipal principal){
    	
    	ShipmentResponse response = shipmentService.updateStatus(id, request, principal.getUser());
    	
    	return ResponseEntity.ok(response);
    }
}
