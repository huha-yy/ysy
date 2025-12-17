package com.hiking.service.impl;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hiking.common.Constants;
import com.hiking.common.PageResult;
import com.hiking.common.SecurityUtils;
import com.hiking.dto.activity.ActivityCreateRequest;
import com.hiking.dto.activity.ActivityUpdateRequest;
import com.hiking.entity.Activity;
import com.hiking.exception.BusinessException;
import com.hiking.mapper.ActivityMapper;
import com.hiking.service.ActivityService;
import com.hiking.service.SystemEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import static com.hiking.common.ResultCode.ACTIVITY_NOT_FOUND;
import static com.hiking.common.ResultCode.FORBIDDEN;

/**
 * 活动服务实现
 */
@Service
@RequiredArgsConstructor
public class ActivityServiceImpl extends ServiceImpl<ActivityMapper, Activity> implements ActivityService {

    private final ActivityMapper activityMapper;
    private final SystemEventService systemEventService;

    @Override
    public PageResult<Activity> pageActivities(int page, int size, String status, String keyword) {
        Page<Activity> pager = new Page<>(page, size);
        LambdaQueryWrapper<Activity> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(status)) {
            wrapper.eq(Activity::getStatus, status);
        }
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Activity::getTitle, keyword).or().like(Activity::getSummary, keyword));
        }
        wrapper.orderByDesc(Activity::getStartTime);
        return PageResult.from(activityMapper.selectPage(pager, wrapper));
    }

    @Override
    public Activity createActivity(ActivityCreateRequest request) {
        Activity activity = new Activity();
        activity.setTitle(request.getTitle());
        activity.setSummary(request.getSummary());
        activity.setDifficulty(request.getDifficulty());
        activity.setLocation(request.getLocation());
        activity.setMeetingPoint(request.getMeetingPoint());
        activity.setStartTime(request.getStartTime());
        activity.setEndTime(request.getEndTime());
        activity.setCapacity(request.getCapacity());
        activity.setFeeInfo(request.getFeeInfo());
        activity.setRequirementInfo(request.getRequirementInfo());
        activity.setAttachments(request.getAttachments());
        activity.setOrganizerId(SecurityUtils.getUserId());
        activity.setStatus(Constants.ActivityStatus.PENDING);
        activityMapper.insert(activity);
        return activity;
    }

    @Override
    public Activity updateActivity(Long id, ActivityUpdateRequest request) {
        Activity activity = requireOrganizerOrAdmin(id);
        if (StringUtils.hasText(request.getTitle())) {
            activity.setTitle(request.getTitle());
        }
        if (StringUtils.hasText(request.getSummary())) {
            activity.setSummary(request.getSummary());
        }
        if (StringUtils.hasText(request.getDifficulty())) {
            activity.setDifficulty(request.getDifficulty());
        }
        if (StringUtils.hasText(request.getLocation())) {
            activity.setLocation(request.getLocation());
        }
        if (StringUtils.hasText(request.getMeetingPoint())) {
            activity.setMeetingPoint(request.getMeetingPoint());
        }
        if (request.getStartTime() != null) {
            activity.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            activity.setEndTime(request.getEndTime());
        }
        if (ObjectUtil.isNotNull(request.getCapacity())) {
            activity.setCapacity(request.getCapacity());
        }
        if (StringUtils.hasText(request.getFeeInfo())) {
            activity.setFeeInfo(request.getFeeInfo());
        }
        if (StringUtils.hasText(request.getRequirementInfo())) {
            activity.setRequirementInfo(request.getRequirementInfo());
        }
        if (StringUtils.hasText(request.getAttachments())) {
            activity.setAttachments(request.getAttachments());
        }
        activityMapper.updateById(activity);
        return activity;
    }

    @Override
    public void changeStatus(Long id, String status) {
        Activity activity = requireOrganizerOrAdmin(id);
        activity.setStatus(status);
        activityMapper.updateById(activity);
        String message = "活动“" + activity.getTitle() + "”已更新状态为：" + status;
        systemEventService.publishNotification(activity.getId(), activity.getOrganizerId(), "活动审核状态变更", message);
    }

    @Override
    public Activity requireOrganizerOrAdmin(Long id) {
        Activity activity = activityMapper.selectById(id);
        if (activity == null) {
            throw new BusinessException(ACTIVITY_NOT_FOUND);
        }
        Long currentUserId = SecurityUtils.getUserId();
        if (!SecurityUtils.isAdmin() && !activity.getOrganizerId().equals(currentUserId)) {
            throw new BusinessException(FORBIDDEN);
        }
        return activity;
    }
}

