package com.mentalhealth.companion.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import com.mentalhealth.companion.EnumFolder.AppointmentStatus;
import com.mentalhealth.companion.EnumFolder.TherapistStatus;
import com.mentalhealth.companion.dto.AppointmentDTO;
import com.mentalhealth.companion.dto.BookAppointmentDTO;
import com.mentalhealth.companion.dto.UpdateAppointmentStatusDTO;
import com.mentalhealth.companion.entity.AppUser;
import com.mentalhealth.companion.entity.Appointment;
import com.mentalhealth.companion.entity.Therapist;
import com.mentalhealth.companion.entity.TherapistAvailability;
import com.mentalhealth.companion.exception.ApiException;
import com.mentalhealth.companion.repository.AppUserRepository;
import com.mentalhealth.companion.repository.AppointmentRepository;
import com.mentalhealth.companion.repository.AvailabilityRepository;
import com.mentalhealth.companion.repository.TherapistRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppUserRepository userRepository;
    private final AppointmentRepository appointmentRepository;
    private final AvailabilityRepository availabilityRepository;
    private final TherapistRepository therapistRepository;

    @Transactional
    public void bookAppointment(String username, BookAppointmentDTO dto) {
        AppUser user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ApiException("user not found", "USER_NOT_FOUND"));

        TherapistAvailability slot = availabilityRepository.findById(dto.getAvailabilityId())
                .orElseThrow(() -> new ApiException("Slot not found", "SLOT_NOT_FOUND"));

        if (slot.getIsBooked()) {
            throw new ApiException("Slot already booked", "SLOT_ALREADY_BOOKED");
        }

        // Mark the slot as booked
        slot.setIsBooked(true);

        // Create the appointment
        Appointment appointment = new Appointment();
        appointment.setUser(user);
        appointment.setTherapist(slot.getTherapist());
        appointment.setDate(slot.getDate());
        appointment.setStartTime(slot.getStartTime());
        appointment.setEndTime(slot.getEndTime());
        appointment.setStatus(AppointmentStatus.REQUESTED);

        availabilityRepository.save(slot);
        appointmentRepository.save(appointment);
    }

 @Transactional
