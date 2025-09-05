package com.mentalhealth.companion.dto;

import com.mentalhealth.companion.EnumFolder.AppointmentStatus;

import lombok.Data;

@Data
public class UpdateAppointmentStatusDTO {
    private AppointmentStatus status; // APPROVED or REJECTED
// optional for rejection
}
