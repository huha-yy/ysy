package com.hiking.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hiking.entity.Activity;
import org.apache.ibatis.annotations.Mapper;

/**
 * 活动 Mapper
 */
@Mapper
public interface ActivityMapper extends BaseMapper<Activity> {
}

