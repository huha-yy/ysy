package com.hiking.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.hiking.entity.Registration;
import org.apache.ibatis.annotations.Mapper;

/**
 * 报名 Mapper
 */
@Mapper
public interface RegistrationMapper extends BaseMapper<Registration> {
}

