package com.shiptrack.dtos;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateShipmentRequest {
	

	private String senderName;
	

	private String senderPhone;
	

	private String senderAddress;
	
	
	private String senderCity;
	
	
	private String receiverName;
	
	
	private String receiverPhone;
	
	
	private String receiverAddress;
	
	
	private String receiverCity;
	
	
    private BigDecimal weightKg;
	
	private String description;

}
