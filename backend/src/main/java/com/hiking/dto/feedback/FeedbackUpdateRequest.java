package com.hiking.dto.feedback;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.io.Serializable;

/**
 * 更新活动反馈请求
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
public class FeedbackUpdateRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 评分（1-5分）
     */
    @Min(value = 1, message = "评分最低为1分")
    @Max(value = 5, message = "评分最高为5分")
    private Integer rating;

    /**
     * 评论内容
     */
    @Size(max = 1000, message = "评论内容不能超过1000个字符")
    private String comment;

    /**
     * 标签（多个标签用逗号分隔）
     */
    @Size(max = 255, message = "标签不能超过255个字符")
    private String tags;
}

