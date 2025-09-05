package com.mentalhealth.companion.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.mentalhealth.companion.entity.AppUser;
import com.mentalhealth.companion.entity.Therapist;
import com.mentalhealth.companion.EnumFolder.TherapistStatus;

@Repository
public interface TherapistRepository extends JpaRepository<Therapist,Long>{
    List<Therapist> findByStatus(String status);

    List<Therapist> findByStatus(TherapistStatus status);

    Optional<Therapist> findByUser(AppUser user);
}
