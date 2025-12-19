package com.hiking.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 报名实体
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
@TableName(value = "registrations", autoResultMap = true)
@Schema(description = "报名实体")
public class Registration implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 报名记录ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "报名ID", example = "1")
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
     * 状态 (pending/approved/rejected/waiting/cancelled)
     */
    @TableField("status")
    @Schema(description = "状态", example = "pending", allowableValues = {"pending", "approved", "rejected", "waiting", "cancelled"})
    private String status;

    /**
     * 报名时间
     */
    @TableField("submitted_at")
    @Schema(description = "报名时间")
    private LocalDateTime submittedAt;

    /**
     * 审核人
     */
    @TableField("reviewed_by")
    @Schema(description = "审核人ID")
    private Long reviewedBy;

    /**
     * 审核时间
     */
    @TableField("reviewed_at")
    @Schema(description = "审核时间")
    private LocalDateTime reviewedAt;

    /**
     * 审核备注
     */
    @TableField("notes")
    @Schema(description = "审核备注")
    private String notes;

    /**
     * 健康/经验/资质详情 (JSON)
     */
    @TableField(value = "qualification_info", typeHandler = JacksonTypeHandler.class)
    @Schema(description = "资质信息")
    private Object qualificationInfo;

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

