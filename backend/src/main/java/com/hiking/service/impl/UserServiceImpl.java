package com.hiking.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hiking.common.CurrentUserHolder;
import com.hiking.dto.auth.UpdateUserRequest;
import com.hiking.entity.User;
import com.hiking.mapper.UserMapper;
import com.hiking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 用户服务实现
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final UserMapper userMapper;

    @Override
    public User getCurrentUser() {
        Long userId = CurrentUserHolder.getUserId();
        return userMapper.selectById(userId);
    }

    @Override
    public User updateCurrentUser(UpdateUserRequest request) {
        Long userId = CurrentUserHolder.getUserId();
        User user = userMapper.selectById(userId);
        
        if (user != null) {
            // 更新字段
            if (request.getRealName() != null) {
                user.setRealName(request.getRealName());
            }
            if (request.getMobile() != null) {
                user.setMobile(request.getMobile());
            }
            if (request.getEmail() != null) {
                user.setEmail(request.getEmail());
            }
            if (request.getExperienceLevel() != null) {
                user.setExperienceLevel(request.getExperienceLevel());
            }
            if (request.getHealthStatus() != null) {
                user.setHealthStatus(request.getHealthStatus());
            }
            if (request.getEmergencyContact() != null) {
                user.setEmergencyContact(request.getEmergencyContact());
            }
            
            userMapper.updateById(user);
        }
        
        return user;
    }
}