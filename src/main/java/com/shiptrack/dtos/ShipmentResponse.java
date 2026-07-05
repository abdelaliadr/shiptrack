package com.shiptrack.dtos;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Date;

import com.shiptrack.models.ShipmentStatus;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ShipmentResponse {
	
	 public ShipmentResponse(Long id2, String senderName2, String senderCity2, String receiverName2,
			String receiverCity2, BigDecimal weightKg2, ShipmentStatus status2, Date createdAt2) {
		// TODO Auto-generated constructor stub
	}
	private Long id;
	    private String senderName;
	    private String senderCity;
	    private String receiverName;
	    private String receiverCity;
	    private BigDecimal weightKg;
	    private ShipmentStatus status;
	    private LocalDateTime createdAt;
}
