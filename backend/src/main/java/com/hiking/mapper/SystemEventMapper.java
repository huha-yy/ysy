package com.hiking.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hiking.entity.SystemEvent;
import org.apache.ibatis.annotations.Mapper;

/**
 * 系统事件 Mapper
 */
@Mapper
public interface SystemEventMapper extends BaseMapper<SystemEvent> {
}

