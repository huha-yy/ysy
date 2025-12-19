package com.hiking.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hiking.common.CurrentUserHolder;
import com.hiking.dto.auth.UpdateUserRequest;
import com.hiking.entity.User;
import com.hiking.mapper.UserMapper;
import com.hiking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

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
    @Transactional(rollbackFor = Exception.class)
    public User updateCurrentUser(UpdateUserRequest request) {
        Long userId = CurrentUserHolder.getUserId();
        User user = userMapper.selectById(userId);
        
        if (user != null) {
            // 更新字段
            if (StringUtils.hasText(request.getRealName())) {
                user.setRealName(request.getRealName());
            }
            if (StringUtils.hasText(request.getMobile())) {
                user.setMobile(request.getMobile());
            }
            if (StringUtils.hasText(request.getEmail())) {
                user.setEmail(request.getEmail());
            }
            if (StringUtils.hasText(request.getExperienceLevel())) {
                user.setExperienceLevel(request.getExperienceLevel());
            }
            if (StringUtils.hasText(request.getHealthStatus())) {
                user.setHealthStatus(request.getHealthStatus());
            }
            if (StringUtils.hasText(request.getEmergencyContact())) {
                user.setEmergencyContact(request.getEmergencyContact());
            }
            
            // 手动设置更新时间
            user.setUpdatedBy(userId);
            
            // 直接使用mapper的updateById方法
            int result = userMapper.updateById(user);
            System.out.println("用户更新结果: " + result);
            
            // 返回更新后的用户信息
            return userMapper.selectById(userId);
        }
        
        return user;
    }
}