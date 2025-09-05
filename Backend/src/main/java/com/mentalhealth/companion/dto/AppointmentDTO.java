
package com.mentalhealth.companion.dto;

import com.mentalhealth.companion.EnumFolder.AppointmentStatus;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AppointmentDTO {

    private Long appointmentId;

    private Long userId;
    private String userName;       // optional convenience field

    private Long therapistId;
    private String therapistName;  // optional convenience field

    


   
   
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

   
    private AppointmentStatus status; // REQUESTED, APPROVED, REJECTED, CANCELLED

    private String rejectionReason;

   
    private LocalDateTime requestedAt;

    private LocalDateTime approvedAt;

}