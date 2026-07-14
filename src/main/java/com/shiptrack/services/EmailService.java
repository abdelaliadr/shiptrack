package com.shiptrack.services;


import com.shiptrack.models.Shipment;
import com.shiptrack.models.TrackingEvent;
import com.shiptrack.models.User;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Async
    public void sendStatusUpdateEmail(User owner, Shipment shipment, TrackingEvent event) {

        try {
            // Build the Thymeleaf context (variables for the template)
            Context context = new Context();
            context.setVariable("ownerName", owner.getName());
            context.setVariable("shipmentId", shipment.getId());
            context.setVariable("status", event.getStatus().name());
            context.setVariable("location", event.getLocation());
            context.setVariable("note", event.getNote());
            context.setVariable("updatedAt",
                event.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));

            // Render the HTML template
            String html = templateEngine.process("email/status-update", context);

            // Build and send the email
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(owner.getEmail());
            helper.setSubject("Shipment #" + shipment.getId() + " — " + event.getStatus().name());
            helper.setText(html, true);

            mailSender.send(message);
            log.info("Email sent to {} for shipment #{}", owner.getEmail(), shipment.getId());

        } catch (MessagingException e) {
            // Log the error but don't crash the app — email is non-critical
            log.error("Failed to send email to {}: {}", owner.getEmail(), e.getMessage());
        }
    }
}
