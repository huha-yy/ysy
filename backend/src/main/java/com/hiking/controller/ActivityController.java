package com.hiking.controller;

import com.hiking.common.PageResult;
import com.hiking.common.Result;
import com.hiking.dto.activity.ActivityCreateRequest;
import com.hiking.dto.activity.ActivityRegisterRequest;
import com.hiking.dto.activity.ActivityUpdateRequest;
import com.hiking.entity.Activity;
import com.hiking.entity.Registration;
import com.hiking.service.ActivityService;
import com.hiking.vo.ActivityVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 活动管理接口
 */
@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;

    @GetMapping
    public Result<PageResult<Activity>> page(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String keyword) {
        return Result.success(activityService.pageActivities(page, size, status, keyword));
    }

    @GetMapping("/{id}")
    public Result<ActivityVO> detail(@PathVariable Long id) {
        return Result.success(activityService.getActivityVO(id));
    }

    @PostMapping
    public Result<Activity> create(@Valid @RequestBody ActivityCreateRequest request) {
        return Result.success(activityService.createActivity(request));
    }

    @PutMapping("/{id}")
    public Result<Activity> update(@PathVariable Long id, @RequestBody ActivityUpdateRequest request) {
        activityService.requireOrganizerOrAdmin(id);
        return Result.success(activityService.updateActivity(id, request));
    }

    @PatchMapping("/{id}/status")
    public Result<?> changeStatus(@PathVariable Long id, @RequestParam String status) {
        activityService.requireOrganizerOrAdmin(id);
        activityService.changeStatus(id, status);
        return Result.success("活动状态已更新");
    }
    
    @PostMapping("/{id}/registrations")
    public Result<Registration> register(@PathVariable Long id, @RequestBody ActivityRegisterRequest request) {
        return Result.success(activityService.registerActivity(id, request));
    }
}

