package com.hiking.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hiking.entity.CheckinRecord;
import org.apache.ibatis.annotations.Mapper;

/**
 * 签到记录 Mapper
 */
@Mapper
public interface CheckinRecordMapper extends BaseMapper<CheckinRecord> {
}

