package com.mentalhealth.companion.service;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Optional;
import java.nio.file.Path;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.mentalhealth.companion.EnumFolder.Role;
import com.mentalhealth.companion.dto.AppUserRequestDTO;
import com.mentalhealth.companion.dto.AppUserResponseDTO;
import com.mentalhealth.companion.dto.LoginRequestDTO;
import com.mentalhealth.companion.dto.UserProfilePhotoRequestDTO;
import com.mentalhealth.companion.dto.updateProfileDTO;
import com.mentalhealth.companion.entity.AppUser;
import com.mentalhealth.companion.exception.ApiException;
import com.mentalhealth.companion.repository.AppUserRepository;
import com.mentalhealth.companion.utils.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
public class AppUserService {
    @Autowired
    private  AppUserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


     @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;


    public Object createUser(AppUserRequestDTO dto){

        log.info("Creating user with email: {}", dto.getEmail());
       if(userRepository.existsByEmail(dto.getEmail())){
                
                   return ResponseEntity
                .badRequest()
                .body( "Email is already registered");
       }
        AppUser user = new AppUser();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setRole(Role.USER);
        user.setGender(dto.getGender());
        user.setProvider("LOCAL");
        user.setDateOfBirth(dto.getDateOfBirth());
        AppUser saved = userRepository.save(user);
        log.info("User created successfully with ID: {}", saved.getUser_id());
        return convertToResponseDTO(saved);

    }
    private AppUserResponseDTO convertToResponseDTO(AppUser user) {
    return AppUserResponseDTO.builder()
            .user_id(user.getUser_id())
            .username(user.getUsername())
            .email(user.getEmail())
            .role(user.getRole().name())
            .gender(user.getGender())
            .imageUrl(user.getImageUrl())
            .dateOfBirth(user.getDateOfBirth())
            .createdAt(user.getCreatedAt())
            .updatedAt(user.getUpdatedAt())
            .build();
}

// public ResponseEntity<Object> login(LoginRequestDTO user,HttpServletResponse response){

//       try{
//             authenticationManager.authenticate(
//                     new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
//             UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
//             Optional<AppUser> appUser=userRepository.findByUsername(user.getUsername());
//             String jwt = jwtUtil.generateToken(userDetails.getUsername());
//              ResponseCookie cookie = ResponseCookie.from("jwt", jwt)
//                     .httpOnly(true)       // prevent JavaScript access
//                     .secure(false)        // set true in production (HTTPS)
//                     .path("/")
//                     .maxAge(24 * 60 * 60) // 1 day
//                     .sameSite("lax")   // prevent CSRF
//                     .build();

//             response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
//             log.info("Login successfull for user {}",user.getUsername());
//             return  ResponseEntity.ok(appUser.get().getRole());
//         }catch (Exception e){
//           //  log.error("Exception occurred while createAuthenticationToken ", e);
//            log.warn("Login failed for user: {} - Reason: {}", user.getUsername(), e.getMessage());
//            // return new ResponseEntity<>("Incorrect username or password", HttpStatus.BAD_REQUEST);
//             throw new RuntimeException("Incorrect username or password");
            

//         }
    

// }

public ResponseEntity<String> updateProfile(updateProfileDTO dto,String email){
    if(!userRepository.existsByEmail(email)){
        throw new ApiException("USER NOT FOUND");
    }
    AppUser user=userRepository.findByEmail(email).orElseThrow(()-> new ApiException("USER NOT FOUND"));
    if(!dto.getUsername().isEmpty()){
        user.setUsername(dto.getUsername());
    }
    if(dto.getDateOfBirth()!=null)
    {
        user.setDateOfBirth(dto.getDateOfBirth());
    }
    userRepository.save(user);
    return ResponseEntity.ok("USER UPDATED SUCCESSFULLY");
}












public ResponseEntity<AppUserResponseDTO> getUserData(String email){
      if(!userRepository.existsByEmail(email)){
                throw new ApiException("USER DOESN'T EXIST ");  
       }
       AppUser user=userRepository.findByEmail(email).orElseThrow(()->new ApiException("USER DOESN'T EXIST ") );
       return ResponseEntity.ok(convertToResponseDTO(user));
}
 public  String getProfilePhoto(String email)
    {
             AppUser userProfile = userRepository.findByEmail(email).orElseThrow(()-> new ApiException("USER NOT FOUND"));
             String url=userProfile.getImageUrl();
             return url;
    }

  public String setProfilePicture(UserProfilePhotoRequestDTO dto, String email) {
    AppUser userProfile = userRepository.findByEmail(email).orElseThrow();

    if (dto.getImageFile() == null || dto.getImageFile().isEmpty()) {
        return "No image file provided"; // Handle empty file
    }

    String fileName = System.currentTimeMillis() + "_" + dto.getImageFile().getOriginalFilename();
    Path uploadPath = Paths.get("C:/Users/Avnish/Desktop/userprofilephoto/" + fileName);

    try {
        Files.createDirectories(uploadPath.getParent());

        // Delete old file if exists
        if (userProfile.getImageUrl() != null) {
            Path oldFile = Paths.get("C:/Users/Avnish/Desktop" + userProfile.getImageUrl());
            Files.deleteIfExists(oldFile);
        }

        dto.getImageFile().transferTo(uploadPath.toFile());
        userProfile.setImageUrl("/userprofilephoto/" + fileName);

        userRepository.save(userProfile); // Persist changes

        return "Profile photo created successfully"; // or "updated successfully"
    } catch (IOException e) {
        throw new RuntimeException("Failed to store image file", e);
    }
}



   

    
}
