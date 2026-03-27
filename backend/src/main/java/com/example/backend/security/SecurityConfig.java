package com.example.backend.security;

import org.springframework.web.filter.CorsFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.core.Ordered;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.Customizer;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(JwtFilter jwtFilter) {
        this.jwtFilter = jwtFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // 1. MUST BE FIRST: Process CORS before any security checks
        .cors(Customizer.withDefaults()) 
        
        // 2. Disable CSRF for your JWT-based API
        .csrf(csrf -> csrf.disable())
        
        // 3. Set session to Stateless (standard for JWT)
        .sessionManagement(session -> session
            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
        )
        
        // 4. Update the Request Matchers
        .authorizeHttpRequests(auth -> auth
            // Permit the root and health check
            .requestMatchers("/", "/health").permitAll()
            
            // Permit ALL Auth endpoints (Login, Register)
            .requestMatchers("/auth/**").permitAll() 
            
            // CRITICAL: Permit OPTIONS (Preflight) requests for the entire app
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
            
            // Everything else requires a valid JWT
            .anyRequest().authenticated()
        )
        
        // 5. Add your JWT Filter
        .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

    @Bean
public FilterRegistrationBean<CorsFilter> corsFilterRegistrationBean() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowCredentials(true);
    config.setAllowedOrigins(Arrays.asList(
        "http://localhost:5173", 
        "https://ai-interview-platform-ten-gray.vercel.app"
    ));
    config.setAllowedHeaders(Arrays.asList("Origin", "Content-Type", "Accept", "Authorization"));
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    
    FilterRegistrationBean<CorsFilter> bean = new FilterRegistrationBean<>(new CorsFilter(source));
    // This line is the magic - it puts CORS at the VERY TOP of the entire app
    bean.setOrder(Ordered.HIGHEST_PRECEDENCE); 
    return bean;
}

    @Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    
    config.setAllowedOrigins(Arrays.asList(
        "http://localhost:5173", 
        "https://ai-interview-platform-ten-gray.vercel.app" // MUST match your Vercel URL
    )); 
    
    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type", "Accept", "Origin"));
    config.setAllowCredentials(true); // MUST be true if frontend uses withCredentials: true

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", config);
    return source;
}
}