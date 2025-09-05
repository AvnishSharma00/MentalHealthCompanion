package com.mentalhealth.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.mentalhealth.companion.EnumFolder.Role;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "app_user")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long user_id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 50)
    private String username;  // optional, can fallback to Google name

    @JsonIgnore
    private String password;  // null for Google accounts

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    private LocalDate dateOfBirth; // optional for Google users

    private String gender; // optional for Google users

    private String picture; // Google profile pic

    private String provider; // e.g. GOOGLE, LOCAL

    @CreationTimestamp
    private LocalDateTime createdAt;

    private String imageUrl;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
