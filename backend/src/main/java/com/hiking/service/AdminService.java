package com.hiking.service;

import com.hiking.common.PageResult;
import com.hiking.entity.User;

import java.util.List;
import java.util.Map;

/**
 * 管理员服务接口
 */
public interface AdminService {

    /**
     * 获取所有用户列表
     */
    PageResult<User> getAllUsers(int page, int size, String keyword);

    /**
     * 更改用户角色
     */
    void changeUserRole(Long userId, String role);

    /**
     * 获取系统统计
     */
    Map<String, Object> getSystemStats();

    /**
     * 获取活动数据分析
     */
    List<Map<String, Object>> getActivitiesData(int days);

    /**
     * 获取用户数据分析
     */
    List<Map<String, Object>> getUsersData(int days);

    /**
     * 获取地区数据分析
     */
    List<Map<String, Object>> getRegionData();
}
