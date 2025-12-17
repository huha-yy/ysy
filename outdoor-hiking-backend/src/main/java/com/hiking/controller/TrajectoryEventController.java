package com.hiking.controller;

import com.hiking.common.PageResult;
import com.hiking.common.Result;
import com.hiking.dto.trajectory.TrajectoryEventCreateRequest;
import com.hiking.dto.trajectory.TrajectoryEventQueryRequest;
import com.hiking.dto.trajectory.TrajectoryEventResolveRequest;
import com.hiking.entity.TrajectoryEvent;
import com.hiking.service.TrajectoryEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 轨迹异常接口
 */
@RestController
@RequestMapping("/api/trajectory-events")
@RequiredArgsConstructor
public class TrajectoryEventController {

    private final TrajectoryEventService trajectoryEventService;

    @PostMapping
    public Result<TrajectoryEvent> create(@Valid @RequestBody TrajectoryEventCreateRequest request) {
        return Result.success(trajectoryEventService.createEvent(request));
    }

    @GetMapping
    public Result<PageResult<TrajectoryEvent>> page(@RequestParam(defaultValue = "1") int page,
                                                   @RequestParam(defaultValue = "10") int size,
                                                   @Valid TrajectoryEventQueryRequest query) {
        return Result.success(trajectoryEventService.pageEvents(page, size, query));
    }

    @PatchMapping("/resolve")
    public Result<?> resolve(@Valid @RequestBody TrajectoryEventResolveRequest request) {
        trajectoryEventService.resolveEvent(request);
        return Result.success("轨迹事件已处理");
    }
}

