package com.mentalhealth.companion.config;

import com.mentalhealth.companion.entity.AppUser;
import com.mentalhealth.companion.repository.AppUserRepository;
import com.mentalhealth.companion.utils.JwtUtil;
import com.mentalhealth.companion.EnumFolder.Role;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;
import java.time.Duration;

@Transactional
@Component
@Slf4j
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final JwtUtil jwtUtil;
    private final AppUserRepository userRepository;

    public OAuth2LoginSuccessHandler(JwtUtil jwtUtil, AppUserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");

        // Save user if not present
        AppUser user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    AppUser newUser = AppUser.builder()
                            .email(email)
                            .username(name)
                            .picture(picture)
                            .provider("GOOGLE")
                            .role(Role.USER)
                            .build();
                    return userRepository.save(newUser);
                });

        // Issue JWT
        String token = jwtUtil.generateToken(user.getEmail(),user.getRole().name());
        log.info(user.getRole().name());

        ResponseCookie cookie = ResponseCookie.from("jwt", token)
                .httpOnly(true)
                .secure(false)  // true if HTTPS
                .path("/")
                .sameSite("Lax")
                .maxAge(Duration.ofHours(24))
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

        if(user.getRole().name().equals("ADMIN")){
        getRedirectStrategy().sendRedirect(request, response, "http://localhost:5173/Admin");
        }else{
             getRedirectStrategy().sendRedirect(request, response, "http://localhost:5173/home");
        }
    }
}
