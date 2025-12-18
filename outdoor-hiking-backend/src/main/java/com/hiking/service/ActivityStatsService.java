package com.hiking.service;

import com.hiking.entity.ActivityStats;

/**
 * 活动统计服务接口
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
public interface ActivityStatsService {

    /**
     * 获取活动统计信息
     * 如果不存在则自动计算并创建
     *
     * @param activityId 活动ID
     * @return 统计信息
     */
    ActivityStats getStats(Long activityId);

    /**
     * 刷新活动统计数据
     * 重新计算所有统计指标
     *
     * @param activityId 活动ID
     * @return 最新统计信息
     */
    ActivityStats refreshStats(Long activityId);

    /**
     * 计算活动的完成率
     * 完成率 = 完成签到的参与者数 / 审核通过的参与者数 * 100
     *
     * @param activityId 活动ID
     * @return 完成率（百分比）
     */
    Double calculateCompletionRate(Long activityId);

    /**
     * 计算活动的热度值
     * 热度值综合考虑：报名数、反馈数、平均评分等
     *
     * @param activityId 活动ID
     * @return 热度值（0-100）
     */
    Double calculateHeatScore(Long activityId);

    /**
     * 计算组织者的信誉值
     * 信誉值基于：平均评分、异常事件处理率、活动完成率等
     *
     * @param activityId 活动ID
     * @return 信誉值（0-5）
     */
    Double calculateReputationScore(Long activityId);

    /**
     * 统计异常事件数量
     *
     * @param activityId 活动ID
     * @return 异常事件数
     */
    Integer countAbnormalEvents(Long activityId);
}

