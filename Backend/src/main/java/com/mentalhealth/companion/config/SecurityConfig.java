package com.mentalhealth.companion.config;

import com.mentalhealth.companion.filter.JwtFilter;
import com.mentalhealth.companion.service.UserDetailImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
public class SecurityConfig {

    private final UserDetailImpl userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final JwtFilter jwtFilter;
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    public SecurityConfig(UserDetailImpl userDetailsService,
                          PasswordEncoder passwordEncoder,
                          JwtFilter jwtFilter,
                          OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler) {
        this.userDetailsService = userDetailsService;
        this.passwordEncoder = passwordEncoder;
        this.jwtFilter = jwtFilter;
        this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(sm -> sm.sessionCreationPolicy(org.springframework.security.config.http.SessionCreationPolicy.STATELESS))

            .authorizeHttpRequests(auth -> auth
                // public auth endpoints
                .requestMatchers("/auth/loginUser","/oauth2/**", "/login/oauth2/**", "/auth/signup", "/auth/Therapist/signup", "/auth/logout","/userprofilephoto/**").permitAll()

                // API endpoints with JWT
                .requestMatchers("/Admin/**").hasAuthority("ADMIN")
                .requestMatchers("/Journal/**").hasAnyAuthority("ADMIN", "USER", "THERAPIST")
                .requestMatchers("/Therapist/**").hasAnyAuthority("ADMIN", "THERAPIST")
                .requestMatchers("/Therapy/**").hasAnyAuthority("ADMIN", "THERAPIST", "USER")
 // everything else must be authenticated
                .anyRequest().authenticated()
            )
            .formLogin(form -> form.disable())
            .oauth2Login(oauth -> oauth
                .loginPage("/oauth2/authorization/google")
                .userInfoEndpoint(userInfo -> userInfo
                    .oidcUserService(new OidcUserService())
                )
                .successHandler(oAuth2LoginSuccessHandler)
                .failureHandler((request, response, exception) -> {
                    response.setStatus(401);
                    response.getWriter().write("{\"error\":\"OAuth2 login failed\"}");
                })
                .authorizationEndpoint(auth -> auth.baseUri("/oauth2/authorization"))
                .redirectionEndpoint(redir -> redir.baseUri("/login/oauth2/code/*"))
            );

        http.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        http.exceptionHandling(ex -> ex
            .authenticationEntryPoint((request, response, authException) -> {
                response.setContentType("application/json");
                response.setStatus(401);
                response.getWriter().write("{\"error\":\"Unauthorized\"}");
            })
        );

        return http.build();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder);
        return new ProviderManager(authProvider);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:5173"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
