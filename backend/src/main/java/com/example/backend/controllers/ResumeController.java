package com.example.backend.controllers;

import com.example.backend.services.InterviewService;
import com.example.backend.services.ResumeService;
import com.example.backend.entities.Interview;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/resume")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private InterviewService interviewService;

    @PostMapping("/upload/{username}")
    public ResponseEntity<?> uploadResume(
            @PathVariable String username,
            @RequestParam("file") MultipartFile file) {
        try {
            if (!file.getContentType().equals("application/pdf")) {
                return ResponseEntity.badRequest().body("Only PDF files are allowed");
            }
            String result = resumeService.uploadResume(username, file);
            return ResponseEntity.ok(Map.of("message", result));
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to upload resume: " + e.getMessage());
        }
    }

    @GetMapping("/status/{username}")
    public ResponseEntity<?> getResumeStatus(@PathVariable String username) {
        boolean hasResume = resumeService.hasResume(username);
        String fileName = resumeService.getResumeFileName(username);
        return ResponseEntity.ok(Map.of("hasResume", hasResume, "fileName", fileName != null ? fileName : ""));
    }

    @PostMapping("/start-company-interview")
    public ResponseEntity<?> startCompanyInterview(@RequestBody Map<String, String> body) {
        try {
            String username = body.get("username");
            String company = body.get("company");

            String questionsJson = resumeService.generateCompanyQuestions(username, company);
            Interview interview = interviewService.startCompanyInterview(username, company, questionsJson);
            return ResponseEntity.ok(interview);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Failed to start interview: " + e.getMessage());
        }
    }
}
