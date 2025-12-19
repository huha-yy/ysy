package com.hiking.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 签到记录实体
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
@TableName("checkin_records")
@Schema(description = "签到记录实体")
public class CheckinRecord implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 签到记录ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "签到记录ID", example = "1")
    private Long id;

    /**
     * 活动ID
     */
    @TableField("activity_id")
    @Schema(description = "活动ID", example = "1")
    private Long activityId;

    /**
     * 参与者ID
     */
    @TableField("user_id")
    @Schema(description = "参与者ID", example = "1")
    private Long userId;

    /**
     * 路线ID
     */
    @TableField("route_id")
    @Schema(description = "路线ID", example = "1")
    private Long routeId;

    /**
     * points_info 中点位索引
     */
    @TableField("point_index")
    @Schema(description = "点位索引", example = "2")
    private Integer pointIndex;

    /**
     * 签到点名称（冗余展示）
     */
    @TableField("checkpoint_name")
    @Schema(description = "签到点名称", example = "A 段中途点")
    private String checkpointName;

    /**
     * 签到时间
     */
    @TableField("timestamp")
    @Schema(description = "签到时间")
    private LocalDateTime timestamp;

    /**
     * 签到纬度
     */
    @TableField("latitude")
    @Schema(description = "签到纬度", example = "30.203")
    private BigDecimal latitude;

    /**
     * 签到经度
     */
    @TableField("longitude")
    @Schema(description = "签到经度", example = "120.275")
    private BigDecimal longitude;

    /**
     * 状态 (on_time/late/missed)
     */
    @TableField("status")
    @Schema(description = "状态", example = "on_time", allowableValues = {"on_time", "late", "missed"})
    private String status;

    /**
     * 定位精度（m）
     */
    @TableField("gps_accuracy")
    @Schema(description = "GPS精度（m）", example = "10")
    private Integer gpsAccuracy;

    /**
     * 备注
     */
    @TableField("notes")
    @Schema(description = "备注")
    private String notes;

    /**
     * 创建者
     */
    @TableField(value = "created_by", fill = FieldFill.INSERT)
    @Schema(description = "创建者ID")
    private Long createdBy;

    /**
     * 更新者
     */
    @TableField(value = "updated_by", fill = FieldFill.INSERT_UPDATE)
    @Schema(description = "更新者ID")
    private Long updatedBy;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}

