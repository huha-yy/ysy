package com.hiking.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hiking.common.Constants;
import com.hiking.config.JwtTokenProvider;
import com.hiking.domain.LoginUser;
import com.hiking.dto.auth.LoginRequest;
import com.hiking.dto.auth.LoginResponse;
import com.hiking.dto.auth.RegisterRequest;
import com.hiking.entity.User;
import com.hiking.exception.BusinessException;
import com.hiking.service.AuthService;
import com.hiking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import static com.hiking.common.ResultCode.USER_ACCOUNT_EXIST;

/**
 * 认证服务实现
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final UserService userService;

    @Override
    public void register(RegisterRequest request) {
        boolean exists = userService.count(new LambdaQueryWrapper<User>().eq(User::getUsername, request.getUsername())) > 0;
        if (exists) {
            throw new BusinessException(USER_ACCOUNT_EXIST);
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(StringUtils.hasText(request.getRole()) ? request.getRole() : Constants.Role.PARTICIPANT);
        user.setRealName(request.getRealName());
        user.setMobile(request.getMobile());
        user.setEmail(request.getEmail());
        userService.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        LoginUser loginUser = (LoginUser) authentication.getPrincipal();
        String token = tokenProvider.generateToken(loginUser.getUsername(), loginUser.getUser().getId(), loginUser.getUser().getRole());
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setRole(loginUser.getUser().getRole());
        response.setUserId(loginUser.getUser().getId());
        response.setUsername(loginUser.getUser().getUsername());
        return response;
    }
}

