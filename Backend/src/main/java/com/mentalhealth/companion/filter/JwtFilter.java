// package com.mentalhealth.companion.filter;

// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
// import org.springframework.security.core.context.SecurityContextHolder;
// import org.springframework.security.core.userdetails.UserDetails;
// import org.springframework.security.core.userdetails.UserDetailsService;
// import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
// import org.springframework.stereotype.Component;
// import org.springframework.web.filter.OncePerRequestFilter;
// import com.mentalhealth.companion.utils.JwtUtil;
// import jakarta.servlet.FilterChain;
// import jakarta.servlet.ServletException;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import jakarta.servlet.http.Cookie;

// import java.io.IOException;

// @Component
// public class JwtFilter extends OncePerRequestFilter {

//     @Autowired
//     private UserDetailsService userDetailsService;

//     @Autowired
//     private JwtUtil jwtUtil;

//     @Override
//     protected void doFilterInternal(HttpServletRequest request,
//                                     HttpServletResponse response,
//                                     FilterChain chain) throws ServletException, IOException {

//         String path = request.getRequestURI();

//         // Skip JWT check for auth and OAuth2 endpoints
//         if (path.startsWith("/auth") || path.startsWith("/oauth2") ||path.startsWith("/user/loginUser")|| path.startsWith("/login/oauth2")) {
//             chain.doFilter(request, response);
//             return;
//         }

//         String jwt = null;
//         String username = null;

//         // Check Authorization header first
//         String authHeader = request.getHeader("Authorization");
//         if (authHeader != null && authHeader.startsWith("Bearer ")) {
//             jwt = authHeader.substring(7);
//         }

//         // If not found in header, check cookies
//         if (jwt == null && request.getCookies() != null) {
//             for (Cookie cookie : request.getCookies()) {
//                 if ("jwt".equals(cookie.getName())) {
//                     jwt = cookie.getValue();
//                     break;
//                 }
//             }
//         }

//         // Extract username if token exists
//         if (jwt != null) {
//             try {
//                 username = jwtUtil.extractUsername(jwt);
//             } catch (Exception e) {
//                 // invalid token, skip
//             }
//         }

//         // Validate token and set security context
//         if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
//             UserDetails userDetails = userDetailsService.loadUserByUsername(username);

//             if (jwtUtil.validateToken(jwt) && username.equals(userDetails.getUsername())) {
//                 UsernamePasswordAuthenticationToken auth =
//                         new UsernamePasswordAuthenticationToken(
//                                 userDetails, null, userDetails.getAuthorities()
//                         );
//                 auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
//                 SecurityContextHolder.getContext().setAuthentication(auth);
//             }
//         }

//         chain.doFilter(request, response);
//     }
// }
package com.mentalhealth.companion.filter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import com.mentalhealth.companion.utils.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Cookie;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip JWT check for auth and OAuth2 endpoints
        if (path.startsWith("/auth") ||path.startsWith("/userprofilephoto") || path.startsWith("/oauth2") 
            || path.startsWith("/user/loginUser") 
            || path.startsWith("/login/oauth2")) {
            chain.doFilter(request, response);
            return;
        }

        String jwt = null;
        String username = null;

        // Check Authorization header first
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            jwt = authHeader.substring(7);
        }

        // If not found in header, check cookies
        if (jwt == null && request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("jwt".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        // Extract username & role if token exists
        if (jwt != null) {
            try {
                username = jwtUtil.extractUsername(jwt);
                String role = jwtUtil.extractRole(jwt); // <--- role from token

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    if (jwtUtil.validateToken(jwt)) {
                        UserDetails userDetails = User.builder()
                                .username(username)
                                .password("") // not needed for auth
                                .authorities(role) // use role from JWT
                                .build();

                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails, null, userDetails.getAuthorities()
                                );
                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(auth);
                    }
                }
            } catch (Exception e) {
                // invalid token, just skip
            }
        }

        chain.doFilter(request, response);
    }
}
