package com.hiking.entity;

import com.baomidou.mybatisplus.annotation.*;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 系统事件实体
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
@TableName("system_events")
@Schema(description = "系统事件实体")
public class SystemEvent implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "事件ID", example = "1")
    private Long id;

    @TableField("activity_id")
    @Schema(description = "关联活动ID")
    private Long activityId;

    @TableField("user_id")
    @Schema(description = "用户ID")
    private Long userId;

    @TableField("event_type")
    @Schema(description = "事件类型", example = "notification")
    private String eventType;

    @TableField("category")
    @Schema(description = "事件分类", example = "review_result")
    private String category;

    @TableField("title")
    @Schema(description = "事件标题")
    private String title;

    @TableField("content")
    @Schema(description = "事件内容")
    private String content;

    @TableField("resource_type")
    @Schema(description = "资源类型")
    private String resourceType;

    @TableField("resource_id")
    @Schema(description = "资源ID")
    private Long resourceId;

    @TableField("status")
    @Schema(description = "状态", example = "pending")
    private String status;

    @TableField("ip_address")
    @Schema(description = "IP地址")
    private String ipAddress;

    @TableField("sent_at")
    @Schema(description = "触发时间")
    private LocalDateTime sentAt;

    @TableField("read_at")
    @Schema(description = "阅读时间")
    private LocalDateTime readAt;

    @TableField(value = "created_by", fill = FieldFill.INSERT)
    @Schema(description = "创建者ID")
    private Long createdBy;

    @TableField(value = "updated_by", fill = FieldFill.INSERT_UPDATE)
    @Schema(description = "更新者ID")
    private Long updatedBy;

    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}

