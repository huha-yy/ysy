package com.hiking.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hiking.common.Constants;
import com.hiking.common.ResultCode;
import com.hiking.common.SecurityUtils;
import com.hiking.dto.feedback.FeedbackCreateRequest;
import com.hiking.dto.feedback.FeedbackQueryRequest;
import com.hiking.dto.feedback.FeedbackUpdateRequest;
import com.hiking.entity.Activity;
import com.hiking.entity.ActivityFeedback;
import com.hiking.entity.Registration;
import com.hiking.exception.BusinessException;
import com.hiking.mapper.ActivityFeedbackMapper;
import com.hiking.mapper.ActivityMapper;
import com.hiking.mapper.RegistrationMapper;
import com.hiking.service.ActivityFeedbackService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 活动反馈服务实现类
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Service
@RequiredArgsConstructor
public class ActivityFeedbackServiceImpl implements ActivityFeedbackService {

    private final ActivityFeedbackMapper feedbackMapper;
    private final ActivityMapper activityMapper;
    private final RegistrationMapper registrationMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ActivityFeedback createFeedback(FeedbackCreateRequest request) {
        Long userId = SecurityUtils.getCurrentUserId();
        
        // 1. 验证活动是否存在
        Activity activity = activityMapper.selectById(request.getActivityId());
        if (activity == null) {
            throw new BusinessException(ResultCode.ACTIVITY_NOT_FOUND);
        }

        // 2. 验证活动是否已结束
        if (LocalDateTime.now().isBefore(activity.getEndTime())) {
            throw new BusinessException(ResultCode.BUSINESS_ERROR, "活动尚未结束，无法提交反馈");
        }

        // 3. 验证用户是否参与过该活动（报名状态为approved）
        LambdaQueryWrapper<Registration> registrationWrapper = new LambdaQueryWrapper<>();
        registrationWrapper.eq(Registration::getActivityId, request.getActivityId())
                          .eq(Registration::getUserId, userId)
                          .eq(Registration::getStatus, Constants.RegistrationStatus.APPROVED);
        
        Registration registration = registrationMapper.selectOne(registrationWrapper);
        if (registration == null) {
            throw new BusinessException(ResultCode.FORBIDDEN, "只有参与过该活动的用户才能提交反馈");
        }

        // 4. 检查是否已提交过反馈
        if (hasFeedback(request.getActivityId(), userId)) {
            throw new BusinessException(ResultCode.BUSINESS_ERROR, "您已为该活动提交过反馈");
        }

        // 5. 创建反馈
        ActivityFeedback feedback = new ActivityFeedback();
        BeanUtils.copyProperties(request, feedback);
        feedback.setUserId(userId);

        feedbackMapper.insert(feedback);
        return feedback;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ActivityFeedback updateFeedback(Long id, FeedbackUpdateRequest request) {
        // 1. 检查反馈是否存在
        ActivityFeedback feedback = getFeedbackById(id);

        // 2. 权限校验：只有反馈创建者本人可以修改
        Long userId = SecurityUtils.getCurrentUserId();
        if (!feedback.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "只能修改自己的反馈");
        }

        // 3. 更新反馈
        if (request.getRating() != null) {
            feedback.setRating(request.getRating());
        }
        if (request.getComment() != null) {
            feedback.setComment(request.getComment());
        }
        if (request.getTags() != null) {
            feedback.setTags(request.getTags());
        }

        feedbackMapper.updateById(feedback);
        return feedback;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteFeedback(Long id) {
        // 1. 检查反馈是否存在
        ActivityFeedback feedback = getFeedbackById(id);

        // 2. 权限校验：只有反馈创建者本人或管理员可以删除
        Long userId = SecurityUtils.getCurrentUserId();
        String role = SecurityUtils.getCurrentUserRole();
        
        if (!feedback.getUserId().equals(userId) && !Constants.Role.ADMIN.equals(role)) {
            throw new BusinessException(ResultCode.FORBIDDEN, "只能删除自己的反馈");
        }

        // 3. 删除反馈
        feedbackMapper.deleteById(id);
    }

    @Override
    public ActivityFeedback getFeedbackById(Long id) {
        ActivityFeedback feedback = feedbackMapper.selectById(id);
        if (feedback == null) {
            throw new BusinessException(ResultCode.NOT_FOUND, "反馈不存在");
        }
        return feedback;
    }

    @Override
    public Page<ActivityFeedback> pageFeedbacks(int page, int size, FeedbackQueryRequest query) {
        Page<ActivityFeedback> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<ActivityFeedback> wrapper = new LambdaQueryWrapper<>();

        if (query != null) {
            if (query.getActivityId() != null) {
                wrapper.eq(ActivityFeedback::getActivityId, query.getActivityId());
            }
            if (query.getUserId() != null) {
                wrapper.eq(ActivityFeedback::getUserId, query.getUserId());
            }
            if (query.getMinRating() != null) {
                wrapper.ge(ActivityFeedback::getRating, query.getMinRating());
            }
            if (query.getMaxRating() != null) {
                wrapper.le(ActivityFeedback::getRating, query.getMaxRating());
            }
            if (StringUtils.hasText(query.getTag())) {
                wrapper.like(ActivityFeedback::getTags, query.getTag());
            }
        }

        wrapper.orderByDesc(ActivityFeedback::getCreatedAt);
        return feedbackMapper.selectPage(pageParam, wrapper);
    }

    @Override
    public List<ActivityFeedback> getFeedbacksByActivityId(Long activityId) {
        LambdaQueryWrapper<ActivityFeedback> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ActivityFeedback::getActivityId, activityId)
               .orderByDesc(ActivityFeedback::getCreatedAt);
        return feedbackMapper.selectList(wrapper);
    }

    @Override
    public BigDecimal getAverageRating(Long activityId) {
        BigDecimal avgRating = feedbackMapper.getAverageRating(activityId);
        return avgRating != null ? avgRating : BigDecimal.ZERO;
    }

    @Override
    public Long getFeedbackCount(Long activityId) {
        Long count = feedbackMapper.countByActivityId(activityId);
        return count != null ? count : 0L;
    }

    @Override
    public boolean hasFeedback(Long activityId, Long userId) {
        LambdaQueryWrapper<ActivityFeedback> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(ActivityFeedback::getActivityId, activityId)
               .eq(ActivityFeedback::getUserId, userId);
        return feedbackMapper.selectCount(wrapper) > 0;
    }
}

