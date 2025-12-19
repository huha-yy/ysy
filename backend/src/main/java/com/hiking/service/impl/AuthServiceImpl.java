package com.hiking.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hiking.common.Constants;
import com.hiking.common.CurrentUserHolder;
import com.hiking.config.JwtTokenProvider;
import com.hiking.domain.LoginUser;
import com.hiking.dto.auth.LoginRequest;
import com.hiking.dto.auth.LoginResponse;
import com.hiking.dto.auth.RegisterRequest;
import com.hiking.dto.auth.UpdateUserRequest;
import com.hiking.entity.User;
import com.hiking.exception.BusinessException;
import com.hiking.mapper.UserMapper;
import com.hiking.service.AuthService;
import com.hiking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import static com.hiking.common.ResultCode.USER_ACCOUNT_EXIST;

/**
 * 认证服务实现
 */
@Service
@RequiredArgsConstructor
public class AuthServiceImpl extends ServiceImpl<UserMapper, User> implements AuthService {

    private final JwtTokenProvider tokenProvider;

    @Override
    public void register(RegisterRequest request) {
        boolean exists = count(new LambdaQueryWrapper<User>().eq(User::getUsername, request.getUsername())) > 0;
        if (exists) {
            throw new BusinessException(USER_ACCOUNT_EXIST);
        }
        User user = new User();
        user.setUsername(request.getUsername());
        user.setPassword(request.getPassword());
        user.setRole(StringUtils.hasText(request.getRole()) ? request.getRole() : Constants.Role.PARTICIPANT);
        user.setRealName(request.getRealName());
        user.setMobile(request.getMobile());
        user.setEmail(request.getEmail());
        save(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        User user = getOne(new LambdaQueryWrapper<User>().eq(User::getUsername, request.getUsername()));
        if (user == null) {
            throw new BusinessException(com.hiking.common.ResultCode.USER_NOT_EXIST);
        }
        if (!request.getPassword().equals(user.getPassword())) {
            throw new BusinessException(com.hiking.common.ResultCode.USER_ACCOUNT_ERROR);
        }
        LoginUser loginUser = new LoginUser(user);
        String token = tokenProvider.generateToken(loginUser.getUsername(), loginUser.getUser().getId(), loginUser.getUser().getRole());
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setRole(loginUser.getUser().getRole());
        response.setUserId(loginUser.getUser().getId());
        response.setUsername(loginUser.getUser().getUsername());
        return response;
    }
}