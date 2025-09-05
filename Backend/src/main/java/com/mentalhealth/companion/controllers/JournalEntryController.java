package com.mentalhealth.companion.controllers;

import java.security.Principal;
import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.mentalhealth.companion.dto.JournalEntryDTO;
import com.mentalhealth.companion.dto.JournalEntryResponseDTO;
import com.mentalhealth.companion.service.JournalEntryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/Journal")
@RequiredArgsConstructor
public class JournalEntryController {
  
   private final JournalEntryService journalEntryService;

     @PostMapping("/create")
    public ResponseEntity<String> createJournal(@RequestBody JournalEntryDTO dto,Principal principal) {
       
        journalEntryService.createJournalEntry(dto,principal.getName());
    
       return ResponseEntity.ok( "Journal entry saved!");
    }

    @GetMapping("/allEntries")
    public ResponseEntity<List<JournalEntryResponseDTO>> getAll(){
        return ResponseEntity.ok(journalEntryService.getEntriesForCurrentUser());
    }
    
    @GetMapping("/getEntryBYId/{id}")
    
        public ResponseEntity<JournalEntryResponseDTO> getEntryById(@PathVariable Long id){
            return ResponseEntity.ok(journalEntryService.getJournalEntryById(id));
        }
    

    @DeleteMapping("/remove-entry/{id}")
    public ResponseEntity<String> deleteJournalEntry(@PathVariable Long id){
         journalEntryService.deleteJournalEntry(id);
          return ResponseEntity.ok( "Journal entry Deleted Successfully");
    }
     

    @GetMapping("/search")
public ResponseEntity<List<JournalEntryResponseDTO>> searchByMoodAndDate(
        @RequestParam(required = false) String mood,
        @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
) {
    List<JournalEntryResponseDTO> results = journalEntryService.searchByMoodAndDate(mood, date);
    return ResponseEntity.ok(results);
}


@PutMapping("/edit/{id}")
public ResponseEntity<JournalEntryResponseDTO> updateEntry(
        @PathVariable Long id,
        @RequestBody JournalEntryDTO updateDTO
) {
    JournalEntryResponseDTO updated = journalEntryService.updateJournalEntry(id, updateDTO);
    return ResponseEntity.ok(updated);
}

    
}
