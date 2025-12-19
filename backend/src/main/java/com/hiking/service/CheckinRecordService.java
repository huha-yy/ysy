package com.hiking.service;

import com.hiking.common.PageResult;
import com.hiking.dto.checkin.CheckinRecordQueryRequest;
import com.hiking.dto.checkin.CheckinRecordRequest;
import com.hiking.entity.CheckinRecord;

import java.util.List;

/**
 * 签到记录服务
 */
public interface CheckinRecordService {

    CheckinRecord submit(CheckinRecordRequest request);

    PageResult<CheckinRecord> pageCheckins(int page, int size, CheckinRecordQueryRequest query);

    List<CheckinRecord> listByActivity(Long activityId);
    
    // 添加获取用户签到记录的方法
    PageResult<CheckinRecord> getUserCheckins(int page, int size);
}