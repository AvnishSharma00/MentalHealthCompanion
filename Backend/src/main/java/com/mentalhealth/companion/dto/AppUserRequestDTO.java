package com.mentalhealth.companion.dto;
import java.time.LocalDate;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
@Getter 
@Setter
public class AppUserRequestDTO {


    private Long user_id;
    @NotBlank(message = "Username is required")
    private String username;
    @Email(message = "Email format is invalid") 
    private String email;
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    @NotNull(message = "Date of birth is required")
    private LocalDate dateOfBirth;
    @NotBlank(message = "Gender is required")
    private String gender;

}
