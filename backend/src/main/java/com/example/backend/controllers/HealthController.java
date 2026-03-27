package com.example.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class HealthController {

    @GetMapping("/")
    public Map<String, String> home() {
        return Map.of(
            "status", "UP",
            "message", "AI Interview Platform Backend is Running",
            "version", "1.0.0"
        );
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}