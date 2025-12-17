package com.hiking.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hiking.common.PageResult;
import com.hiking.common.SecurityUtils;
import com.hiking.dto.trajectory.TrajectoryEventCreateRequest;
import com.hiking.dto.trajectory.TrajectoryEventQueryRequest;
import com.hiking.dto.trajectory.TrajectoryEventResolveRequest;
import com.hiking.entity.TrajectoryEvent;
import com.hiking.exception.BusinessException;
import com.hiking.mapper.TrajectoryEventMapper;
import com.hiking.service.SystemEventService;
import com.hiking.service.TrajectoryEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import static com.hiking.common.ResultCode.REGISTRATION_NOT_FOUND;

/**
 * 轨迹事件服务实现
 */
@Service
@RequiredArgsConstructor
public class TrajectoryEventServiceImpl extends ServiceImpl<TrajectoryEventMapper, TrajectoryEvent> implements TrajectoryEventService {

    private final TrajectoryEventMapper trajectoryEventMapper;
    private final SystemEventService systemEventService;

    @Override
    public TrajectoryEvent createEvent(TrajectoryEventCreateRequest request) {
        TrajectoryEvent event = new TrajectoryEvent();
        event.setActivityId(request.getActivityId());
        event.setUserId(request.getUserId());
        event.setEventType(request.getEventType());
        event.setGeojson(request.getGeojson());
        event.setDescription(request.getDescription());
        event.setTriggeredAt(LocalDateTime.now());
        event.setStatus("open");
        trajectoryEventMapper.insert(event);
        String title = "轨迹异常预警";
        String content = String.format("用户 %d 的轨迹事件：%s", request.getUserId(), request.getEventType());
        systemEventService.publishNotification(request.getActivityId(), request.getUserId(), title, content);
        return event;
    }

    @Override
    public PageResult<TrajectoryEvent> pageEvents(int page, int size, TrajectoryEventQueryRequest query) {
        Page<TrajectoryEvent> pager = new Page<>(page, size);
        LambdaQueryWrapper<TrajectoryEvent> wrapper = new LambdaQueryWrapper<>();
        if (query != null) {
            if (query.getActivityId() != null) {
                wrapper.eq(TrajectoryEvent::getActivityId, query.getActivityId());
            }
            if (query.getUserId() != null) {
                wrapper.eq(TrajectoryEvent::getUserId, query.getUserId());
            }
            if (query.getEventType() != null) {
                wrapper.eq(TrajectoryEvent::getEventType, query.getEventType());
            }
            if (query.getStatus() != null) {
                wrapper.eq(TrajectoryEvent::getStatus, query.getStatus());
            }
            if (query.getStartTime() != null) {
                wrapper.ge(TrajectoryEvent::getTriggeredAt, query.getStartTime());
            }
            if (query.getEndTime() != null) {
                wrapper.le(TrajectoryEvent::getTriggeredAt, query.getEndTime());
            }
        }
        wrapper.orderByDesc(TrajectoryEvent::getTriggeredAt);
        return PageResult.from(trajectoryEventMapper.selectPage(pager, wrapper));
    }

    @Override
    public void resolveEvent(TrajectoryEventResolveRequest request) {
        TrajectoryEvent event = trajectoryEventMapper.selectById(request.getId());
        if (event == null) {
            throw new BusinessException(REGISTRATION_NOT_FOUND);
        }
        event.setStatus(request.getStatus());
        event.setDescription(request.getDescription());
        event.setHandledBy(SecurityUtils.getUserId());
        trajectoryEventMapper.updateById(event);
        systemEventService.publishNotification(event.getActivityId(), event.getUserId(),
                "轨迹事件处理", "事件已标记为：" + request.getStatus());
    }
}

