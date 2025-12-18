package com.hiking.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hiking.entity.ActivityFeedback;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import java.math.BigDecimal;

/**
 * 活动反馈 Mapper 接口
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Mapper
public interface ActivityFeedbackMapper extends BaseMapper<ActivityFeedback> {

    /**
     * 计算活动的平均评分
     *
     * @param activityId 活动ID
     * @return 平均评分
     */
    @Select("SELECT AVG(rating) FROM activity_feedback WHERE activity_id = #{activityId}")
    BigDecimal getAverageRating(Long activityId);

    /**
     * 统计活动的反馈数量
     *
     * @param activityId 活动ID
     * @return 反馈数量
     */
    @Select("SELECT COUNT(*) FROM activity_feedback WHERE activity_id = #{activityId}")
    Long countByActivityId(Long activityId);
}

