package com.hiking.controller;

import com.hiking.common.Result;
import com.hiking.dto.auth.LoginRequest;
import com.hiking.dto.auth.LoginResponse;
import com.hiking.dto.auth.RegisterRequest;
import com.hiking.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 认证相关接口
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public Result<?> register(@Valid @RequestBody RegisterRequest request) {
        authService.register(request);
        return Result.success("注册成功，请使用登录接口获取 Token");
    }

    @PostMapping("/login")
    public Result<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return Result.success(authService.login(request));
    }
}

