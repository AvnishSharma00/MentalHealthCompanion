package com.mentalhealth.companion.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TherapistSignupDTO {
    @Email(message = "Email format is invalid")
    private String email;
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    @NotBlank(message = "Username is required")
    private String name;
    
    private LocalDate dateOfBirth;

    private String gender;

    @NotBlank(message = "Specilization is required")
    private String specialization;
    @NotBlank(message = "LicenseNumber is required")
    private String licenseNumber;
    @NotBlank(message = "Contact Number is required")
    private String contactNumber;
    @NotBlank(message = "Qualification  is required")
    private String qualification;
}
