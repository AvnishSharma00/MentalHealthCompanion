package com.mentalhealth.companion.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

import org.hibernate.annotations.UpdateTimestamp;

import com.mentalhealth.companion.EnumFolder.Mood;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JournalEntry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private AppUser user;
    
    private String aiCopingTip;
    
    private String title;
    

    @Lob
    @Column(columnDefinition = "LONGTEXT" ,nullable=false)
    private String content;

    @Enumerated(EnumType.STRING)
     @Column(nullable = false)
    private Mood mood; // Mood is part of the journal entry

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}
