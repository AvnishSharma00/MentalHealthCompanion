package com.mentalhealth.companion.entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;
import org.hibernate.annotations.CreationTimestamp;
import jakarta.persistence.Entity;

@Entity
@Getter
@Setter
public class AICopingTip {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;

    private String moodCategory;
    
    @Lob
    private String tipText;
    
    @CreationTimestamp
    private LocalDateTime generatedOn;

    @ManyToOne
    private AppUser user;
}
