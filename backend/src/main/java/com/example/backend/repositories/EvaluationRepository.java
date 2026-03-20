package com.example.backend.repositories;

import com.example.backend.entities.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
    List<Evaluation> findByInterviewId(Long interviewId);
}
