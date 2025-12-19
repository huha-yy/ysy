package com.hiking.service;

import com.hiking.common.PageResult;
import com.hiking.dto.trajectory.TrajectoryEventCreateRequest;
import com.hiking.dto.trajectory.TrajectoryEventQueryRequest;
import com.hiking.dto.trajectory.TrajectoryEventResolveRequest;
import com.hiking.entity.TrajectoryEvent;

/**
 * 轨迹事件服务
 */
public interface TrajectoryEventService {

    TrajectoryEvent createEvent(TrajectoryEventCreateRequest request);

    PageResult<TrajectoryEvent> pageEvents(int page, int size, TrajectoryEventQueryRequest query);

    void resolveEvent(TrajectoryEventResolveRequest request);
}

