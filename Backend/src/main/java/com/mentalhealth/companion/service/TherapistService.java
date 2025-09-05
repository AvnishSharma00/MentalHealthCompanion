package com.mentalhealth.companion.service;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.mentalhealth.companion.EnumFolder.Role;
import com.mentalhealth.companion.EnumFolder.TherapistStatus;
import com.mentalhealth.companion.dto.TherapistAvailabilityRequestDTO;
import com.mentalhealth.companion.dto.TherapistAvailabilityResponseDTO;
import com.mentalhealth.companion.dto.TherapistResponseDTO;
import com.mentalhealth.companion.dto.TherapistSignupDTO;
import com.mentalhealth.companion.entity.AppUser;
import com.mentalhealth.companion.entity.Therapist;
import com.mentalhealth.companion.entity.TherapistAvailability;
import com.mentalhealth.companion.exception.ApiException;
import com.mentalhealth.companion.repository.AppUserRepository;
import com.mentalhealth.companion.repository.AvailabilityRepository;
import com.mentalhealth.companion.repository.TherapistRepository;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class TherapistService {

     @Autowired
     private AppUserRepository userRepository;

     @Autowired
     private PasswordEncoder passwordEncoder;
     
     @Autowired
     private TherapistRepository therapistRepository;

     @Autowired
     private AvailabilityRepository availabilityRepository;


       public TherapistResponseDTO registerTherapist(TherapistSignupDTO dto) {
        if(userRepository.existsByEmail(dto.getEmail())){
                    throw new ApiException("Email already registered", "EMAIL_ALREADY_EXISTS");
        }
        AppUser user = new AppUser();
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.THERAPIST);
        user.setUsername(dto.getName());
        user.setDateOfBirth(dto.getDateOfBirth());
        user.setGender(dto.getGender());
        user.setProvider("LOCAL");
        userRepository.save(user);

        // 2. Create therapist profile
        Therapist therapist = new Therapist();
        therapist.setUser(user);
        therapist.setSpecialization(dto.getSpecialization());
        therapist.setLicenseNumber(dto.getLicenseNumber());
        therapist.setContactNumber(dto.getContactNumber());
        therapist.setQualification(dto.getQualification());
        therapist.setStatus(TherapistStatus.PENDING);
        therapist.setRegisteredAt(LocalDateTime.now());

        therapistRepository.save(therapist);
        log.debug("User created successfully");
        return convertTherapistResponseDTO(user, therapist);
    }
    
   public TherapistResponseDTO getMyProfile(String email){
    if(!userRepository.existsByEmail(email)){
                    throw new ApiException("YOU DOESN'T EXIST", "EMAIL_NOT_EXISTS");
      }   
       AppUser user=userRepository.findByEmail(email)
       .orElseThrow(() -> new ApiException("user not found", "USER_NOT_FOUND"));
       Therapist therapist=therapistRepository.findByUser(user).orElseThrow(()-> new ApiException("THERAPIST DOESN't EXIST","THERAPIST_DOESN't_EXIST"));
       return convertTherapistResponseDTO(user, therapist);
       
   }


















    public TherapistResponseDTO convertTherapistResponseDTO(AppUser user,Therapist therapist){
          return TherapistResponseDTO.builder()
           .user_id(user.getUser_id())
           .username(user.getUsername())
           .imageUrl(user.getImageUrl())
           .email(user.getEmail())
           .specialization(therapist.getSpecialization())
           .contactNumber(therapist.getContactNumber())
           .licenseNumber(therapist.getLicenseNumber())
           .documentUrl(therapist.getDocumentUrl())
           .qualification(therapist.getQualification())
           .status(therapist.getStatus())
           .approvedAt(therapist.getApprovedAt())
           .build();
               
    }
  //  public void addAvailability(String username, TherapistAvailabilityRequestDTO dto) {
//     AppUser user = userRepository.findByUsername(username);
//     Therapist therapist = therapistRepository.findByUser(user);

