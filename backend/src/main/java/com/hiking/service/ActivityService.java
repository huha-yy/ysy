package com.hiking.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.hiking.common.PageResult;
import com.hiking.dto.activity.ActivityCreateRequest;
import com.hiking.dto.activity.ActivityRegisterRequest;
import com.hiking.dto.activity.ActivityUpdateRequest;
import com.hiking.entity.Activity;
import com.hiking.entity.Registration;
import com.hiking.vo.ActivityVO;

/**
 * 活动服务
 */
public interface ActivityService extends IService<Activity> {

    PageResult<Activity> pageActivities(int page, int size, String status, String keyword);

    Activity createActivity(ActivityCreateRequest request);

    Activity updateActivity(Long id, ActivityUpdateRequest request);

    void changeStatus(Long id, String status);

    Activity requireOrganizerOrAdmin(Long id);
    
    // 添加获取用户活动的方法
    PageResult<Activity> getUserActivities(int page, int size, String status);
    
    // 获取活动详情（包含组织者信息）
    ActivityVO getActivityVO(Long id);
    
    // 活动报名
    Registration registerActivity(Long activityId, ActivityRegisterRequest request);
}