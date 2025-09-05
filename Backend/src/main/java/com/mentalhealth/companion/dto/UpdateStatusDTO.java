package com.mentalhealth.companion.dto;

import com.mentalhealth.companion.EnumFolder.TherapistStatus;

import lombok.Data;

@Data
public class UpdateStatusDTO {
    private TherapistStatus status;  // "APPROVED", "REJECTED"
    private String reason;  // Optional, for rejection
}
