package com.integrahelp.integrahelp_backend.service;

import com.integrahelp.integrahelp_backend.dto.*;
import com.integrahelp.integrahelp_backend.model.User;
import com.integrahelp.integrahelp_backend.repository.UserRepository;
import com.integrahelp.integrahelp_backend.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service @RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authManager;
    private final JwtTokenProvider jwtProvider;
    private final UserRepository userRepo;

    public LoginResponse login(LoginRequest req) {
        Authentication auth = authManager.authenticate(
            new UsernamePasswordAuthenticationToken(req.getUsername(), req.getPassword()));
        User user = userRepo.findByUsername(req.getUsername()).orElseThrow();
        String token = jwtProvider.generateToken(user.getUsername(), user.getRole().name());
        return LoginResponse.builder()
            .token(token).role(user.getRole().name())
            .username(user.getUsername()).fullName(user.getFullName())
            .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
            .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
            .build();
    }

    public LoginResponse guestLogin() {
        String token = jwtProvider.generateToken("guest_" + System.currentTimeMillis(), "GUEST");
        return LoginResponse.builder().token(token).role("GUEST")
            .username("guest").fullName("Anonymous").build();
    }
}
