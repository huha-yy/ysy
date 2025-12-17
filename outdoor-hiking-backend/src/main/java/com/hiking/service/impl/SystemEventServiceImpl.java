package com.hiking.service.impl;

import com.hiking.common.Constants;
import com.hiking.entity.SystemEvent;
import com.hiking.mapper.SystemEventMapper;
import com.hiking.service.SystemEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

/**
 * 系统事件服务实现
 */
@Service
@RequiredArgsConstructor
public class SystemEventServiceImpl implements SystemEventService {

    private final SystemEventMapper systemEventMapper;

    @Override
    public void publishNotification(Long activityId, Long targetUserId, String title, String content) {
        SystemEvent event = new SystemEvent();
        event.setActivityId(activityId);
        event.setUserId(targetUserId);
        event.setEventType(Constants.SystemEventType.NOTIFICATION);
        event.setCategory(Constants.SystemEventCategory.REVIEW_RESULT);
        event.setTitle(title);
        event.setContent(content);
        event.setResourceType("activity");
        event.setResourceId(activityId);
        event.setStatus("pending");
        systemEventMapper.insert(event);
    }
}

