package com.example.backend.repositories;

import com.example.backend.entities.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface InterviewRepository extends JpaRepository<Interview, Long> {

    // Existing method — keep as is
    List<Interview> findByUsername(String username);

    // ✅ Count how many approved question sets exist for a topic
    @Query("SELECT COUNT(i) FROM Interview i WHERE i.topic = :topic AND i.isApproved = true AND i.questionsJson IS NOT NULL AND i.username = 'SYSTEM'")
    long countApprovedQuestionsByTopic(@Param("topic") String topic);

    // ✅ Fetch one approved question set randomly for a topic
    @Query(value = "SELECT * FROM interviews WHERE topic = :topic AND is_approved = true AND questions_json IS NOT NULL AND username = 'SYSTEM' ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Optional<Interview> findRandomApprovedQuestionsByTopic(@Param("topic") String topic);

    // ✅ Increment usage count when questions are served from DB
    @Modifying
    @Transactional
    @Query("UPDATE Interview i SET i.usageCount = i.usageCount + 1 WHERE i.id = :id")
    void incrementUsageCount(@Param("id") Long id);
}