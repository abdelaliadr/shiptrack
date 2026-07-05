package com.shiptrack.dtos;

import java.time.LocalDateTime;

import com.shiptrack.models.ShipmentStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TrackingEventResponse {
	
	private ShipmentStatus status;
	private String note;
	private String location;
	private LocalDateTime createdAt;
}
