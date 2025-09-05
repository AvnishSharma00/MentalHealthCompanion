package com.mentalhealth.companion.dto;

import java.time.LocalDate;

import jakarta.annotation.Generated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class updateProfileDTO {
    private String username;
    private LocalDate dateOfBirth;
}
