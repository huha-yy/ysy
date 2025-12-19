package com.hiking.controller;

import com.hiking.common.PageResult;
import com.hiking.common.Result;
import com.hiking.dto.registration.RegistrationQueryRequest;
import com.hiking.dto.registration.RegistrationReviewRequest;
import com.hiking.entity.Registration;
import com.hiking.service.RegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * 报名审核接口
 */
@RestController
@RequestMapping("/api/registrations")
@RequiredArgsConstructor
public class RegistrationController {

    private final RegistrationService registrationService;

    @GetMapping
    public Result<PageResult<Registration>> page(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @Valid RegistrationQueryRequest query) {
        return Result.success(registrationService.pageRegistrations(page, size, query));
    }

    @PatchMapping("/review")
    public Result<?> review(@Valid @RequestBody RegistrationReviewRequest request) {
        registrationService.reviewRegistration(request);
        return Result.success("审核完成");
    }
}

