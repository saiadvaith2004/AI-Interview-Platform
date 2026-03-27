package com.example.backend.controllers;

import com.example.backend.entities.User;
import com.example.backend.security.JwtUtil; 
import com.example.backend.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil; // Match your class name 'JwtUtil' exactly

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            // This works now because UserService.registerUser returns a User object
            User savedUser = userService.registerUser(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                                 .body(Map.of("message", "User registered successfully"));
        } catch (Exception e) {
            // Get the root cause of the error for explicit debugging
            String rootCause = e.getMessage();
            if (e.getCause() != null) {
                rootCause = e.getCause().toString();
                if (e.getCause().getCause() != null) {
                    rootCause = e.getCause().getCause().toString();
                }
            }
            return ResponseEntity.status(HttpStatus.CONFLICT)
                                 .body(Map.of("message", "DB Error: " + rootCause));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        try {
            String username = loginRequest.get("username");
            String password = loginRequest.get("password");

            // 1. Authenticate the user against the database
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );

            // 2. Generate the JWT token
            String token = jwtUtil.generateToken(username);

            // 3. Return response for React
            return ResponseEntity.ok(Map.of(
                "token", token,
                "username", username
            ));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                                 .body(Map.of("message", "Invalid username or password"));
        }
    }
}