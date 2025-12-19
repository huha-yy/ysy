package com.hiking.dto.checkin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;

/**
 * 签到请求
 */
@Data
@Schema(description = "签到请求")
public class CheckinRecordRequest {

    @NotNull
    @Schema(description = "活动ID")
    private Long activityId;

    @NotNull
    @Schema(description = "路线ID")
    private Long routeId;

    @NotNull
    @Schema(description = "签到点索引")
    private Integer pointIndex;

    @NotBlank
    @Schema(description = "签到点名称")
    private String checkpointName;

    @NotNull
    @Schema(description = "纬度")
    private BigDecimal latitude;

    @NotNull
    @Schema(description = "经度")
    private BigDecimal longitude;

    @Schema(description = "状态", example = "on_time")
    private String status;

    @Schema(description = "定位精度（m）")
    private Integer gpsAccuracy;

    @Schema(description = "备注")
    private String notes;
}

