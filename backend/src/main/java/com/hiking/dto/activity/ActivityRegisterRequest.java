package com.hiking.dto.activity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * 活动报名请求DTO
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
@Schema(description = "活动报名请求")
public class ActivityRegisterRequest {

    /**
     * 活动ID
     */
    @NotNull(message = "活动ID不能为空")
    @Schema(description = "活动ID", example = "1")
    private Long activityId;

    /**
     * 健康/经验/资质详情
     */
    @Schema(description = "资质信息")
    private Object qualificationInfo;

    /**
     * 备注
     */
    @Schema(description = "备注", example = "我很有经验，请放心")
    private String notes;
}
