package com.hiking.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hiking.domain.LoginUser;
import com.hiking.entity.User;
import com.hiking.exception.BusinessException;
import com.hiking.mapper.UserMapper;
import com.hiking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import static com.hiking.common.ResultCode.USER_NOT_EXIST;

/**
 * 用户服务实现
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl extends ServiceImpl<UserMapper, User> implements UserService {

    private final UserMapper userMapper;

    @Override
    public LoginUser loadUserByUsername(String username) {
        User user = userMapper.selectOne(new LambdaQueryWrapper<User>().eq(User::getUsername, username));
        if (user == null) {
            throw new BusinessException(USER_NOT_EXIST);
        }
        return new LoginUser(user);
    }
}

