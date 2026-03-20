package com.example.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    private final WebClient webClient = WebClient.builder()
            .baseUrl("https://generativelanguage.googleapis.com")
            .build();

    private final ObjectMapper objectMapper = new ObjectMapper();

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
                    .block();

            JsonNode root = objectMapper.readTree(response);
            String text = root.path("candidates").get(0)
                    .path("content").path("parts").get(0)
                    .path("text").asText();

            return text.replace("```json", "").replace("```", "").trim();
        } catch (Exception e) {
            System.err.println("Gemini generateRaw error: " + e.getMessage());
            return "[\"Tell me about yourself.\", \"What are your key technical skills?\", \"Describe your most challenging project.\", \"Why do you want to join " + "this company" + "?\", \"Where do you see yourself in 5 years?\"]";
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

        System.out.println("Calling Gemini API...");

        String response = webClient.post()
                .uri("/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println("Gemini Response: " + response);

        JsonNode root = objectMapper.readTree(response);
        String text = root.path("candidates").get(0)
                .path("content").path("parts").get(0)
                .path("text").asText();

        text = text.replace("```json", "").replace("```", "").trim();
        System.out.println("Extracted text: " + text);
        return text;

    } catch (Exception e) {
        System.err.println("Gemini error: " + e.getMessage());
        e.printStackTrace();
        return "{\"score\": 5, \"feedback\": \"Could not evaluate answer at this time.\", \"strengths\": \"Answer was provided.\", \"improvements\": \"Please try again.\"}";
    }
}
}