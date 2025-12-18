package com.hiking.dto.feedback;

import lombok.Data;

import java.io.Serializable;

/**
 * 查询活动反馈请求
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
public class FeedbackQueryRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 活动ID
     */
    private Long activityId;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 最低评分
     */
    private Integer minRating;

    /**
     * 最高评分
     */
    private Integer maxRating;

    /**
     * 标签（模糊查询）
     */
    private String tag;
}

