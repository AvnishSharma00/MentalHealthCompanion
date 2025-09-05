package com.mentalhealth.companion.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

import org.hibernate.annotations.CreationTimestamp;

import com.mentalhealth.companion.EnumFolder.AppointmentStatus;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Appointment {
   
     @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private AppUser user;

    @ManyToOne
    @JoinColumn(name = "therapist_id")
    private Therapist therapist;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status; // REQUESTED, APPROVED, REJECTED, CANCELLED

    private String rejectionReason;

    @CreationTimestamp
    private LocalDateTime requestedAt;

    private LocalDateTime approvedAt;
}
