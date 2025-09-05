package com.mentalhealth.companion.controllers;
import java.util.Optional;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mentalhealth.companion.EnumFolder.TherapistStatus;
import com.mentalhealth.companion.dto.AppUserRequestDTO;
import com.mentalhealth.companion.dto.LoginRequestDTO;
import com.mentalhealth.companion.dto.TherapistResponseDTO;
import com.mentalhealth.companion.dto.TherapistSignupDTO;
import com.mentalhealth.companion.entity.AppUser;
import com.mentalhealth.companion.entity.Therapist;
import com.mentalhealth.companion.exception.ApiException;
import com.mentalhealth.companion.repository.AppUserRepository;
import com.mentalhealth.companion.repository.TherapistRepository;
import com.mentalhealth.companion.service.AppUserService;
import com.mentalhealth.companion.service.TherapistService;
import com.mentalhealth.companion.service.UserDetailImpl;
import com.mentalhealth.companion.utils.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;

@RestController
@Slf4j
@RequestMapping("/auth")
public class SignUpController {
    @Autowired
    private AppUserService appService;
      @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private AppUserRepository userRepository;

    @Autowired
    private UserDetailImpl userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private TherapistService therapistService;
    
    @Autowired 
    private TherapistRepository therapistRepository;
         @PostMapping("/Therapist/signup")
        public ResponseEntity<TherapistResponseDTO> createTherapist(@Valid @RequestBody TherapistSignupDTO dto) {
        log.info("Creating user with email {}",dto.getEmail());
         return ResponseEntity.ok(therapistService.registerTherapist(dto));
         
        //  return ResponseEntity.ok(createdUser);
        }

        @GetMapping("/encode")
public String encodePassword() {
    return new BCryptPasswordEncoder().encode("avi@123");
}
     
        @PostMapping("/signup")
        public ResponseEntity<Object> createUser(@Valid @RequestBody AppUserRequestDTO dto) {
        log.info("Creating user with email {}",dto.getEmail());
         Object createdUser = appService.createUser(dto);
         log.debug("User created successfully: {}", createdUser);
         return ResponseEntity.ok(createdUser);
        }
     
    // ================= Controller ==================
@PostMapping("/loginUser")
public ResponseEntity<?> login(@RequestBody LoginRequestDTO user, HttpServletResponse response) {
    log.info("Login attempt for user: {}", user.getEmail());

    try {
        // Load user from DB
        Optional<AppUser> appUserOpt = userRepository.findByEmail(user.getEmail());
        Long id=appUserOpt.get().getUser_id();

        if (appUserOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
        }
        if(appUserOpt.get().getRole().name().equals("THERAPIST")){
        
              Therapist therapist=therapistRepository.findById(id).orElseThrow(()-> new ApiException("USER_NOT_FOUND"));
              if(therapist.getStatus().equals(TherapistStatus.PENDING)){
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("YOUR APPLICATION IS STILL PENDING");
              }
        } 

        AppUser appUser = appUserOpt.get();

        // Block OAuth2 users from normal login
        if (!"LOCAL".equals(appUser.getProvider())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body("This user must login via " + appUser.getProvider());
        }

        // Authenticate password
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword())
        );

        // Load UserDetails for Spring Security
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        // Generate JWT
        String jwt = jwtUtil.generateToken(
    userDetails.getUsername(),
    userDetails.getAuthorities().iterator().next().getAuthority()
);


        // Create HTTP-only cookie
        ResponseCookie cookie = ResponseCookie.from("jwt", jwt)
                .httpOnly(true)
                .secure(false)        // set true in production with HTTPS
                .path("/")
                .maxAge(24 * 60 * 60)
                 // 1 day
                .sameSite("Lax")      // CSRF protection
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        log.info("Login successful for user {}", user.getEmail());

        // Return structured response
        return ResponseEntity.ok(Map.of(
                "username", userDetails.getUsername(),
                "role", appUser.getRole()
        ));

    } catch (Exception e) {
        log.warn("Login failed for user: {} - Reason: {}", user.getEmail(), e.getMessage());
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Incorrect username or password");
    }
}

@PostMapping("/logout")
public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response) {
    // Invalidate server session (kills JSESSIONID)
    request.getSession().invalidate();

    // Expire JWT cookie
    ResponseCookie jwtCookie = ResponseCookie.from("jwt", "")
            .httpOnly(true)
            .secure(false) // must match login cookie config
            .path("/")     // must match login cookie path
            .sameSite("Lax")
            .maxAge(0)     // delete immediately
            .build();

    // Expire JSESSIONID cookie manually (browser-side delete)
    ResponseCookie jsessionidCookie = ResponseCookie.from("JSESSIONID", "")
            .httpOnly(true)
            .secure(false)
            .path("/")
            .sameSite("Lax")
            .maxAge(0)
            .build();

    response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
    response.addHeader(HttpHeaders.SET_COOKIE, jsessionidCookie.toString());

    return ResponseEntity.ok("Logged out successfully");
}

}
