package com.hiking.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hiking.dto.feedback.FeedbackCreateRequest;
import com.hiking.dto.feedback.FeedbackQueryRequest;
import com.hiking.dto.feedback.FeedbackUpdateRequest;
import com.hiking.entity.ActivityFeedback;

import java.math.BigDecimal;
import java.util.List;

/**
 * 活动反馈服务接口
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
public interface ActivityFeedbackService {

    /**
     * 创建反馈
     * 用户只能为参与过的活动提交反馈
     *
     * @param request 创建请求
     * @return 反馈信息
     */
    ActivityFeedback createFeedback(FeedbackCreateRequest request);

    /**
     * 更新反馈
     * 用户只能更新自己的反馈
     *
     * @param id 反馈ID
     * @param request 更新请求
     * @return 反馈信息
     */
    ActivityFeedback updateFeedback(Long id, FeedbackUpdateRequest request);

    /**
     * 删除反馈
     * 用户只能删除自己的反馈
     *
     * @param id 反馈ID
     */
    void deleteFeedback(Long id);

    /**
     * 根据ID查询反馈
     *
     * @param id 反馈ID
     * @return 反馈信息
     */
    ActivityFeedback getFeedbackById(Long id);

    /**
     * 分页查询反馈
     *
     * @param page 页码
     * @param size 每页数量
     * @param query 查询条件
     * @return 分页结果
     */
    Page<ActivityFeedback> pageFeedbacks(int page, int size, FeedbackQueryRequest query);

    /**
     * 根据活动ID查询反馈列表
     *
     * @param activityId 活动ID
     * @return 反馈列表
     */
    List<ActivityFeedback> getFeedbacksByActivityId(Long activityId);

    /**
     * 获取活动的平均评分
     *
     * @param activityId 活动ID
     * @return 平均评分
     */
    BigDecimal getAverageRating(Long activityId);

    /**
     * 获取活动的反馈数量
     *
     * @param activityId 活动ID
     * @return 反馈数量
     */
    Long getFeedbackCount(Long activityId);

    /**
     * 检查用户是否已为活动提交过反馈
     *
     * @param activityId 活动ID
     * @param userId 用户ID
     * @return true-已提交，false-未提交
     */
    boolean hasFeedback(Long activityId, Long userId);
}

