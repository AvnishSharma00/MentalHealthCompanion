package com.mentalhealth.companion.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TherapistAvailabilityResponseDTO {
    private Long slotId;
    private LocalDate date;
    private LocalTime startTime;
    private Boolean isBooked;
    private LocalTime endTime;
}
