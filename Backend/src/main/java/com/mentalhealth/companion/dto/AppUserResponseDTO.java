package com.mentalhealth.companion.dto;
import java.time.LocalDate;
import java.time.LocalDateTime;

import com.mentalhealth.companion.EnumFolder.Role;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class AppUserResponseDTO {
    private Long user_id;
    private String username;
    private String email;
    private String role;
    private LocalDate dateOfBirth;
    private String gender;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
