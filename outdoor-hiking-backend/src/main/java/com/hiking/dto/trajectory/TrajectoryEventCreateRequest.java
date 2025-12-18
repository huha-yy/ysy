package com.hiking.dto.trajectory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.math.BigDecimal;

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
    
    @Schema(description = "路线ID")
    private Long routeId;
    
    @Schema(description = "点位索引")
    private Integer pointIndex;

    @NotBlank
    @Schema(description = "事件类型", example = "deviation")
    private String eventType;
    
    @Schema(description = "纬度")
    private BigDecimal latitude;
    
    @Schema(description = "经度")
    private BigDecimal longitude;

    @Schema(description = "GeoJSON轨迹")
    private String geojson;

    @Schema(description = "事件描述")
    private String description;
    
    @Schema(description = "严重程度", example = "warning")
    private String severity;
}

