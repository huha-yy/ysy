package com.hiking.controller;

import com.hiking.common.Result;
import com.hiking.entity.ActivityStats;
import com.hiking.service.ActivityStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * 活动统计控制器
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@RestController
@RequestMapping("/api/activities/{activityId}/stats")
@RequiredArgsConstructor
public class ActivityStatsController {

    private final ActivityStatsService statsService;

    /**
     * 获取活动统计信息（公开）
     */
    @GetMapping
    public Result<ActivityStats> getStats(@PathVariable Long activityId) {
        ActivityStats stats = statsService.getStats(activityId);
        return Result.success(stats);
    }

    /**
     * 刷新活动统计数据（组织者/管理员）
     * 重新计算所有统计指标
     */
    @PostMapping("/refresh")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public Result<ActivityStats> refreshStats(@PathVariable Long activityId) {
        ActivityStats stats = statsService.refreshStats(activityId);
        return Result.success(stats);
    }
}

