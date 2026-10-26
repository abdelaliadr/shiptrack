package com.shiptrack.services;

import com.shiptrack.dtos.CreateShipmentRequest;
import com.shiptrack.dtos.ShipmentDetailResponse;
import com.shiptrack.dtos.ShipmentResponse;
import com.shiptrack.dtos.UpdateStatusRequest;
import com.shiptrack.models.*;
import com.shiptrack.repositories.ShipmentRepository;
import com.shiptrack.repositories.TrackingEventRepository;
import com.shiptrack.repositories.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ShipmentServiceTest {

    @Mock
    private ShipmentRepository shipmentRepository;

    @Mock
    private TrackingEventRepository trackingEventRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @InjectMocks
    private ShipmentService shipmentService;

    private User businessUser;
    private User agentUser;
    private Shipment testShipment;
    private CreateShipmentRequest createRequest;

    @BeforeEach
    void setUp() {
        businessUser = User.builder()
                .id(1L)
                .name("Ahmed Alaoui")
                .email("ahmed@test.com")
                .role(Role.BUSINESS)
                .isActive(true)
                .build();

        agentUser = User.builder()
                .id(2L)
                .name("Youssef Agent")
                .email("agent@test.com")
                .role(Role.AGENT)
                .isActive(true)
                .build();

        testShipment = Shipment.builder()
                .id(1L)
                .senderName("Ahmed Alaoui")
                .senderPhone("0612345678")
                .senderAddress("123 Rue Mohammed V")
                .senderCity("Rabat")
                .receiverName("Karim Tazi")
                .receiverPhone("0677654321")
                .receiverAddress("12 Rue Allal Ben Abdellah")
                .receiverCity("Fes")
                .weightKg(new BigDecimal("1.2"))
                .status(ShipmentStatus.PENDING)
                .owner(businessUser)
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();

        createRequest = new CreateShipmentRequest();
        createRequest.setSenderName("Ahmed Alaoui");
        createRequest.setSenderPhone("0612345678");
        createRequest.setSenderAddress("123 Rue Mohammed V");
        createRequest.setSenderCity("Rabat");
        createRequest.setReceiverName("Karim Tazi");
        createRequest.setReceiverPhone("0677654321");
        createRequest.setReceiverAddress("12 Rue Allal Ben Abdellah");
        createRequest.setReceiverCity("Fes");
        createRequest.setWeightKg(new BigDecimal("1.2"));
    }

    @Test
    void createShipment_shouldSaveShipmentAndReturnResponse() {
        when(shipmentRepository.save(any(Shipment.class)))
                .thenReturn(testShipment);
        when(trackingEventRepository.save(any(TrackingEvent.class)))
                .thenReturn(new TrackingEvent());

        ShipmentResponse response = shipmentService.createShipment(createRequest, businessUser);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Rabat", response.getSenderCity());
        assertEquals("Fes", response.getReceiverCity());
        assertEquals(ShipmentStatus.PENDING, response.getStatus());

        verify(shipmentRepository, times(1)).save(any(Shipment.class));
    }

    @Test
    void createShipment_shouldCreateFirstTrackingEvent() {
        when(shipmentRepository.save(any(Shipment.class)))
                .thenReturn(testShipment);
        when(trackingEventRepository.save(any(TrackingEvent.class)))
                .thenReturn(new TrackingEvent());

        shipmentService.createShipment(createRequest, businessUser);

        verify(trackingEventRepository, times(1)).save(any(TrackingEvent.class));
    }

    @Test
    void getShipmentById_shouldReturnDetailWithEvents() {
        TrackingEvent event = TrackingEvent.builder()
                .id(1L)
                .shipment(testShipment)
                .status(ShipmentStatus.PENDING)
                .note("Shipment created")
                .createdAt(LocalDateTime.now())
                .build();

        when(shipmentRepository.findById(1L))
                .thenReturn(Optional.of(testShipment));
        when(trackingEventRepository.findByShipmentIdOrderByCreatedAtAsc(1L))
                .thenReturn(List.of(event));

        ShipmentDetailResponse response = shipmentService.getShipmentById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals(1, response.getEvents().size());
        assertEquals(ShipmentStatus.PENDING, response.getEvents().get(0).getStatus());
    }

    @Test
    void getShipmentById_shouldThrowWhenNotFound() {
        when(shipmentRepository.findById(99L))
                .thenReturn(Optional.empty());

        RuntimeException exception = assertThrows(RuntimeException.class,
                () -> shipmentService.getShipmentById(99L));

        assertEquals("Shipment not found", exception.getMessage());
    }

    @Test
    void updateStatus_shouldUpdateStatusAndCreateEvent() {
        UpdateStatusRequest request = new UpdateStatusRequest();
        request.setStatus(ShipmentStatus.PICKED_UP);
        request.setNote("Collected from sender");
        request.setLocation("Rabat");

        Shipment updatedShipment = Shipment.builder()
                .id(1L)
                .senderName(testShipment.getSenderName())
                .senderCity(testShipment.getSenderCity())
                .receiverName(testShipment.getReceiverName())
                .receiverCity(testShipment.getReceiverCity())
                .weightKg(testShipment.getWeightKg())
                .status(ShipmentStatus.PICKED_UP)
                .owner(businessUser)
                .createdAt(testShipment.getCreatedAt())
                .updatedAt(LocalDateTime.now())
                .build();

        TrackingEvent savedEvent = TrackingEvent.builder()
                .id(2L)
                .shipment(updatedShipment)
                .status(ShipmentStatus.PICKED_UP)
                .note("Collected from sender")
                .location("Rabat")
                .createdAt(LocalDateTime.now())
                .build();

        when(shipmentRepository.findById(1L))
                .thenReturn(Optional.of(testShipment));
        when(shipmentRepository.save(any(Shipment.class)))
                .thenReturn(updatedShipment);
        when(trackingEventRepository.save(any(TrackingEvent.class)))
                .thenReturn(savedEvent);
        when(userRepository.findById(businessUser.getId()))
                .thenReturn(Optional.of(businessUser));
        doNothing().when(emailService)
                .sendStatusUpdateEmail(any(), any(), any());

        ShipmentResponse response = shipmentService.updateStatus(1L, request, agentUser);

        assertNotNull(response);
        assertEquals(ShipmentStatus.PICKED_UP, response.getStatus());
        verify(trackingEventRepository, times(1)).save(any(TrackingEvent.class));
        verify(emailService, times(1)).sendStatusUpdateEmail(any(), any(), any());
    }

    @Test
    void updateStatus_shouldSetDeliveredAtWhenStatusIsDelivered() {
        UpdateStatusRequest request = new UpdateStatusRequest();
        request.setStatus(ShipmentStatus.DELIVERED);
        request.setNote("Delivered successfully");
        request.setLocation("Fes");

        when(shipmentRepository.findById(1L))
                .thenReturn(Optional.of(testShipment));
        when(shipmentRepository.save(any(Shipment.class)))
                .thenAnswer(invocation -> {
                    Shipment s = invocation.getArgument(0);
                    assertNotNull(s.getDeliveredAt());
                    return testShipment;
                });
        when(trackingEventRepository.save(any(TrackingEvent.class)))
                .thenReturn(new TrackingEvent());
        when(userRepository.findById(any()))
                .thenReturn(Optional.of(businessUser));
        doNothing().when(emailService)
                .sendStatusUpdateEmail(any(), any(), any());

        shipmentService.updateStatus(1L, request, agentUser);

        verify(shipmentRepository, times(1)).save(argThat(s ->
                s.getDeliveredAt() != null
        ));
    }
}