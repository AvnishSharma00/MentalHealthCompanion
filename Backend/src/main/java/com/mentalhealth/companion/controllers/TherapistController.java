package com.mentalhealth.companion.controllers;
import java.security.Principal;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.mentalhealth.companion.dto.AppointmentDTO;
import com.mentalhealth.companion.dto.TherapistAvailabilityRequestDTO;
import com.mentalhealth.companion.dto.TherapistResponseDTO;
import com.mentalhealth.companion.dto.TherapistSignupDTO;
import com.mentalhealth.companion.dto.UpdateAppointmentStatusDTO;
import com.mentalhealth.companion.service.AppointmentService;
import com.mentalhealth.companion.service.TherapistService;

@RestController
@RequestMapping("/Therapist")
public class TherapistController {
    @Autowired
    private TherapistService therapistService;
    @Autowired 
    private AppointmentService appointmentService;

    @PostMapping("/availability")
    public ResponseEntity<String> setAvailability(@RequestBody TherapistAvailabilityRequestDTO dto, Principal principal) {
    therapistService.addAvailability(principal.getName(), dto);
    
    return ResponseEntity.ok("Availability added");
}

@PutMapping("/appointments/{id}/status")
public ResponseEntity<String> updateStatus(@PathVariable Long id, @RequestBody UpdateAppointmentStatusDTO dto,Principal principal) {
    appointmentService.updateStatus(id, dto,principal.getName());
    return ResponseEntity.ok("Appointment status updated");
}

@GetMapping("/getTherapistProfile")
public ResponseEntity<TherapistResponseDTO> getprofile(Principal principal)
{
     TherapistResponseDTO dto=  therapistService.getMyProfile(principal.getName());
     return ResponseEntity.ok(dto);
}


@GetMapping("/appointmentList")
public ResponseEntity<List<AppointmentDTO>> getAppointment(
        Principal principal,
        @RequestParam(required = false) String status) { // optional status filter
    return appointmentService.getAppointment(principal.getName(), status);
}


}
// @GetMapping("/todaySlot")
// public ResponseEntity<TherapistAvailabilityResponseDTO> getSlots
