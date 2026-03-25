package com.example.backend.services;

import com.example.backend.security.JwtUtil;
import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public ResponseEntity<?> loginUser(User user) {
    Optional<User> foundUser = userRepository.findByUsername(user.getUsername().trim());

    if (foundUser.isPresent()) {
        // Check if the raw password matches the encoded password in DB
        if (passwordEncoder.matches(user.getPassword(), foundUser.get().getPassword())) {
            String token = jwtUtil.generateToken(user.getUsername());
            return ResponseEntity.ok(Map.of("token", token));
        }
    }
    
    // Return 401 Unauthorized for bad credentials
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password");
}


    @Transactional
    public ResponseEntity<?> registerUser(User user) {
        // 1. Check if username already exists in DB
        if (userRepository.existsByUsername(user.getUsername())) {
            return new ResponseEntity<>("Username is already taken!", HttpStatus.CONFLICT);
        }

        // 2. Encode the password before saving (Security Best Practice)
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        // 3. Save the user
        userRepository.save(user);

        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    // Keep your original method if needed for other parts of the app
    public User createUser(User user) {
        return userRepository.save(user);
    }
}