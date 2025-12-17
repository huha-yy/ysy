package com.hiking.service;

/**
 * 系统事件服务
 */
public interface SystemEventService {

    /**
     * 发布通知事件
     */
    void publishNotification(Long activityId, Long targetUserId, String title, String content);
}

