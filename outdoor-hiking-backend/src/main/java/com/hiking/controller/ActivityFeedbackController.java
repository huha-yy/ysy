package com.hiking.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hiking.common.PageResult;
import com.hiking.common.Result;
import com.hiking.dto.feedback.FeedbackCreateRequest;
import com.hiking.dto.feedback.FeedbackQueryRequest;
import com.hiking.dto.feedback.FeedbackUpdateRequest;
import com.hiking.entity.ActivityFeedback;
import com.hiking.service.ActivityFeedbackService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 活动反馈控制器
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@RestController
@RequestMapping("/api/feedbacks")
@RequiredArgsConstructor
public class ActivityFeedbackController {

    private final ActivityFeedbackService feedbackService;

    /**
     * 创建反馈（参与者）
     */
    @PostMapping
    @PreAuthorize("hasRole('PARTICIPANT')")
    public Result<ActivityFeedback> createFeedback(@Valid @RequestBody FeedbackCreateRequest request) {
        ActivityFeedback feedback = feedbackService.createFeedback(request);
        return Result.success(feedback);
    }

    /**
     * 更新反馈（参与者本人）
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('PARTICIPANT')")
    public Result<ActivityFeedback> updateFeedback(@PathVariable Long id,
                                                   @Valid @RequestBody FeedbackUpdateRequest request) {
        ActivityFeedback feedback = feedbackService.updateFeedback(id, request);
        return Result.success(feedback);
    }

    /**
     * 删除反馈（参与者本人或管理员）
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('PARTICIPANT', 'ADMIN')")
    public Result<Void> deleteFeedback(@PathVariable Long id) {
        feedbackService.deleteFeedback(id);
        return Result.success();
    }

    /**
     * 查询反馈详情（公开）
     */
    @GetMapping("/{id}")
    public Result<ActivityFeedback> getFeedback(@PathVariable Long id) {
        ActivityFeedback feedback = feedbackService.getFeedbackById(id);
        return Result.success(feedback);
    }

    /**
     * 分页查询反馈（公开）
     */
    @GetMapping("/page")
    public Result<PageResult<ActivityFeedback>> pageFeedbacks(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @ModelAttribute FeedbackQueryRequest query) {
        Page<ActivityFeedback> pageResult = feedbackService.pageFeedbacks(page, size, query);
        return Result.success(PageResult.of(pageResult));
    }

    /**
     * 根据活动ID查询反馈列表（公开）
     */
    @GetMapping("/activity/{activityId}")
    public Result<List<ActivityFeedback>> getFeedbacksByActivity(@PathVariable Long activityId) {
        List<ActivityFeedback> feedbacks = feedbackService.getFeedbacksByActivityId(activityId);
        return Result.success(feedbacks);
    }

    /**
     * 获取活动的反馈统计（公开）
     */
    @GetMapping("/activity/{activityId}/statistics")
    public Result<Map<String, Object>> getFeedbackStatistics(@PathVariable Long activityId) {
        Map<String, Object> statistics = new HashMap<>();
        
        // 平均评分
        BigDecimal avgRating = feedbackService.getAverageRating(activityId);
        statistics.put("averageRating", avgRating);
        
        // 反馈数量
        Long feedbackCount = feedbackService.getFeedbackCount(activityId);
        statistics.put("feedbackCount", feedbackCount);
        
        return Result.success(statistics);
    }
}

