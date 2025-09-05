package com.mentalhealth.companion.dto;

import com.mentalhealth.companion.EnumFolder.Mood;

import lombok.Data;

@Data
public class JournalEntryDTO {
    private String content;
    private String title;
    private Mood mood;
    
}
