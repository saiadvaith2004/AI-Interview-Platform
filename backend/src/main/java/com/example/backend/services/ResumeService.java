package com.example.backend.services;

import org.apache.pdfbox.Loader;
import com.example.backend.entities.User;
import com.example.backend.repositories.UserRepository;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
public class ResumeService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GeminiService geminiService;

    public String uploadResume(String username, MultipartFile file) throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setResume(file.getBytes());
        user.setResumeFileName(file.getOriginalFilename());
        userRepository.save(user);
        return "Resume uploaded successfully";
    }

    public String extractTextFromResume(byte[] resumeBytes) throws IOException {
        try (PDDocument doc = Loader.loadPDF(resumeBytes)) {
        PDFTextStripper stripper = new PDFTextStripper();
        return stripper.getText(doc);
    }
}
    public String generateCompanyQuestions(String username, String company) throws IOException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getResume() == null) {
            throw new RuntimeException("No resume found. Please upload your resume first.");
        }

        String resumeText = extractTextFromResume(user.getResume());

        String prompt = "You are an expert technical interviewer at " + company + ". "
                + "Based on the following resume, generate exactly 5 interview questions that are specific to this candidate's skills and experience, "
                + "tailored for a " + company + " interview. "
                + "Focus on their technical skills, projects, and experience mentioned in the resume. "
                + "Return ONLY a JSON array of 5 strings, no markdown, no extra text. "
                + "Example format: [\"Question 1?\", \"Question 2?\", \"Question 3?\", \"Question 4?\", \"Question 5?\"] "
                + "Resume: " + resumeText.substring(0, Math.min(resumeText.length(), 3000));

        return geminiService.generateRaw(prompt);
    }

    public boolean hasResume(String username) {
        return userRepository.findByUsername(username)
                .map(u -> u.getResume() != null)
                .orElse(false);
    }

    public String getResumeFileName(String username) {
        return userRepository.findByUsername(username)
                .map(User::getResumeFileName)
                .orElse(null);
    }
}
