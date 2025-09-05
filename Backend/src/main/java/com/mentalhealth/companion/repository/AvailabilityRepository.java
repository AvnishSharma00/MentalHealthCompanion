package com.mentalhealth.companion.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mentalhealth.companion.entity.Therapist;
import com.mentalhealth.companion.entity.TherapistAvailability;

@Repository
public interface AvailabilityRepository extends JpaRepository<TherapistAvailability,Long>{


  List<TherapistAvailability>  findByTherapistIdAndIsBookedFalseAndDateGreaterThanEqualOrderByDateAscStartTimeAsc
  (Long therapistId, LocalDate today);

  List<TherapistAvailability>  findByTherapistIdAndDateGreaterThanEqualOrderByDateAscStartTimeAsc
  (Long therapistId, LocalDate today);
  TherapistAvailability findByTherapistAndDateAndStartTime
  (Therapist therapist, LocalDate date, LocalTime startTime);
  List<TherapistAvailability> findByTherapistAndDate(Therapist therapist, LocalDate date);




}
