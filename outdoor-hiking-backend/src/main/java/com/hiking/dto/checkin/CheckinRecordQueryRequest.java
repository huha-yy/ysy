package com.hiking.dto.checkin;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 签到记录查询条件
 */
@Data
@Schema(description = "签到记录查询条件")
public class CheckinRecordQueryRequest {

    @Schema(description = "活动ID")
    private Long activityId;

    @Schema(description = "参与者ID")
    private Long userId;

    @Schema(description = "路线ID")
    private Long routeId;

    @Schema(description = "签到状态", example = "on_time")
    private String status;

    @Schema(description = "开始时间")
    private LocalDateTime startTime;

    @Schema(description = "结束时间")
    private LocalDateTime endTime;
}

