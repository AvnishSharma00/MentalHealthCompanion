
package com.mentalhealth.companion.dto;

import lombok.*;
import java.time.LocalDateTime;

import com.mentalhealth.companion.EnumFolder.Mood;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JournalEntryResponseDTO {
    private Long id;
    private String content;
    private String title;
    private Mood mood;
    private LocalDateTime timestamp;

}
