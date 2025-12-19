package com.hiking.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hiking.entity.ActivityStats;
import org.apache.ibatis.annotations.Mapper;

/**
 * 活动统计 Mapper 接口
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Mapper
public interface ActivityStatsMapper extends BaseMapper<ActivityStats> {
}

