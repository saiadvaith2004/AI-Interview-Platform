package com.example.backend.services;

import com.example.backend.entities.Evaluation;
import com.example.backend.repositories.EvaluationRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class EvaluationService {

    @Autowired
    private EvaluationRepository evaluationRepository;

    @Autowired
    private GeminiService geminiService;

    private final ObjectMapper objectMapper = new ObjectMapper();

    public List<Evaluation> evaluateInterview(Long interviewId, List<String> questions, List<String> answers) {
        List<Evaluation> evaluations = new ArrayList<>();

        for (int i = 0; i < questions.size(); i++) {
            String question = questions.get(i);
            String answer = i < answers.size() ? answers.get(i) : "";

            try {

                if(i>0)
                {
                    Thread.sleep(2000);
                }
                String result = geminiService.evaluateAnswer(question, answer);
                JsonNode json = objectMapper.readTree(result);

                Evaluation evaluation = new Evaluation();
                evaluation.setInterviewId(interviewId);
                evaluation.setQuestionIndex(i);
                evaluation.setQuestion(question);
                evaluation.setAnswer(answer);
                evaluation.setScore(json.path("score").asInt(5));
                evaluation.setFeedback(json.path("feedback").asText("No feedback"));
                evaluation.setStrengths(json.path("strengths").asText(""));
                evaluation.setImprovements(json.path("improvements").asText(""));

                evaluationRepository.save(evaluation);
                evaluations.add(evaluation);

            } catch (Exception e) {
                Evaluation evaluation = new Evaluation();
                evaluation.setInterviewId(interviewId);
                evaluation.setQuestionIndex(i);
                evaluation.setQuestion(question);
                evaluation.setAnswer(answer);
                evaluation.setScore(0);
                evaluation.setFeedback("Evaluation failed");
                evaluationRepository.save(evaluation);
                evaluations.add(evaluation);
            }
        }
        return evaluations;
    }

    public List<Evaluation> getEvaluations(Long interviewId) {
        return evaluationRepository.findByInterviewId(interviewId);
    }
}
