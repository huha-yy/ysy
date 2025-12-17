package com.hiking.dto.trajectory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 创建轨迹异常请求
 */
@Data
@Schema(description = "轨迹事件创建")
public class TrajectoryEventCreateRequest {

    @NotNull
    @Schema(description = "活动ID")
    private Long activityId;

    @NotNull
    @Schema(description = "用户ID")
    private Long userId;

    @NotBlank
    @Schema(description = "事件类型", example = "deviation")
    private String eventType;

    @Schema(description = "GeoJSON轨迹")
    private String geojson;

    @Schema(description = "事件描述")
    private String description;
}

