package com.mentalhealth.companion.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserProfilePhotoRequestDTO {
    private MultipartFile imageFile;
    
}