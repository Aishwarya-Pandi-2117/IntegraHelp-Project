package com.integrahelp.integrahelp_backend.config;

import com.integrahelp.integrahelp_backend.security.JwtAuthFilter;
import org.springframework.security.config.Customizer;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.*;
import org.springframework.security.authentication.*;
import org.springframework.security.config.annotation.authentication.configuration.*;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

@Configuration @EnableMethodSecurity @RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(c -> c.disable())
            .cors(Customizer.withDefaults())
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
	            .requestMatchers("/api/auth/**").permitAll()
	            .requestMatchers("/api/departments/**").permitAll()
	            .requestMatchers(HttpMethod.POST, "/api/tickets").authenticated()
	            .requestMatchers(HttpMethod.GET, "/api/tickets/my").authenticated()
	            .requestMatchers("/api/tickets/department/**").hasRole("ADMIN")
	            .requestMatchers("/api/tickets/all").hasRole("ADMIN")
	            .requestMatchers("/api/tickets/*/status").hasRole("ADMIN")
	
	            .anyRequest().authenticated())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() { return new BCryptPasswordEncoder(); }

    @Bean
    public AuthenticationManager authManager(AuthenticationConfiguration c)
            throws Exception { return c.getAuthenticationManager(); }
}