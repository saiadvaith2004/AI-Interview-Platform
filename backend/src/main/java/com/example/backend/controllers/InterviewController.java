package com.example.backend.controllers;

import com.example.backend.entities.Evaluation;
import com.example.backend.entities.Interview;
import com.example.backend.services.EvaluationService;
import com.example.backend.services.InterviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/interviews")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @Autowired
    private EvaluationService evaluationService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @PostMapping("/start")
    public ResponseEntity<Interview> startInterview(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String topic = body.get("topic");
        Interview interview = interviewService.startInterview(username, topic);
        return ResponseEntity.ok(interview);
    }

    @PostMapping("/{id}/submit")
    public ResponseEntity<Interview> submitAnswers(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String answersJson = body.get("answers");
        Interview interview = interviewService.submitAnswers(id, answersJson);
        return ResponseEntity.ok(interview);
    }

    @PostMapping("/{id}/evaluate")
    public ResponseEntity<List<Evaluation>> evaluateInterview(@PathVariable Long id) {
        try {
            Interview interview = interviewService.getInterview(id);
            List<String> questions = Arrays.asList(
                    objectMapper.readValue(interview.getQuestionsJson(), String[].class));
            List<String> answers = Arrays.asList(
                    objectMapper.readValue(interview.getAnswersJson(), String[].class));
            List<Evaluation> evaluations = evaluationService.evaluateInterview(id, questions, answers);
            return ResponseEntity.ok(evaluations);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}/evaluations")
    public ResponseEntity<List<Evaluation>> getEvaluations(@PathVariable Long id) {
        return ResponseEntity.ok(evaluationService.getEvaluations(id));
    }

    @GetMapping("/user/{username}")
    public ResponseEntity<List<Interview>> getUserInterviews(@PathVariable String username) {
        return ResponseEntity.ok(interviewService.getUserInterviews(username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Interview> getInterview(@PathVariable Long id) {
        return ResponseEntity.ok(interviewService.getInterview(id));
    }
}