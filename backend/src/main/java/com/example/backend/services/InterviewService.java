package com.example.backend.services;

import com.example.backend.entities.Interview;
import com.example.backend.repositories.InterviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class InterviewService {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private GeminiService geminiService;

    // ✅ Minimum approved question sets in DB before skipping Gemini
    private static final int MIN_QUESTIONS_THRESHOLD = 2;

    /**
     * Smart Question Strategy:
     *
     * Step 1 → Check DB: does it have 2+ approved question sets for this topic?
     * Step 2 → YES: serve directly from DB (fast, no Gemini call)
     * Step 3 → NO: call Gemini with retry logic
     * Step 4 → If Gemini fails: serve from DB anyway (fallback, no crash)
     * Step 5 → If DB also empty: Gemini fallback questions are used
     *
     * ✅ No limits — any user can start as many interviews as they want
     */
    public Interview startInterview(String username, String topic) {

        long approvedCount = interviewRepository.countApprovedQuestionsByTopic(topic.toLowerCase());

        String questionsJson;

        if (approvedCount >= MIN_QUESTIONS_THRESHOLD) {
            // ✅ DB has enough — serve from DB directly, no Gemini call
            Optional<Interview> cached = interviewRepository
                    .findRandomApprovedQuestionsByTopic(topic.toLowerCase());

            if (cached.isPresent()) {
                interviewRepository.incrementUsageCount(cached.get().getId());
                questionsJson = cached.get().getQuestionsJson();
            } else {
                // Edge case: count was ok but fetch failed — call Gemini
                questionsJson = generateAndSaveQuestions(topic);
            }

        } else {
            // ✅ DB insufficient — call Gemini (with retry + fallback built in)
            questionsJson = generateAndSaveQuestions(topic);
        }

        // Create the interview for this user — no limits on how many they can create
        Interview interview = new Interview();
        interview.setUsername(username);
        interview.setTopic(topic);
        interview.setStatus("STARTED");
        interview.setStartedAt(LocalDateTime.now());
        interview.setQuestionsJson(questionsJson);

        return interviewRepository.save(interview);
    }

    /**
     * Calls Gemini to generate questions and saves them to DB.
     * If Gemini fails (after retries inside GeminiService), fallback questions
     * from GeminiService are used — so the interview ALWAYS starts successfully.
     */
    private String generateAndSaveQuestions(String topic) {
        String prompt = "You are a strict technical interviewer. " +
                "Generate exactly 5 interview questions ONLY about: " + topic + ". " +
                "STRICT RULES - DO NOT BREAK THESE: " +
                "1. ALL 5 questions MUST be about " + topic + " ONLY. " +
                "2. DO NOT ask about OOP, OOPS concepts unless the topic itself is OOP. " +
                "3. DO NOT ask behavioral, HR, or resume-based questions. " +
                "4. DO NOT mix other programming languages or topics. " +
                "5. If topic is SQL - ask ONLY about SQL queries, joins, indexes, transactions, normalization etc. " +
                "6. If topic is Java - ask ONLY about Java language features, JVM, collections, etc. " +
                "7. If topic is Python - ask ONLY about Python language features, libraries, etc. " +
                "8. If topic is DSA - ask ONLY about data structures and algorithms. " +
                "9. If topic is Spring - ask ONLY about Spring Boot, Spring MVC, Spring Security etc. " +
                "10. Questions must be purely technical and specific to " + topic + " in 2024-2025. " +
                "Return ONLY a valid JSON array of exactly 5 question strings, no markdown, no extra text. " +
                "Example: [\"Question 1?\", \"Question 2?\", \"Question 3?\", \"Question 4?\", \"Question 5?\"]";

        String questionsJson = geminiService.generateRaw(prompt);

        // ✅ Only save to DB if questions are valid and not empty
        try {
            if (questionsJson != null && !questionsJson.equals("[]") && questionsJson.contains("?")) {
                Interview systemEntry = new Interview();
                systemEntry.setUsername("SYSTEM");
                systemEntry.setTopic(topic.toLowerCase());
                systemEntry.setStatus("SYSTEM");
                systemEntry.setIsApproved(true);
                systemEntry.setUsageCount(0);
                systemEntry.setStartedAt(LocalDateTime.now());
                systemEntry.setQuestionsJson(questionsJson);
                interviewRepository.save(systemEntry);
            }
        } catch (Exception e) {
            System.err.println("Failed to save SYSTEM questions to DB: " + e.getMessage());
        }

        return questionsJson;
    }

    // ---- Existing methods — unchanged ----

    public Interview startCompanyInterview(String username, String company, String questionsJson) {
        questionsJson = questionsJson.replace("```json", "").replace("```", "").trim();

        Interview interview = new Interview();
        interview.setUsername(username);
        interview.setTopic(company + " (Company Specific)");
        interview.setStatus("STARTED");
        interview.setStartedAt(LocalDateTime.now());
        interview.setQuestionsJson(questionsJson);

        return interviewRepository.save(interview);
    }

    public Interview submitAnswers(Long interviewId, String answersJson) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
        interview.setAnswersJson(answersJson);
        interview.setStatus("COMPLETED");
        interview.setCompletedAt(LocalDateTime.now());
        return interviewRepository.save(interview);
    }

    public List<Interview> getUserInterviews(String username) {
        return interviewRepository.findByUsername(username);
    }

    public Interview getInterview(Long id) {
        return interviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Interview not found"));
    }
}