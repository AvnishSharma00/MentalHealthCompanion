package com.mentalhealth.companion.controllers;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.mentalhealth.companion.EnumFolder.Role;
import com.mentalhealth.companion.dto.AppUserResponseDTO;
import com.mentalhealth.companion.dto.TherapistResponseDTO;
import com.mentalhealth.companion.dto.UpdateStatusDTO;
import com.mentalhealth.companion.service.AdminService;


@RestController
@RequestMapping("/Admin")
public class AdminController {


    @Autowired
    private AdminService adminService;
    
  @GetMapping("/test")
  public String hello()
    {
        return "hello";
    }
  
@PutMapping("/therapists/{id}/status")
public ResponseEntity<TherapistResponseDTO> updateTherapistStatus(
        @PathVariable Long id,
        @RequestBody UpdateStatusDTO dto
) {
    TherapistResponseDTO response = adminService.updateTherapistStatus(id, dto);
    return ResponseEntity.ok(response);
}

@PutMapping("/make-admin/{id}")
    public ResponseEntity<String> makeUserAdmin(@PathVariable Long id) {
    adminService.makeUserAdmin(id);
    return ResponseEntity.ok("User promoted to admin successfully");
}

@GetMapping("/getAllUser")
public ResponseEntity<List<AppUserResponseDTO>> getAllUser(){
      List<AppUserResponseDTO> users = adminService.getAllUser();
      return  ResponseEntity.ok(users);

}
@GetMapping("/getAllTherapistForAdmin")
public ResponseEntity<List<TherapistResponseDTO>> getAllTherapist(){
      List<TherapistResponseDTO> users = adminService.getAllTherapist();
      return  ResponseEntity.ok(users);

}
}

