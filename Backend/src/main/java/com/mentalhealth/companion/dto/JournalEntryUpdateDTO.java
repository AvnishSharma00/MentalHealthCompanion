package com.mentalhealth.companion.dto;

import lombok.Data;

@Data
public class JournalEntryUpdateDTO {
    private String additionalContent; // instead of replacing, this will be appended
    private String newTitle;          // optional: update title
    private String mood;              // optional: update 
}
