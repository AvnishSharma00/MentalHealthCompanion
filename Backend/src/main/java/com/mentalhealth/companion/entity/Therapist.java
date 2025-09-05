package com.mentalhealth.companion.entity;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;

import com.mentalhealth.companion.EnumFolder.TherapistStatus;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Therapist {
    @Id
    private Long id;
    private String specialization;
    private String contactNumber;
    @OneToOne
    @MapsId
    @JoinColumn(name = "id") 
    private AppUser user;
    private String licenseNumber;
    private String qualification;
    private String documentUrl;
     @Enumerated(EnumType.STRING)
     @Column(nullable = false)
    private TherapistStatus status; // PENDING, APPROVED, REJECTED
    private String rejectionReason;
    @CreationTimestamp
    private LocalDateTime registeredAt;
    private LocalDateTime approvedAt;

}