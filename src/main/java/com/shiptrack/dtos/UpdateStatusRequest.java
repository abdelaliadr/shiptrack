package com.shiptrack.dtos;

import com.shiptrack.models.ShipmentStatus;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateStatusRequest {

	private ShipmentStatus status;
	
	private String location;
	
	private String note;
}
