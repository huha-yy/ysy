package com.hiking.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.hiking.common.Constants;
import com.hiking.common.ResultCode;
import com.hiking.entity.*;
import com.hiking.exception.BusinessException;
import com.hiking.mapper.*;
import com.hiking.service.ActivityStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * 活动统计服务实现类
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Service
@RequiredArgsConstructor
public class ActivityStatsServiceImpl implements ActivityStatsService {

    private final ActivityStatsMapper statsMapper;
    private final ActivityMapper activityMapper;
    private final RegistrationMapper registrationMapper;
    private final CheckinRecordMapper checkinRecordMapper;
    private final TrajectoryEventMapper trajectoryEventMapper;
    private final ActivityFeedbackMapper feedbackMapper;
    private final RouteMapper routeMapper;

    @Override
    public ActivityStats getStats(Long activityId) {
        // 验证活动是否存在
        Activity activity = activityMapper.selectById(activityId);
        if (activity == null) {
            throw new BusinessException(ResultCode.ACTIVITY_NOT_FOUND);
        }

        // 查询统计数据
        ActivityStats stats = statsMapper.selectById(activityId);
        
        // 如果不存在，则创建并计算
        if (stats == null) {
            return refreshStats(activityId);
        }

        return stats;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ActivityStats refreshStats(Long activityId) {
        // 验证活动是否存在
        Activity activity = activityMapper.selectById(activityId);
        if (activity == null) {
            throw new BusinessException(ResultCode.ACTIVITY_NOT_FOUND);
        }

        // 查询或创建统计记录
        ActivityStats stats = statsMapper.selectById(activityId);
        if (stats == null) {
            stats = new ActivityStats();
            stats.setActivityId(activityId);
            stats.setPeriod("all"); // 全周期统计
        }

        // 计算各项统计指标
        stats.setTotalRegistrations(countTotalRegistrations(activityId));
        stats.setApprovedCount(countApprovedRegistrations(activityId));
        stats.setCompletionRate(calculateCompletionRate(activityId));
        stats.setHeatScore(calculateHeatScore(activityId));
        stats.setReputationScore(calculateReputationScore(activityId));
        stats.setAbnormalEvents(countAbnormalEvents(activityId));

        // 保存或更新
        if (stats.getCreatedAt() == null) {
            statsMapper.insert(stats);
        } else {
            statsMapper.updateById(stats);
        }

        return stats;
    }

    @Override
    public Double calculateCompletionRate(Long activityId) {
        // 1. 获取审核通过的参与者数
        Integer approvedCount = countApprovedRegistrations(activityId);
        if (approvedCount == 0) {
            return 0.0;
        }

        // 2. 统计签到总数
        LambdaQueryWrapper<CheckinRecord> checkinWrapper = new LambdaQueryWrapper<>();
        checkinWrapper.eq(CheckinRecord::getActivityId, activityId);
        Long totalCheckins = checkinRecordMapper.selectCount(checkinWrapper);

        // 完成率 = (签到记录数 / 审核通过人数) 的百分比，最高100%
        double rate = (totalCheckins.doubleValue() / approvedCount) * 100;
        return Math.min(rate, 100.0);
    }

    @Override
    public Double calculateHeatScore(Long activityId) {
        // 热度值综合计算：报名数(40%) + 反馈数(30%) + 平均评分(30%)
        
        // 1. 报名热度 (0-40分)
        Integer totalReg = countTotalRegistrations(activityId);
        double regScore = Math.min(totalReg / 2.0, 40.0); // 每2个报名1分，最高40分

        // 2. 反馈热度 (0-30分)
        Long feedbackCount = feedbackMapper.countByActivityId(activityId);
        double feedbackScore = Math.min(feedbackCount.doubleValue(), 30.0); // 每个反馈1分，最高30分

        // 3. 评分热度 (0-30分)
        BigDecimal avgRating = feedbackMapper.getAverageRating(activityId);
        double ratingScore = 0.0;
        if (avgRating != null) {
            ratingScore = avgRating.doubleValue() * 6; // 5星制转30分制
        }

        // 总热度值
        double heatScore = regScore + feedbackScore + ratingScore;
        
        // 四舍五入到1位小数
        return BigDecimal.valueOf(heatScore)
                .setScale(1, RoundingMode.HALF_UP)
                .doubleValue();
    }

    @Override
    public Double calculateReputationScore(Long activityId) {
        // 信誉值综合计算：平均评分(60%) + 完成率(20%) + 异常处理率(20%)
        
        // 1. 平均评分贡献 (0-3分)
        BigDecimal avgRating = feedbackMapper.getAverageRating(activityId);
        double ratingContribution = 0.0;
        if (avgRating != null) {
            ratingContribution = avgRating.doubleValue() * 0.6; // 5星制的60%
        }

        // 2. 完成率贡献 (0-1分)
        Double completionRate = calculateCompletionRate(activityId);
        double completionContribution = (completionRate / 100.0); // 完成率转为0-1分

        // 3. 异常处理率贡献 (0-1分)
        Integer abnormalCount = countAbnormalEvents(activityId);
        Integer resolvedCount = countResolvedEvents(activityId);
        double handlingContribution = 0.0;
        if (abnormalCount > 0) {
            double handlingRate = resolvedCount.doubleValue() / abnormalCount;
            handlingContribution = handlingRate; // 处理率转为0-1分
        } else {
            handlingContribution = 1.0; // 没有异常事件，满分
        }

        // 总信誉值
        double reputationScore = ratingContribution + completionContribution + handlingContribution;
        
        // 四舍五入到2位小数，最高5分
        return BigDecimal.valueOf(Math.min(reputationScore, 5.0))
                .setScale(2, RoundingMode.HALF_UP)
                .doubleValue();
    }

    @Override
    public Integer countAbnormalEvents(Long activityId) {
        LambdaQueryWrapper<TrajectoryEvent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TrajectoryEvent::getActivityId, activityId);
        return trajectoryEventMapper.selectCount(wrapper).intValue();
    }

    /**
     * 统计总报名数
     */
    private Integer countTotalRegistrations(Long activityId) {
        LambdaQueryWrapper<Registration> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Registration::getActivityId, activityId);
        return registrationMapper.selectCount(wrapper).intValue();
    }

    /**
     * 统计审核通过的报名数
     */
    private Integer countApprovedRegistrations(Long activityId) {
        LambdaQueryWrapper<Registration> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Registration::getActivityId, activityId)
               .eq(Registration::getStatus, Constants.RegistrationStatus.APPROVED);
        return registrationMapper.selectCount(wrapper).intValue();
    }

    /**
     * 统计已处理的异常事件数
     */
    private Integer countResolvedEvents(Long activityId) {
        LambdaQueryWrapper<TrajectoryEvent> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(TrajectoryEvent::getActivityId, activityId)
               .eq(TrajectoryEvent::getStatus, "resolved");
        return trajectoryEventMapper.selectCount(wrapper).intValue();
    }
}

