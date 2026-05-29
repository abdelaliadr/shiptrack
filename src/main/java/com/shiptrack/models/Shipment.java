package com.shiptrack.models;

import java.math.BigDecimal;
import java.util.Date;


import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name= "shipments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Shipment {
	@Id
	@GeneratedValue(strategy= GenerationType.IDENTITY)
	private Long id;
	
	@Column(nullable= false, unique =true)
	private int trackingCode;
	
	@Column(nullable = false, length = 50)
	private String senderName;
	
	@Column(length = 20)
	private String senderPhone;
	
	@Column(nullable = false, length = 150)
	private String senderAddress;
	
	@Column(nullable= false, length = 20)
	private String senderCity;
	
	@Column(nullable = false, length = 50)
	private String receiverName;
	
	@Column(nullable= false, length = 20)
	private String receiverPhone;
	
	@Column(nullable= false, length = 150)
	private String receiverAddress;
	
	@Column(nullable= false, length = 20)
	private String receiverCity;
	
	@Column(precision = 6, scale = 2)
    private BigDecimal weightKg;
	
	@Column(nullable= false, length = 200)
	private String description;
	
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    @Builder.Default
    private ShipmentStatus status = ShipmentStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "agent_id")
    private User agent;
	
	@CreationTimestamp
	@Column(nullable = false, updatable = false)
	private Date createdAt;
	
	@UpdateTimestamp
	@Column(nullable = false)
	private Date updatedAt;
	
	
	private Date deliveredAt;

}
