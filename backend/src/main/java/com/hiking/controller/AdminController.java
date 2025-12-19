package com.hiking.controller;

import com.hiking.common.PageResult;
import com.hiking.common.Result;
import com.hiking.entity.User;
import com.hiking.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * 管理员相关接口
 */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    /**
     * 获取所有用户列表
     */
    @GetMapping("/users")
    public Result<PageResult<User>> getAllUsers(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String keyword) {
        return Result.success(adminService.getAllUsers(page, size, keyword));
    }

    /**
     * 更改用户角色
     */
    @PutMapping("/users/{userId}/role")
    public Result<?> changeUserRole(
            @PathVariable Long userId,
            @RequestBody Map<String, String> request) {
        String role = request.get("role");
        adminService.changeUserRole(userId, role);
        return Result.success("用户角色已更新");
    }

    /**
     * 获取系统统计
     */
    @GetMapping("/stats")
    public Result<?> getSystemStats() {
        return Result.success(adminService.getSystemStats());
    }

    /**
     * 获取活动数据分析
     */
    @GetMapping("/analytics/activities")
    public Result<?> getActivitiesData(
            @RequestParam(defaultValue = "30") int days) {
        return Result.success(adminService.getActivitiesData(days));
    }

    /**
     * 获取用户数据分析
     */
    @GetMapping("/analytics/users")
    public Result<?> getUsersData(
            @RequestParam(defaultValue = "30") int days) {
        return Result.success(adminService.getUsersData(days));
    }

    /**
     * 获取地区数据分析
     */
    @GetMapping("/analytics/regions")
    public Result<?> getRegionData() {
        return Result.success(adminService.getRegionData());
    }
}
