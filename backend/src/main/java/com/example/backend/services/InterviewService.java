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

    // ✅ Minimum number of approved question sets in DB before skipping Gemini
    private static final int MIN_QUESTIONS_THRESHOLD = 2;

    /**
     * Smart Question Strategy:
     * Step 1 → Check DB: does it have 5+ approved question sets for this topic?
     * Step 2 → YES: serve directly from DB (fast, no Gemini call)
     * Step 3 → NO: call Gemini, generate questions, save to DB, then serve
     */
    public Interview startInterview(String username, String topic) {

        long approvedCount = interviewRepository.countApprovedQuestionsByTopic(topic.toLowerCase());

        String questionsJson;

        if (approvedCount >= MIN_QUESTIONS_THRESHOLD) {
            // ✅ DB has enough questions — serve from DB directly
            Optional<Interview> cached = interviewRepository
                    .findRandomApprovedQuestionsByTopic(topic.toLowerCase());

            if (cached.isPresent()) {
                // Increment usage count
                interviewRepository.incrementUsageCount(cached.get().getId());
                questionsJson = cached.get().getQuestionsJson();
            } else {
                // Fallback to Gemini if something goes wrong
                questionsJson = generateQuestionsFromGemini(topic);
                saveQuestionsToDb(topic, questionsJson);
            }

        } else {
            // ⚡ DB insufficient — call Gemini to generate new questions
            questionsJson = generateQuestionsFromGemini(topic);

            // Save as a SYSTEM entry so it can be reused for future interviews
            saveQuestionsToDb(topic, questionsJson);
        }

        // Create the actual interview for this user
        Interview interview = new Interview();
        interview.setUsername(username);
        interview.setTopic(topic);
        interview.setStatus("STARTED");
        interview.setStartedAt(LocalDateTime.now());
        interview.setQuestionsJson(questionsJson);

        return interviewRepository.save(interview);
    }

    /**
     * Calls Gemini to generate 5 interview questions for the given topic,
     * reflecting current market trends.
     */
    private String generateQuestionsFromGemini(String topic) {
        String prompt = "You are a senior technical interviewer with knowledge of current " +
            "industry hiring trends in 2024-2025. Generate exactly 5 interview questions " +
            "for the topic: " + topic + ". " +
            "Questions must reflect real skills currently in demand in the job market. " +
            "Mix of Technical, Behavioral, and Scenario-based questions. " +
            "Return ONLY a valid JSON array of 5 question strings, no extra text, no markdown. " +
            "Example: [\"Question 1?\", \"Question 2?\", \"Question 3?\", \"Question 4?\", \"Question 5?\"]";

        return geminiService.generateRaw(prompt);
    }

    /**
     * Saves Gemini-generated questions as a SYSTEM entry in DB
     * so they can be reused for future interviews on the same topic.
     */
    private void saveQuestionsToDb(String topic, String questionsJson) {
        Interview systemEntry = new Interview();
        systemEntry.setUsername("SYSTEM");   // Mark as system/reusable entry
        systemEntry.setTopic(topic.toLowerCase());
        systemEntry.setStatus("SYSTEM");
        systemEntry.setIsApproved(true);
        systemEntry.setUsageCount(0);
        systemEntry.setStartedAt(LocalDateTime.now());
        systemEntry.setQuestionsJson(questionsJson);
        interviewRepository.save(systemEntry);
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