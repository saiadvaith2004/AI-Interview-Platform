package com.example.backend.controllers;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/public")
public class TestController {

    @GetMapping("/health")
    public String health() {
        return "Backend is running";
    }
}