package com.mentalhealth.companion.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;
import com.mentalhealth.companion.entity.AppUser;
import com.mentalhealth.companion.exception.ApiException;
import com.mentalhealth.companion.repository.AppUserRepository;
@Component
public class UserDetailImpl implements UserDetailsService{
  @Autowired
  private AppUserRepository appUserRepository;

  @Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    AppUser user = appUserRepository.findByEmail(username)
            .orElseThrow(() -> new UsernameNotFoundException("USER_NOT_FOUND"));

    if(user.getProvider().equals("GOOGLE")) {
        // Google users cannot log in via local login
        return User.builder()
                .username(user.getEmail())
                .password("{noop}GOOGLE_USER") // dummy password
                .authorities(user.getRole().name())
                .build();
    }

    if(user.getPassword() == null) {
        throw new IllegalArgumentException("Password cannot be null for LOCAL user");
    }

    return User.builder()
            .username(user.getEmail())
            .password(user.getPassword())
            .authorities(user.getRole().name())
            
            .build();
}

    
}
