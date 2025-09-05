package com.mentalhealth.companion.repository;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.mentalhealth.companion.EnumFolder.Role;
import com.mentalhealth.companion.entity.AppUser;



@Repository
public interface AppUserRepository extends JpaRepository<AppUser,Long>{

      Optional<AppUser> findByUsername(String username);
      Optional<AppUser> findByEmail(String email);
      List<AppUser> findByRole(Role role);
       boolean existsByEmail(String email);

}