public void updateStatus(Long id, UpdateAppointmentStatusDTO dto, String username) {
    Appointment appointment = appointmentRepository.findById(id)
            .orElseThrow(() -> new ApiException("Appointment not found", "APPOINTMENT_NOT_FOUND"));

    // Ensure only the assigned therapist can approve/reject
    AppUser therapistUser = userRepository.findByEmail(username)
            .orElseThrow(() -> new ApiException("User not found", "USER_NOT_FOUND"));

    Therapist therapist = therapistRepository.findByUser(therapistUser)
            .orElseThrow(() -> new ApiException("Therapist not found", "THERAPIST_NOT_FOUND"));

    if (!appointment.getTherapist().getId().equals(therapist.getId())) {
        throw new ApiException("You are not authorized to modify this appointment", "UNAUTHORIZED_THERAPIST");
    }

    if (appointment.getStatus() != AppointmentStatus.REQUESTED) {
        throw new ApiException("Appointment already reviewed", "ALREADY_REVIEWED");
    }

    if (dto.getStatus() == AppointmentStatus.APPROVED) {
        appointment.setStatus(AppointmentStatus.APPROVED);
        appointment.setApprovedAt(LocalDateTime.now());

    } else if (dto.getStatus() == AppointmentStatus.REJECTED) {
        TherapistAvailability slot = availabilityRepository
                .findByTherapistAndDateAndStartTime(
                        appointment.getTherapist(),
                        appointment.getDate(),
                        appointment.getStartTime());

        slot.setIsBooked(false); // free the slot
        appointment.setStatus(AppointmentStatus.REJECTED);

    } else {
        throw new ApiException("Invalid status", "INVALID_STATUS");
    }

    // No explicit save() needed — @Transactional will handle it
}


















    @Transactional
    public void cancelAppointment(Long id, String username) {
        AppUser user = userRepository.findByEmail(username)
                .orElseThrow(() -> new ApiException("User not found", "USER_NOT_FOUND"));

        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ApiException("Appointment not found", "APPOINTMENT_NOT_FOUND"));

        if (!appointment.getUser().getUser_id().equals(user.getUser_id())) {
            throw new ApiException("You are not allowed to cancel this appointment", "UNAUTHORIZED");
        }

        if (appointment.getStatus() == AppointmentStatus.CANCELLED) {
            throw new ApiException("Appointment already cancelled", "ALREADY_CANCELLED");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);

        TherapistAvailability slot = availabilityRepository.findByTherapistAndDateAndStartTime(
                appointment.getTherapist(), appointment.getDate(), appointment.getStartTime());

        if (slot == null) {
            throw new ApiException("Availability slot not found", "SLOT_NOT_FOUND");
        }

        slot.setIsBooked(false);
        availabilityRepository.save(slot);
        appointmentRepository.save(appointment);
    }












    
    public ResponseEntity<List<AppointmentDTO>> getAppointment(String email, String status) {
        AppUser appUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("No THERAPIST FOUND", "NO_THERAPIST_FOUND"));

        List<Appointment> appointments;

        if (status != null && !status.isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            // Convert to enum only if status is valid
            AppointmentStatus enumStatus = AppointmentStatus.valueOf(status.toUpperCase());
            appointments = appointmentRepository
                    .findByTherapist_IdAndStatusOrderByDateDescStartTimeDesc(appUser.getUser_id(), enumStatus);
        } else {
            // Fetch all appointments if status is null, empty, or "ALL"
            appointments = appointmentRepository
                    .findByTherapist_IdOrderByDateDescStartTimeDesc(appUser.getUser_id());
        }

        List<AppointmentDTO> dtoList = appointments.stream().map(appointment -> {
            AppointmentDTO dto = new AppointmentDTO();
            dto.setAppointmentId(appointment.getId());
            dto.setApprovedAt(appointment.getApprovedAt());
            dto.setUserId(appointment.getUser().getUser_id());
            dto.setUserName(appointment.getUser().getUsername());
            dto.setStatus(appointment.getStatus());
            dto.setDate(appointment.getDate());
            dto.setStartTime(appointment.getStartTime());
            dto.setEndTime(appointment.getEndTime());
            dto.setRequestedAt(appointment.getRequestedAt());
            return dto;
        }).toList();

        return ResponseEntity.ok(dtoList);
    }









    public ResponseEntity<List<AppointmentDTO>> getAppointmentForUser(String email, String status) {
        AppUser appUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException("No USER FOUND", "NO_USER_FOUND"));

        List<Appointment> appointments;

        if (status != null && !status.isEmpty() && !"ALL".equalsIgnoreCase(status)) {
            // Convert to enum only if status is valid
            AppointmentStatus enumStatus = AppointmentStatus.valueOf(status.toUpperCase());
            appointments = appointmentRepository
                    .findByUserAndStatusOrderByDateDescStartTimeDesc(appUser, enumStatus);
        } else {
            // Fetch all appointments if status is null, empty, or "ALL"
            appointments = appointmentRepository
                    .findByUserOrderByDateDescStartTimeDesc(appUser);
        }

        List<AppointmentDTO> dtoList = appointments.stream().map(appointment -> {
            AppointmentDTO dto = new AppointmentDTO();
            dto.setAppointmentId(appointment.getId());
            dto.setApprovedAt(appointment.getApprovedAt());
            dto.setTherapistId(appointment.getTherapist().getId());
            dto.setTherapistName(appointment.getTherapist().getUser().getUsername());
            dto.setStatus(appointment.getStatus());
            dto.setDate(appointment.getDate());
            dto.setStartTime(appointment.getStartTime());
            dto.setEndTime(appointment.getEndTime());
            dto.setRequestedAt(appointment.getRequestedAt());
            return dto;
        }).toList();

        return ResponseEntity.ok(dtoList);
    }
}