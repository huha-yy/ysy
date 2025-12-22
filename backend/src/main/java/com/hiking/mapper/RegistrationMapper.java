package com.hiking.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hiking.dto.registration.RegistrationQueryRequest;
import com.hiking.entity.Registration;
import com.hiking.vo.RegistrationVO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 报名 Mapper
 */
@Mapper
public interface RegistrationMapper extends BaseMapper<Registration> {

    /**
     * 分页查询报名信息（包含用户和活动信息）
     */
    Page<RegistrationVO> pageRegistrationsWithDetails(Page<RegistrationVO> pager, @Param("query") RegistrationQueryRequest query);
}

