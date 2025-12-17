package com.hiking.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.hiking.domain.LoginUser;
import com.hiking.entity.User;

/**
 * 用户服务
 */
public interface UserService extends IService<User> {

    /**
     * 根据用户名加载 LoginUser
     */
    LoginUser loadUserByUsername(String username);
}

