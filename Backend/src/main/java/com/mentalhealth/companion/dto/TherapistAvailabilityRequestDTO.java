package com.mentalhealth.companion.dto;

import java.time.LocalDate;
import java.time.LocalTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TherapistAvailabilityRequestDTO{

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

}