package com.hiking.service.impl;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hiking.common.PageResult;
import com.hiking.dto.registration.RegistrationQueryRequest;
import com.hiking.dto.registration.RegistrationReviewRequest;
import com.hiking.entity.Registration;
import com.hiking.exception.BusinessException;
import com.hiking.mapper.RegistrationMapper;
import com.hiking.service.RegistrationService;
import com.hiking.service.SystemEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import static com.hiking.common.ResultCode.REGISTRATION_NOT_FOUND;

/**
 * 报名服务实现
 */
@Service
@RequiredArgsConstructor
public class RegistrationServiceImpl extends ServiceImpl<RegistrationMapper, Registration> implements RegistrationService {

    private final RegistrationMapper registrationMapper;
    private final SystemEventService systemEventService;

    @Override
    public PageResult<Registration> pageRegistrations(int page, int size, RegistrationQueryRequest query) {
        Page<Registration> pager = new Page<>(page, size);
        com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<Registration> wrapper =
                new com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper<>();
        if (query != null) {
            if (query.getActivityId() != null) {
                wrapper.eq(Registration::getActivityId, query.getActivityId());
            }
            if (StringUtils.hasText(query.getStatus())) {
                wrapper.eq(Registration::getStatus, query.getStatus());
            }
        }
        wrapper.orderByDesc(Registration::getSubmittedAt);
        return PageResult.from(registrationMapper.selectPage(pager, wrapper));
    }

    @Override
    public void reviewRegistration(RegistrationReviewRequest request) {
        Registration registration = registrationMapper.selectById(request.getId());
        if (registration == null) {
            throw new BusinessException(REGISTRATION_NOT_FOUND);
        }
        registration.setStatus(request.getStatus());
        registration.setNotes(request.getNotes());
        registrationMapper.updateById(registration);
        String title = "报名审核结果";
        String content = String.format("您参与的活动（%d）报名已“%s”", registration.getActivityId(), request.getStatus());
        systemEventService.publishNotification(registration.getActivityId(), registration.getUserId(), title, content);
    }
}

