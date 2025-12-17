package com.hiking.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 轨迹事件实体
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
@TableName("trajectory_events")
@Schema(description = "轨迹事件实体")
public class TrajectoryEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "事件ID", example = "1")
    private Long id;

    @TableField("activity_id")
    @Schema(description = "活动ID", example = "1")
    private Long activityId;

    @TableField("user_id")
    @Schema(description = "用户ID", example = "100")
    private Long userId;

    @TableField("event_type")
    @Schema(description = "事件类型", example = "deviation")
    private String eventType;

    @TableField("geojson")
    @Schema(description = "轨迹GeoJSON")
    private String geojson;

    @TableField("triggered_at")
    @Schema(description = "触发时间")
    private LocalDateTime triggeredAt;

    @TableField("handled_by")
    @Schema(description = "处理人ID")
    private Long handledBy;

    @TableField("status")
    @Schema(description = "状态", example = "open", allowableValues = {"open", "resolved"})
    private String status;

    @TableField("description")
    @Schema(description = "事件描述")
    private String description;

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

