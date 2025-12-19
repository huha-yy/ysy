package com.hiking.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 活动统计实体
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
@TableName("activity_stats")
@Schema(description = "活动统计实体")
public class ActivityStats implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "activity_id")
    @Schema(description = "活动ID", example = "1")
    private Long activityId;

    @TableField("total_registrations")
    @Schema(description = "报名总数", example = "120")
    private Integer totalRegistrations;

    @TableField("approved_count")
    @Schema(description = "审核通过数", example = "100")
    private Integer approvedCount;

    @TableField("completion_rate")
    @Schema(description = "完成率", example = "92.50")
    private Double completionRate;

    @TableField("heat_score")
    @Schema(description = "热度值", example = "85.6")
    private Double heatScore;

    @TableField("reputation_score")
    @Schema(description = "组织者信誉值", example = "4.9")
    private Double reputationScore;

    @TableField("abnormal_events")
    @Schema(description = "异常事件数", example = "2")
    private Integer abnormalEvents;

    @TableField("period")
    @Schema(description = "统计周期", example = "day")
    private String period;

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

