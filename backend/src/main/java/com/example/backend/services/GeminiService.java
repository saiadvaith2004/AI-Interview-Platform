package com.example.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import reactor.util.retry.Retry;

import java.time.Duration;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com")
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

    // ✅ Fallback questions used ONLY if Gemini completely fails after retries
    private static final String FALLBACK_QUESTIONS = """
            ["Explain the core concepts of object-oriented programming with examples.",
             "Describe a challenging technical problem you solved and your approach.",
             "How do you ensure code quality and maintainability in your projects?",
             "Explain the difference between synchronous and asynchronous programming.",
             "How would you design a scalable REST API for a large application?"]
            """;

    public String generateRaw(String prompt) {
        try {
            String requestBody = "{\"contents\": [{\"parts\": [{\"text\": \""
                    + prompt.replace("\"", "\\\"").replace("\n", "\\n").replace("\r", "")
                    + "\"}]}]}";

            String response = webClient.post()
                    .uri("/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    // ✅ Timeout — don't wait more than 15 seconds per request
                    .timeout(Duration.ofSeconds(15))
                    // ✅ Retry up to 3 times with 2 second delay between retries
                    .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(2))
                            .filter(throwable -> !(throwable instanceof WebClientResponseException.TooManyRequests))
                    )
                    .block();

            JsonNode root = objectMapper.readTree(response);
            String text = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            return text.replace("```json", "").replace("```", "").trim();

        } catch (Exception e) {
            // ✅ If Gemini fails after all retries, return fallback questions
            System.err.println("Gemini generateRaw failed after retries: " + e.getMessage());
            return FALLBACK_QUESTIONS;
        }
    }

    public String evaluateAnswer(String question, String answer) {
        try {
            if (answer == null || answer.trim().isEmpty()) {
                return "{\"score\": 0, \"feedback\": \"No answer provided.\", \"strengths\": \"\", \"improvements\": \"Please provide an answer.\"}";
            }

            String prompt = "You are an expert technical interviewer. Evaluate this interview answer.\\n\\nQuestion: "
                    + question.replace("\"", "'")
                    + "\\n\\nAnswer: "
                    + answer.replace("\"", "'").replace("\n", " ")
                    + "\\n\\nRespond ONLY with this JSON (no markdown):\\n{\\\"score\\\": <0-10>, \\\"feedback\\\": \\\"<2-3 sentences>\\\", \\\"strengths\\\": \\\"<what was good>\\\", \\\"improvements\\\": \\\"<what to improve>\\\"}";

            String requestBody = "{\"contents\": [{\"parts\": [{\"text\": \"" + prompt + "\"}]}]}";

            String response = webClient.post()
                    .uri("/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey)
                    .header("Content-Type", "application/json")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    // ✅ Timeout — don't wait more than 20 seconds for evaluation
                    .timeout(Duration.ofSeconds(20))
                    // ✅ Retry up to 3 times with 2 second delay
                    .retryWhen(Retry.fixedDelay(3, Duration.ofSeconds(2))
                            .filter(throwable -> !(throwable instanceof WebClientResponseException.TooManyRequests))
                    )
                    .block();

            JsonNode root = objectMapper.readTree(response);
            String text = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            return text.replace("```json", "").replace("```", "").trim();

        } catch (Exception e) {
            // ✅ If evaluation fails, return a neutral fallback response
            System.err.println("Gemini evaluateAnswer failed after retries: " + e.getMessage());
            return "{\"score\": 5, \"feedback\": \"Evaluation could not be completed at this time. Please try again.\", \"strengths\": \"Answer was provided.\", \"improvements\": \"Please retry evaluation.\"}";
        }
    }
}