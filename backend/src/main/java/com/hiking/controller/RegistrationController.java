package com.hiking.controller;

import com.hiking.common.PageResult;
import com.hiking.common.Result;
import com.hiking.dto.registration.RegistrationQueryRequest;
import com.hiking.dto.registration.RegistrationReviewRequest;
import com.hiking.entity.Registration;
import com.hiking.service.RegistrationService;
import com.hiking.vo.RegistrationVO;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

/**
 * 报名审核接口
 */
@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @GetMapping
    public Result<PageResult<RegistrationVO>> page(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @Valid RegistrationQueryRequest query) {
        return Result.success(registrationService.pageRegistrationsWithDetails(page, size, query));
    }

    @PatchMapping("/review")
    public Result<?> review(@Valid @RequestBody RegistrationReviewRequest request) {
        registrationService.reviewRegistration(request);
        return Result.success("审核完成");
    }
    
    /**
     * 获取当前用户对指定活动的报名状态
     */
    @GetMapping("/activity/{activityId}/user")
    public Result<Registration> getUserRegistration(@PathVariable Long activityId) {
        Registration registration = registrationService.getUserRegistrationForActivity(activityId);
        return Result.success(registration);
    }
}

