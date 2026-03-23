package com.example.backend.controller;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;
import com.example.backend.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder; // ✅ final
    private final UserRepository userRepository;

    public AuthController(AuthenticationManager authenticationManager,
                      UserDetailsService userDetailsService,
                      JwtUtil jwtUtil,
                      PasswordEncoder passwordEncoder,
                      UserRepository userRepository) {

    this.authenticationManager = authenticationManager;
    this.userDetailsService = userDetailsService;
    this.jwtUtil = jwtUtil;
    this.passwordEncoder = passwordEncoder;
    this.userRepository = userRepository;
}

    @PostMapping("/register")
public ResponseEntity<?> register(@RequestBody Map<String, String> request) {

    String username = request.get("username");
    String password = request.get("password");

    // Create user entity
    User user = new User();
    user.setUsername(username);

    // 🔥 IMPORTANT LINE (ADD HERE)
    user.setPassword(passwordEncoder.encode(password));

    userRepository.save(user);

    return ResponseEntity.ok("User registered successfully");
}

    // ✅ LOGIN (already correct)
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        Map<String, Object> response = new HashMap<>();
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");

        if (username == null || password == null) {
            response.put("error", "Username and password must be provided");
            return ResponseEntity.badRequest().body(response);
        }

        try {
            authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(username, password)
            );

            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            String token = jwtUtil.generateToken(userDetails.getUsername());

            response.put("username", username);
            response.put("token", token);

            return ResponseEntity.ok(response);

        } catch (AuthenticationException e) {
            response.put("error", "Invalid username or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
}