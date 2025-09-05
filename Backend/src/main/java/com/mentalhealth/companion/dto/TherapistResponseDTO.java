package com.mentalhealth.companion.dto;

import java.time.LocalDateTime;

import com.mentalhealth.companion.EnumFolder.TherapistStatus;

//import org.hibernate.annotations.CreationTimestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TherapistResponseDTO {

    private Long user_id;
    private String username;
    private String email;
    private String gender;
    private String imageUrl;
    private String specialization;
    private String contactNumber;
    private String licenseNumber;
    private String qualification;
    private String documentUrl;
    private TherapistStatus status;
    private LocalDateTime approvedAt;

    
}
