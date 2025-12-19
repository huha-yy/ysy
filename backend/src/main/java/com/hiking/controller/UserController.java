package com.hiking.controller;

import com.hiking.common.PageResult;
import com.hiking.common.Result;
import com.hiking.entity.Activity;
import com.hiking.entity.CheckinRecord;
import com.hiking.service.ActivityService;
import com.hiking.service.CheckinRecordService;
import com.hiking.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 用户相关接口
 */
@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final ActivityService activityService;
    private final CheckinRecordService checkinRecordService;

    /**
     * 获取用户参与的活动列表
     */
    @GetMapping("/activities")
    public Result<PageResult<Activity>> getUserActivities(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String status) {
        return Result.success(activityService.getUserActivities(page, size, status));
    }

    /**
     * 获取用户的签到记录
     */
    @GetMapping("/checkins")
    public Result<PageResult<CheckinRecord>> getUserCheckins(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size) {
        return Result.success(checkinRecordService.getUserCheckins(page, size));
    }
}