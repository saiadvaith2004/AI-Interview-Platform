package com.example.backend.controllers;

import jakarta.validation.Valid;
import com.example.backend.entities.User;
import com.example.backend.services.UserService; // Import your service
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserService userService; // Use the Service, not the Repository directly

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody User user) {
        // Delegate to the service logic you just wrote
        return userService.registerUser(user);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        // You can eventually move login logic to UserService too, 
        // but for now, this works if you keep the dependencies.
        return userService.loginUser(user); // Recommendation: move this to service as well
    }
}