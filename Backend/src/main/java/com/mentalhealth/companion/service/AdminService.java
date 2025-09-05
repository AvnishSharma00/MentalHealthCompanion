package com.mentalhealth.companion.service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.mentalhealth.companion.EnumFolder.Role;
import com.mentalhealth.companion.EnumFolder.TherapistStatus;
import com.mentalhealth.companion.dto.AppUserResponseDTO;
import com.mentalhealth.companion.dto.TherapistResponseDTO;
import com.mentalhealth.companion.dto.UpdateStatusDTO;
import com.mentalhealth.companion.entity.AppUser;
import com.mentalhealth.companion.entity.Therapist;
import com.mentalhealth.companion.exception.ApiException;
import com.mentalhealth.companion.repository.AppUserRepository;
import com.mentalhealth.companion.repository.TherapistRepository;
import jakarta.transaction.Transactional;

@Service
public class AdminService {
   @Autowired
   private TherapistRepository therapistRepository;
   @Autowired
   private AppUserRepository appUserRepository;

   @Autowired
   private TherapistService therapistService;
 @Transactional
public TherapistResponseDTO updateTherapistStatus(Long id, UpdateStatusDTO dto) {
    Therapist therapist = therapistRepository.findById(id)
            .orElseThrow(() -> new ApiException("Therapist not found", "THERAPIST_NOT_FOUND"));

    TherapistStatus currentStatus = therapist.getStatus();
    TherapistStatus newStatus = dto.getStatus();

    if (!TherapistStatus.PENDING.equals(currentStatus)) {
        throw new ApiException("Therapist already reviewed", "ALREADY_REVIEWED");
    }

    if (TherapistStatus.APPROVED.equals(newStatus)) {
        therapist.setStatus(TherapistStatus.APPROVED);
        therapist.setApprovedAt(LocalDateTime.now());
    } else if (TherapistStatus.REJECTED.equals(newStatus)) {
        therapist.setStatus(TherapistStatus.REJECTED);
        therapist.setRejectionReason(dto.getReason()); // optional
    } else {
        throw new ApiException("Invalid status", "INVALID_STATUS");
    }

    therapistRepository.save(therapist);
    return therapistService.convertTherapistResponseDTO(therapist.getUser(), therapist);
}

public void makeUserAdmin( Long id){
    if (id == null) {
        throw new ApiException("User ID is null", "ID_IS_NULL");
    }

    AppUser user = appUserRepository.findById(id)
            .orElseThrow(() -> new ApiException("User not found", "USER_NOT_FOUND"));

    if (user.getRole() == Role.ADMIN) {
        throw new ApiException("User is already an admin", "ALREADY_ADMIN");
    }

    user.setRole(Role.ADMIN);
    appUserRepository.save(user);
}

public List<AppUserResponseDTO> getAllUser(){
    
      List<AppUser> users = appUserRepository.findByRole(Role.USER);
            if(users.isEmpty()){
                {
                throw new ApiException("There IS NO USER","NO_USER_FOUND");
            }
            }
            return users.stream()
    .map(user -> AppUserResponseDTO.builder()
        .user_id(user.getUser_id())
        .username(user.getUsername())
        .email(user.getEmail())
        .role(user.getRole().name())
        .dateOfBirth(user.getDateOfBirth())
        .gender(user.getGender())
        .imageUrl(user.getImageUrl())
        .createdAt(user.getCreatedAt())
        .updatedAt(user.getUpdatedAt())
        .build()
    )
    .collect(Collectors.toList());

             
            
}
 public List<TherapistResponseDTO> getAllTherapist(){
       
    
       List<Therapist> therapists=therapistRepository.findAll();
            if(therapists.isEmpty()){
                throw new ApiException("There IS NO THERAPIST","NO_THERAPIST_FOUND");
            }
            return therapists.stream().map(t->{AppUser user=t.getUser();
            return new TherapistResponseDTO(
            user.getUser_id(),
            user.getUsername(),
            user.getEmail(),
            user.getGender(),
            user.getImageUrl(),
            t.getSpecialization(),
            t.getContactNumber(),
            t.getLicenseNumber(),
            t.getQualification(),
            t.getDocumentUrl(),
            t.getStatus(),
            t.getApprovedAt()
            );}).collect(Collectors.toList());

 }

}
    
