package com.hiking.dto.trajectory;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 轨迹事件处理请求
 */
@Data
@Schema(description = "轨迹事件处理请求")
public class TrajectoryEventResolveRequest {

    @NotNull
    @Schema(description = "事件ID")
    private Long id;

    @NotBlank
    @Schema(description = "状态", example = "resolved")
    private String status;

    @Schema(description = "处理说明")
    private String description;
}

