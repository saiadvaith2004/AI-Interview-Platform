package main.java.com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Allow all endpoints (auth, users, etc.)
                .allowedOrigins(System.getenv("FRONTEND_URL") != null ? System.getenv("FRONTEND_URL") : "https://ai-interview-platform-ten-gray.vercel.app")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*") // Allow all headers (Authorization, Content-Type)
                .allowCredentials(true);
    }
}