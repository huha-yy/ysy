package com.hiking.service;

import com.hiking.dto.auth.LoginRequest;
import com.hiking.dto.auth.LoginResponse;
import com.hiking.dto.auth.RegisterRequest;

/**
 * 认证服务
 */
public interface AuthService {

    /**
     * 注册新用户
     */
    void register(RegisterRequest request);

    /**
     * 登录
     */
    LoginResponse login(LoginRequest request);
}

