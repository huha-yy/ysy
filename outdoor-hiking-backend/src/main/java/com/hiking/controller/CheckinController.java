package com.hiking.controller;

import com.hiking.common.PageResult;
import com.hiking.common.Result;
import com.hiking.dto.checkin.CheckinRecordQueryRequest;
import com.hiking.dto.checkin.CheckinRecordRequest;
import com.hiking.entity.CheckinRecord;
import com.hiking.service.CheckinRecordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 签到管理接口
 */
@RestController
@RequestMapping("/api/checkin-records")
@RequiredArgsConstructor
public class CheckinController {

    private final CheckinRecordService checkinRecordService;

    @PostMapping
    public Result<CheckinRecord> submit(@Valid @RequestBody CheckinRecordRequest request) {
        return Result.success(checkinRecordService.submit(request));
    }

    @GetMapping
    public Result<PageResult<CheckinRecord>> page(@RequestParam(defaultValue = "1") int page,
                                                  @RequestParam(defaultValue = "10") int size,
                                                  @Valid CheckinRecordQueryRequest query) {
        return Result.success(checkinRecordService.pageCheckins(page, size, query));
    }

    @GetMapping("/activity/{activityId}")
    public Result<List<CheckinRecord>> listByActivity(@PathVariable Long activityId) {
        return Result.success(checkinRecordService.listByActivity(activityId));
    }
}

