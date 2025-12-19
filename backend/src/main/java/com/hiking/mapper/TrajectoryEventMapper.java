package com.hiking.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hiking.entity.TrajectoryEvent;
import org.apache.ibatis.annotations.Mapper;

/**
 * 轨迹事件 Mapper
 */
@Mapper
public interface TrajectoryEventMapper extends BaseMapper<TrajectoryEvent> {
}

