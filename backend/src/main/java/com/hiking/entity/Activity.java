package com.hiking.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 活动实体
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
@TableName(value = "activities", autoResultMap = true)
@Schema(description = "活动实体")
public class Activity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 活动主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "活动ID", example = "1")
    private Long id;

    /**
     * 组织者用户ID
     */
    @TableField("organizer_id")
    @Schema(description = "组织者用户ID", example = "1")
    private Long organizerId;

    /**
     * 活动标题
     */
    @TableField("title")
    @Schema(description = "活动标题", example = "东部峡谷徒步")
    private String title;

    /**
     * 简介
     */
    @TableField("summary")
    @Schema(description = "简介")
    private String summary;

    /**
     * 路线难度
     */
    @TableField("difficulty")
    @Schema(description = "路线难度", example = "中级")
    private String difficulty;

    /**
     * 地域/集合地
     */
    @TableField("location")
    @Schema(description = "地域/集合地", example = "杭州市富阳区")
    private String location;

    /**
     * 集合点描述
     */
    @TableField("meeting_point")
    @Schema(description = "集合点描述", example = "大源村广场")
    private String meetingPoint;

    /**
     * 开始时间
     */
    @TableField("start_time")
    @Schema(description = "开始时间")
    private LocalDateTime startTime;

    /**
     * 结束时间
     */
    @TableField("end_time")
    @Schema(description = "结束时间")
    private LocalDateTime endTime;

    /**
     * 人数上限
     */
    @TableField("capacity")
    @Schema(description = "人数上限", example = "50")
    private Integer capacity;

    /**
     * 费用说明
     */
    @TableField("fee_info")
    @Schema(description = "费用说明", example = "100元/人（含领队）")
    private String feeInfo;

    /**
     * 状态 (draft/pending/approved/closed)
     */
    @TableField("status")
    @Schema(description = "状态", example = "approved", allowableValues = {"draft", "pending", "approved", "closed", "rejected"})
    private String status;

    /**
     * 资格/健康/装备要求 (JSON)
     */
    @TableField(value = "requirement_info", typeHandler = JacksonTypeHandler.class)
    @Schema(description = "资格/健康/装备要求")
    private Object requirementInfo;

    /**
     * 路线/健康档案等文件 (JSON)
     */
    @TableField(value = "attachments", typeHandler = JacksonTypeHandler.class)
    @Schema(description = "附件信息")
    private Object attachments;

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

