package com.mentalhealth.companion.service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import com.mentalhealth.companion.dto.JournalEntryDTO;
import com.mentalhealth.companion.dto.JournalEntryResponseDTO;
import com.mentalhealth.companion.entity.AppUser;
import com.mentalhealth.companion.entity.JournalEntry;
import com.mentalhealth.companion.exception.ApiException;
import com.mentalhealth.companion.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import com.mentalhealth.companion.EnumFolder.Mood;
import com.mentalhealth.companion.repository.JournalEntryRepository;
@Service
@RequiredArgsConstructor
@Slf4j
public class JournalEntryService {
    
    private final  AppUserRepository appUserRepository;
    private final  JournalEntryRepository journalEntryRepository;
    //private final AiCopingTipRepository aiCopingTipRepository;
   // private final RestTemplate restTemplate = new RestTemplate();



    
      public void createJournalEntry(JournalEntryDTO dto,String username) {
        // Get authenticated user's email
       // this should be the email or username

        AppUser user = appUserRepository.findByEmail(username).orElseThrow(()-> new ApiException("USER NOT FOUND","USER_NOT_FOUND"));
    
        JournalEntry entry = JournalEntry.builder()
                .user(user)
                .content(dto.getContent())
                .title(dto.getTitle())
                .mood(dto.getMood())
                .timestamp(LocalDateTime.now())
                .build();
      journalEntryRepository.save(entry);
   
    
    }

    

      public List<JournalEntryResponseDTO> getEntriesForCurrentUser() {
        // Get the currently logged-in user's email
     String username  = SecurityContextHolder.getContext().getAuthentication().getName();


        // Fetch the AppUser by email
        AppUser user = appUserRepository.findByEmail(username).orElseThrow(()-> new ApiException("USER NOT FOUND","USER_NOT_FOUND"));

        // Return all journal entries for this user
           return journalEntryRepository.findByUserOrderByTimestampDesc(user).stream()
                .map(entry -> JournalEntryResponseDTO.builder()
                       // .id(entry.getId())
                       .id(entry.getId())
                       .title(entry.getTitle())
                        .content(entry.getContent())
                        .mood(entry.getMood())
                        .timestamp(entry.getTimestamp())
                        .build())
                .collect(Collectors.toList());
    }
    
    public void deleteJournalEntry(Long entryId) {
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    String username = authentication.getName();

    AppUser user = appUserRepository.findByEmail(username).orElseThrow(()-> new ApiException("USER NOT FOUND","USER_NOT_FOUND"));
    if (user == null) {
        throw new ApiException("User not found", "USER_NOT_FOUND");
    }

    JournalEntry entry = journalEntryRepository.findById(entryId)
            .orElseThrow(() -> new ApiException("Journal entry not found", "ENTRY_NOT_FOUND"));

    // Check if this journal entry belongs to the logged-in user
    if (!entry.getUser().getUser_id().equals(user.getUser_id())) {
        throw new ApiException("Unauthorized to delete this entry", "UNAUTHORIZED_DELETE");
    }

    journalEntryRepository.delete(entry);
}
// private String generateCopingTips(String journalText, Mood mood) {
//         HttpHeaders headers = new HttpHeaders();
//         headers.setContentType(MediaType.APPLICATION_JSON);
//         headers.setBearerAuth(apiKey);

//         Map<String, Object> body = new HashMap<>();
//         body.put("model", model);
//         body.put("messages", List.of(
//                 Map.of("role", "system", "content", "You are a compassionate mental health assistant."),
//                 Map.of("role", "user", "content", "Mood: " + mood + "\nJournal: " + journalText + "\nPlease give 3 simple coping tips tailored to this mood and entry.")
//         ));

//         HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
//         ResponseEntity<Map> response = restTemplate.postForEntity(apiUrl, request, Map.class);
//         List<Map<String, Object>> choices = (List<Map<String, Object>>) response.getBody().get("choices");

//         return (String) ((Map<String, Object>) choices.get(0).get("message")).get("content");
//     }

public JournalEntryResponseDTO getJournalEntryById(Long id) {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();

    AppUser user = appUserRepository.findByEmail(username).orElseThrow(()-> new ApiException("USER NOT FOUND","USER_NOT_FOUND"));
    JournalEntry entry = journalEntryRepository.findById(id)
            .orElseThrow(() -> new ApiException("Journal entry not found", "ENTRY_NOT_FOUND"));

    if (!entry.getUser().getUser_id().equals(user.getUser_id())) {
        throw new ApiException("Unauthorized access to journal entry", "UNAUTHORIZED_ACCESS");
    }

    return convertResponseDTO(entry);
}

public JournalEntryResponseDTO convertResponseDTO(JournalEntry entry){
  return JournalEntryResponseDTO.builder()
                                 .id(entry.getId())
                                 .title(entry.getTitle())
                                .content(entry.getContent())
                                .mood(entry.getMood())
                                .timestamp(entry.getTimestamp())
                                .build();
}



public List<JournalEntryResponseDTO> searchByMoodAndDate(String moodenum, LocalDate date) {
    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    AppUser user = appUserRepository.findByEmail(username).orElseThrow(()-> new ApiException("USER NOT FOUND","USER_NOT_FOUND"));
    if (user == null) {
        throw new ApiException("User not found", "USER_NOT_FOUND");
    }
    
     
    List<JournalEntry> entries;

     Mood mood = null;
    if (moodenum != null && !moodenum.trim().isEmpty()) {
        try {
            mood = Mood.valueOf(moodenum.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ApiException("Invalid mood value: " + moodenum, "INVALID_MOOD");
        }
    }


    if (mood != null && date != null) {
        entries = journalEntryRepository.findByUserAndMoodAndDate(user, mood, date);
    } else if (mood != null) {
        entries = journalEntryRepository.findByUserAndMood(user, mood);
    } else if (date != null) {
        entries = journalEntryRepository.findByUserAndDate(user, date);
    } else {
        entries = journalEntryRepository.findByUserOrderByTimestampDesc(user);
    }

    return entries.stream().map(this::convertResponseDTO).toList();
}


public JournalEntryResponseDTO updateJournalEntry(Long id, JournalEntryDTO dto) {
    JournalEntry entry = journalEntryRepository.findById(id)
            .orElseThrow(() -> new ApiException("Journal entry not found", "ENTRY_NOT_FOUND"));

    String username = SecurityContextHolder.getContext().getAuthentication().getName();
    if (!entry.getUser().getEmail().equals(username)) {
        throw new ApiException("Unauthorized", "UNAUTHORIZED");
    }

    // Append content instead of replacing
    if (dto.getContent() != null) entry.setContent(dto.getContent()); ;
      

    
    // Optional updates
    if (dto.getTitle() != null) entry.setTitle(dto.getTitle());

    // if (dto.getMood() != null) {
    //     try {
    //         entry.setMood(Mood.valueOf(dto.getMood().trim().toUpperCase()));
    //     } catch (IllegalArgumentException e) {
    //         throw new ApiException("Invalid mood", "INVALID_MOOD");
    //     }
    // }

     if(dto.getMood() != null) entry.setMood(dto.getMood());

    entry.setUpdatedAt(LocalDateTime.now());
    journalEntryRepository.save(entry);

    return convertResponseDTO(entry);
}


}


