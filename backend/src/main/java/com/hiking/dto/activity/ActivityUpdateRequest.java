package com.hiking.dto.activity;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 更新活动请求
 */
@Data
@Schema(description = "更新活动请求")
public class ActivityUpdateRequest {

    @Schema(description = "活动标题")
    private String title;

    @Schema(description = "活动简介")
    private String summary;

    @Schema(description = "活动难度")
    private String difficulty;

    @Schema(description = "地点")
    private String location;

    @Schema(description = "集合点")
    private String meetingPoint;

    @Schema(description = "开始时间")
    private LocalDateTime startTime;

    @Schema(description = "结束时间")
    private LocalDateTime endTime;

    @Schema(description = "人数上限")
    private Integer capacity;

    @Schema(description = "费用说明")
    private String feeInfo;

    @Schema(description = "资格/健康要求(JSON)")
    private String requirementInfo;

    @Schema(description = "附件列表(JSON)")
    private String attachments;
}

