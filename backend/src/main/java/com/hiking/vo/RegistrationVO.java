package com.hiking.vo;

import com.hiking.entity.Activity;
import com.hiking.entity.User;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 报名视图对象
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
@Schema(description = "报名视图对象")
public class RegistrationVO {

    /**
     * 报名记录ID
     */
    @Schema(description = "报名ID", example = "1")
    private Long id;

    /**
     * 活动ID
     */
    @Schema(description = "活动ID", example = "1")
    private Long activityId;

    /**
     * 参与者ID
     */
    @Schema(description = "参与者ID", example = "1")
    private Long userId;

    /**
     * 状态 (pending/approved/rejected/waiting/cancelled)
     */
    @Schema(description = "状态", example = "pending", allowableValues = {"pending", "approved", "rejected", "waiting", "cancelled"})
    private String status;

    /**
     * 报名时间
     */
    @Schema(description = "报名时间")
    private LocalDateTime submittedAt;

    /**
     * 审核人
     */
    @Schema(description = "审核人ID")
    private Long reviewedBy;

    /**
     * 审核时间
     */
    @Schema(description = "审核时间")
    private LocalDateTime reviewedAt;

    /**
     * 审核备注
     */
    @Schema(description = "审核备注")
    private String notes;

    /**
     * 健康/经验/资质详情 (JSON)
     */
    @Schema(description = "资质信息")
    private Object qualificationInfo;

    /**
     * 用户信息
     */
    @Schema(description = "用户信息")
    private User user;

    /**
     * 活动信息
     */
    @Schema(description = "活动信息")
    private Activity activity;

    /**
     * 创建者
     */
    @Schema(description = "创建者ID")
    private Long createdBy;

    /**
     * 更新者
     */
    @Schema(description = "更新者ID")
    private Long updatedBy;

    /**
     * 创建时间
     */
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}
