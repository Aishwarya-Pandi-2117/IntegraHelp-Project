package com.integrahelp.integrahelp_backend.controller;

import com.integrahelp.integrahelp_backend.dto.*;
import com.integrahelp.integrahelp_backend.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth")
@RequiredArgsConstructor @CrossOrigin
public class AuthController {
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/guest")
    public ResponseEntity<LoginResponse> guest() {
        return ResponseEntity.ok(authService.guestLogin());
    }
}