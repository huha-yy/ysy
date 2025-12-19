package com.hiking.vo;

import com.hiking.entity.Activity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * 活动视图对象 - 包含组织者信息
 */
@Data
@Schema(description = "活动视图对象")
public class ActivityVO {
    
    @Schema(description = "活动ID")
    private Long id;
    
    @Schema(description = "组织者用户ID")
    private Long organizerId;
    
    @Schema(description = "组织者名称")
    private String organizerName;
    
    @Schema(description = "活动标题")
    private String title;
    
    @Schema(description = "简介")
    private String summary;
    
    @Schema(description = "路线难度")
    private String difficulty;
    
    @Schema(description = "地域/集合地")
    private String location;
    
    @Schema(description = "集合点描述")
    private String meetingPoint;
    
    @Schema(description = "开始时间")
    private LocalDateTime startTime;
    
    @Schema(description = "结束时间")
    private LocalDateTime endTime;
    
    @Schema(description = "人数上限")
    private Integer capacity;
    
    @Schema(description = "当前报名人数")
    private Integer currentParticipants;
    
    @Schema(description = "费用说明")
    private String feeInfo;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "资格/健康/装备要求")
    private Object requirementInfo;
    
    @Schema(description = "附件信息")
    private Object attachments;
    
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;
    
    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
    
    /**
     * 从 Activity 实体转换为 VO
     */
    public static ActivityVO fromEntity(Activity activity, String organizerName, Integer currentParticipants) {
        ActivityVO vo = new ActivityVO();
        vo.setId(activity.getId());
        vo.setOrganizerId(activity.getOrganizerId());
        vo.setOrganizerName(organizerName);
        vo.setTitle(activity.getTitle());
        vo.setSummary(activity.getSummary());
        vo.setDifficulty(activity.getDifficulty());
        vo.setLocation(activity.getLocation());
        vo.setMeetingPoint(activity.getMeetingPoint());
        vo.setStartTime(activity.getStartTime());
        vo.setEndTime(activity.getEndTime());
        vo.setCapacity(activity.getCapacity());
        vo.setCurrentParticipants(currentParticipants);
        vo.setFeeInfo(activity.getFeeInfo());
        vo.setStatus(activity.getStatus());
        vo.setRequirementInfo(activity.getRequirementInfo());
        vo.setAttachments(activity.getAttachments());
        vo.setCreatedAt(activity.getCreatedAt());
        vo.setUpdatedAt(activity.getUpdatedAt());
        return vo;
    }
}

