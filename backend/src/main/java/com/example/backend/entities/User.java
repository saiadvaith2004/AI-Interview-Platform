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

    @Size(min = 7, message = "Password must be at least 7 characters long")
    @Pattern(regexp = "^(?=.*[0-9])(?=.*[!@#$%^&*]).*$", 
             message = "Password must contain at least one number and one special character")

    @Column(nullable = false)         
    private String password;

    @Column(columnDefinition = "LONGBLOB")
    private byte[] resume;

    private String resumeFileName;

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
}