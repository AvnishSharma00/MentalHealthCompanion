package com.mentalhealth.companion.controllers;
import java.security.Principal;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mentalhealth.companion.dto.AppUserResponseDTO;
import com.mentalhealth.companion.dto.AppointmentDTO;
import com.mentalhealth.companion.dto.BookAppointmentDTO;
import com.mentalhealth.companion.dto.TherapistAvailabilityResponseDTO;
import com.mentalhealth.companion.dto.TherapistResponseDTO;
import com.mentalhealth.companion.dto.UserProfilePhotoRequestDTO;
import com.mentalhealth.companion.dto.updateProfileDTO;
import com.mentalhealth.companion.service.AppUserService;
import com.mentalhealth.companion.service.AppointmentService;
import com.mentalhealth.companion.service.TherapistService;

@RestController
@RequestMapping("/Therapy")
public class TherapistUserController {

    @Autowired
    private TherapistService therapistService;

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private AppUserService appUserService;


@GetMapping("/availability/therapist")
public ResponseEntity<List<TherapistAvailabilityResponseDTO>> getSlots(Principal principal) {
    return ResponseEntity.ok(therapistService.getSlots(principal.getName()));
}

@GetMapping("/availability/therapist/{id}")
public ResponseEntity<List<TherapistAvailabilityResponseDTO>> getAvailableSlots(@PathVariable Long id) {
    return ResponseEntity.ok(therapistService.getAllAvailableSlots(id));
}

@PostMapping("/appointments/book")
public ResponseEntity<String> bookAppointment(@RequestBody BookAppointmentDTO dto, Principal principal) {
    appointmentService.bookAppointment(principal.getName(), dto);
    return ResponseEntity.ok("Appointment requested successfully");
}
@PutMapping("/appointments/{id}/cancel")
public ResponseEntity<String> cancelAppointment(@PathVariable Long id, Principal principal) {
    appointmentService.cancelAppointment(id, principal.getName());
    return ResponseEntity.ok("Appointment cancelled");
}

@GetMapping("/getAllTherapist")
public ResponseEntity<List<TherapistResponseDTO>> getAllTherapist()
{
    return ResponseEntity.ok(therapistService.getAllTherapist());
}


   @PostMapping("/profilePhoto")
public ResponseEntity<String> profilePhoto(@ModelAttribute UserProfilePhotoRequestDTO dto,
                                           Principal principal) {
    String message = appUserService.setProfilePicture(dto, principal.getName());
    return ResponseEntity.ok(message); // Returns 200 OK with message
}

@GetMapping("/getProfilePhoto")
public ResponseEntity<String> getProfilePhoto(Principal principal){
        String url=   appUserService.getProfilePhoto(principal.getName());
        return ResponseEntity.ok(url);
}


@GetMapping("/getTherapistById/{id}")
public ResponseEntity<TherapistResponseDTO> getTherapistByid(@PathVariable Long id){
    return ResponseEntity.ok(therapistService.getTherapistById(id));
}
@GetMapping("/appointmentList")
public ResponseEntity<List<AppointmentDTO>> getAppointment(
        Principal principal,
        @RequestParam(required = false) String status) { // optional status filter
    return appointmentService.getAppointmentForUser(principal.getName(), status);
}

@GetMapping("/UserDetail")
public ResponseEntity<AppUserResponseDTO> getUserData(Principal principal){
    return appUserService.getUserData(principal.getName());
    
}

@PutMapping("/updateProfile")
public ResponseEntity<String> update(@RequestBody updateProfileDTO dto,Principal principal)
{
    return appUserService.updateProfile(dto,principal.getName());
}

}
