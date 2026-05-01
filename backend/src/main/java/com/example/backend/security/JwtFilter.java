package com.example.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String username;

        // Logging header for debugging
        if (authHeader != null) {
            System.out.println("DEBUG: Auth header found: " + (authHeader.startsWith("Bearer ") ? "Valid format" : "Invalid format"));
        } else {
            System.out.println("DEBUG: Auth header is missing for request: " + request.getRequestURI());
        }

        // 1. Check if the header exists and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 2. Extract the actual token (skip the first 7 characters: "Bearer ")
        jwt = authHeader.substring(7);
        try {
            username = jwtUtil.extractUsername(jwt);
            System.out.println("DEBUG: Extracted username: " + username);
        } catch (Exception e) {
            System.out.println("DEBUG: Token extraction failed: " + e.getMessage());
            filterChain.doFilter(request, response);
            return;
        }

        // 3. If we have a username and the user isn't already authenticated in this request
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // 4. Validate the token against the user details
            if (jwtUtil.validateToken(jwt, userDetails)) {
                System.out.println("DEBUG: Token validated for user: " + username);
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                
                // 5. Tell Spring Security: "This user is valid!"
                SecurityContextHolder.getContext().setAuthentication(authToken);
            } else {
                System.out.println("DEBUG: Token validation failed for user: " + username);
            }
        }
        
        // Continue to the next filter in the chain
        filterChain.doFilter(request, response);
    }

    // This ensures we don't filter the Auth endpoints
    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getServletPath();
        return path.startsWith("/auth/");
    }
}