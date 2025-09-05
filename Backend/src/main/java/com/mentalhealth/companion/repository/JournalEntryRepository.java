package com.mentalhealth.companion.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.mentalhealth.companion.EnumFolder.Mood;
import com.mentalhealth.companion.entity.AppUser;
import com.mentalhealth.companion.entity.JournalEntry;

@Repository
public interface JournalEntryRepository extends JpaRepository<JournalEntry,Long>{
   
    List<JournalEntry> findByUserOrderByTimestampDesc(AppUser user);


    @Query("SELECT e FROM JournalEntry e WHERE e.user = :user AND e.mood = :mood")
List<JournalEntry> findByUserAndMood(@Param("user") AppUser user, @Param("mood") Mood mood);

@Query("SELECT e FROM JournalEntry e WHERE e.user = :user AND DATE(e.timestamp) = :date")
List<JournalEntry> findByUserAndDate(@Param("user") AppUser user, @Param("date") LocalDate date);

@Query("SELECT e FROM JournalEntry e WHERE e.user = :user AND e.mood = :mood AND DATE(e.timestamp) = :date")
List<JournalEntry> findByUserAndMoodAndDate(@Param("user") AppUser user, @Param("mood") Mood mood, @Param("date") LocalDate date);

    
}
