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
        String prompt = "You are a senior technical interviewer with knowledge of current " +
                "industry hiring trends in 2024-2025. Generate exactly 5 interview questions " +
                "for the topic: " + topic + ". " +
                "Questions must reflect real skills currently in demand in the job market. " +
                "Mix of Technical, Behavioral, and Scenario-based questions. " +
                "Return ONLY a valid JSON array of 5 question strings, no extra text, no markdown. " +
                "Example: [\"Question 1?\", \"Question 2?\", \"Question 3?\", \"Question 4?\", \"Question 5?\"]";

        // GeminiService handles retries and fallback internally
        String questionsJson = geminiService.generateRaw(prompt);

        // Save to DB as SYSTEM entry for future reuse
        try {
            Interview systemEntry = new Interview();
            systemEntry.setUsername("SYSTEM");
            systemEntry.setTopic(topic.toLowerCase());
            systemEntry.setStatus("SYSTEM");
            systemEntry.setIsApproved(true);
            systemEntry.setUsageCount(0);
            systemEntry.setStartedAt(LocalDateTime.now());
            systemEntry.setQuestionsJson(questionsJson);
            interviewRepository.save(systemEntry);
        } catch (Exception e) {
            // ✅ If saving fails, still continue — don't crash the interview
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