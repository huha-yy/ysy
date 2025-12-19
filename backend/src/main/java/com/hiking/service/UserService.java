package com.hiking.service;

import com.hiking.common.PageResult;
import com.hiking.dto.auth.UpdateUserRequest;
import com.hiking.entity.User;

/**
 * 用户服务接口
 */
public interface UserService {

    /**
     * 获取当前登录用户
     */
    User getCurrentUser();

    /**
     * 更新当前用户信息
     */
    User updateCurrentUser(UpdateUserRequest request);
}