//     TherapistAvailability availability = new TherapistAvailability();
//     availability.setTherapist(therapist);
//     availability.setDate(dto.getDate());
//     availability.setStartTime(dto.getStartTime());
//     availability.setEndTime(dto.getEndTime());
//     availability.setBooked(false);

//     availabilityRepository.save(availability);
// }
public void addAvailability(String username, TherapistAvailabilityRequestDTO dto) {
    log.debug(username);
    AppUser user = userRepository.findByEmail(username)
            .orElseThrow(() -> new ApiException("NO USER FOUND", "NO_USER_FOUND"));
    Therapist therapist = therapistRepository.findByUser(user)
            .orElseThrow(() -> new ApiException("NO THERAPIST FOUND", "NO_THERAPIST_FOUND"));

    LocalTime start = dto.getStartTime();
    LocalTime end = dto.getEndTime();

    if (start.isAfter(end) || start.equals(end)) {
        throw new ApiException("Start time must be before end time", "INVALID_TIME_RANGE");
    }

    // fetch all slots already stored for that therapist on that date
    List<TherapistAvailability> existing =
            availabilityRepository.findByTherapistAndDate(therapist, dto.getDate());

    // check overlap
    for (TherapistAvailability avail : existing) {
        if (!(end.isBefore(avail.getStartTime()) || start.isAfter(avail.getEndTime()))) {
            throw new ApiException("Overlapping availability exists", "OVERLAP_FOUND");
        }
    }

    List<TherapistAvailability> slots = new ArrayList<>();

    while (start.plusMinutes(30).compareTo(end) <= 0) {
        TherapistAvailability slot = new TherapistAvailability();
        slot.setTherapist(therapist);
        slot.setDate(dto.getDate());
        slot.setStartTime(start);
        slot.setEndTime(start.plusMinutes(30));
        slot.setIsBooked(false);

        slots.add(slot);
        start = start.plusMinutes(30);
    }

    availabilityRepository.saveAll(slots);
}


public List<TherapistAvailabilityResponseDTO> getAllAvailableSlots(Long id){
     List<TherapistAvailability> slots = availabilityRepository
        .findByTherapistIdAndIsBookedFalseAndDateGreaterThanEqualOrderByDateAscStartTimeAsc(id, LocalDate.now());

    List<TherapistAvailabilityResponseDTO> response = slots.stream()
        .map(slot -> new TherapistAvailabilityResponseDTO(
            slot.getId(),
            slot.getDate(),
            slot.getStartTime(),
            slot.getIsBooked(),
            slot.getEndTime()))
        .collect(Collectors.toList());

    return response;
}

public List<TherapistAvailabilityResponseDTO> getSlots(String email){
    Optional<AppUser> therapist=userRepository.findByEmail(email);
    long id=therapist.get().getUser_id();
     List<TherapistAvailability> slots = availabilityRepository
        .findByTherapistIdAndDateGreaterThanEqualOrderByDateAscStartTimeAsc(id, LocalDate.now());

    List<TherapistAvailabilityResponseDTO> response = slots.stream()
        .map(slot -> new TherapistAvailabilityResponseDTO(
            slot.getId(),
            slot.getDate(),
            slot.getStartTime(),
            slot.getIsBooked(),
            slot.getEndTime()))
        .collect(Collectors.toList());

    return response;
}

public List<TherapistResponseDTO> getAllTherapist() {
    List<Therapist> therapists = therapistRepository.findByStatus(TherapistStatus.APPROVED);

    if (therapists.isEmpty()) {
        throw new ApiException("No therapists found", "NO_THERAPIST_FOUND");
    }

    return therapists.stream()
            .map(therapist -> convertTherapistResponseDTO(
                    therapist.getUser(),
                    therapist
            ))
            .collect(Collectors.toList());
}
public TherapistResponseDTO getTherapistById(Long id){
    Therapist therapist=therapistRepository.findById(id).orElseThrow();
    AppUser appUser=userRepository.findByEmail(therapist.getUser().getEmail()).orElseThrow();
    return convertTherapistResponseDTO(appUser, therapist);
}

}
