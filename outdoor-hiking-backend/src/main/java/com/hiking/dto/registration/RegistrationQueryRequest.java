package com.hiking.dto.registration;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 报名分页查询条件
 */
@Data
@Schema(description = "报名分页查询条件")
public class RegistrationQueryRequest {

    @Schema(description = "活动ID")
    private Long activityId;

    @Schema(description = "审核状态")
    private String status;
}

