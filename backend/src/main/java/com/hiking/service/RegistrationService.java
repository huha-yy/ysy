package com.hiking.service;

import com.hiking.common.PageResult;
import com.hiking.dto.registration.RegistrationQueryRequest;
import com.hiking.dto.registration.RegistrationReviewRequest;
import com.hiking.entity.Registration;

/**
 * 报名服务
 */
public interface RegistrationService {

    PageResult<Registration> pageRegistrations(int page, int size, RegistrationQueryRequest query);

    void reviewRegistration(RegistrationReviewRequest request);
    
    /**
     * 获取当前用户对指定活动的报名记录
     */
    Registration getUserRegistrationForActivity(Long activityId);
}

