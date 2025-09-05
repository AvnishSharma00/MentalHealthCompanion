package com.mentalhealth.companion.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mentalhealth.companion.EnumFolder.AppointmentStatus;
import com.mentalhealth.companion.entity.AppUser;
import com.mentalhealth.companion.entity.Appointment;

 
@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByTherapist_IdOrderByDateDescStartTimeDesc(Long therapistId);

    List<Appointment> findByTherapist_IdAndStatusOrderByDateDescStartTimeDesc(
            Long therapistId, AppointmentStatus status);

    List<Appointment> findByUserOrderByDateDescStartTimeDesc(AppUser user);

    List<Appointment> findByUserAndStatusOrderByDateDescStartTimeDesc(
            AppUser user, AppointmentStatus status);
}

    

