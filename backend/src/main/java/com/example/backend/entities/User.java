package com.example.backend.entities;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    // Note: We keep these for the initial RequestBody validation, 
    // but the column length must be large enough for BCrypt (60+ chars).
    @Column(nullable = false, length = 255)         
    private String password;

    @Column(columnDefinition = "LONGBLOB")
    private byte[] resume;

    private String resumeFileName;

    // Standard for Spring Security - Defaults to "USER"
    private String role = "ROLE_USER";

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public byte[] getResume() { return resume; }
    public void setResume(byte[] resume) { this.resume = resume; }
    public String getResumeFileName() { return resumeFileName; }
    public void setResumeFileName(String resumeFileName) { this.resumeFileName = resumeFileName; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}