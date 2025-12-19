package com.hiking.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 活动反馈实体
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
@TableName("activity_feedback")
@Schema(description = "活动反馈实体")
public class ActivityFeedback implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "反馈ID", example = "1")
    private Long id;

    @TableField("activity_id")
    @Schema(description = "活动ID", example = "1")
    private Long activityId;

    @TableField("user_id")
    @Schema(description = "用户ID", example = "1")
    private Long userId;

    @TableField("rating")
    @Schema(description = "评分", example = "5")
    private Integer rating;

    @TableField("comment")
    @Schema(description = "评论内容")
    private String comment;

    @TableField("tags")
    @Schema(description = "标签")
    private String tags;

    @TableField(value = "created_by", fill = FieldFill.INSERT)
    @Schema(description = "创建者ID")
    private Long createdBy;

    @TableField(value = "updated_by", fill = FieldFill.INSERT_UPDATE)
    @Schema(description = "更新者ID")
    private Long updatedBy;

    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}

