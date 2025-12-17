package com.hiking.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hiking.common.PageResult;
import com.hiking.common.ResultCode;
import com.hiking.common.SecurityUtils;
import com.hiking.dto.checkin.CheckinRecordQueryRequest;
import com.hiking.dto.checkin.CheckinRecordRequest;
import com.hiking.entity.CheckinRecord;
import com.hiking.exception.BusinessException;
import com.hiking.mapper.CheckinRecordMapper;
import com.hiking.service.CheckinRecordService;
import com.hiking.service.SystemEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDateTime;
import java.util.List;

/**
 * 签到记录服务实现
 */
@Service
@RequiredArgsConstructor
public class CheckinRecordServiceImpl extends ServiceImpl<CheckinRecordMapper, CheckinRecord> implements CheckinRecordService {

    private final CheckinRecordMapper checkinRecordMapper;
    private final SystemEventService systemEventService;

    @Override
    public CheckinRecord submit(CheckinRecordRequest request) {
        if (!StringUtils.hasText(request.getStatus())) {
            request.setStatus("on_time");
        }
        CheckinRecord record = new CheckinRecord();
        record.setActivityId(request.getActivityId());
        record.setRouteId(request.getRouteId());
        record.setPointIndex(request.getPointIndex());
        record.setCheckpointName(request.getCheckpointName());
        record.setLatitude(request.getLatitude());
        record.setLongitude(request.getLongitude());
        record.setStatus(request.getStatus());
        record.setGpsAccuracy(request.getGpsAccuracy());
        record.setNotes(request.getNotes());
        record.setUserId(SecurityUtils.getUserId());
        record.setTimestamp(LocalDateTime.now());
        if (record.getUserId() == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        checkinRecordMapper.insert(record);
        if (!"on_time".equalsIgnoreCase(record.getStatus())) {
            String title = "签到异常提示";
            String content = String.format("签到点 %s 状态为 %s，请及时关注。", record.getCheckpointName(), record.getStatus());
            systemEventService.publishNotification(record.getActivityId(), record.getUserId(), title, content);
        }
        return record;
    }

    @Override
    public PageResult<CheckinRecord> pageCheckins(int page, int size, CheckinRecordQueryRequest query) {
        Page<CheckinRecord> pager = new Page<>(page, size);
        LambdaQueryWrapper<CheckinRecord> wrapper = new LambdaQueryWrapper<>();
        if (query != null) {
            if (query.getActivityId() != null) {
                wrapper.eq(CheckinRecord::getActivityId, query.getActivityId());
            }
            if (query.getUserId() != null) {
                wrapper.eq(CheckinRecord::getUserId, query.getUserId());
            }
            if (query.getRouteId() != null) {
                wrapper.eq(CheckinRecord::getRouteId, query.getRouteId());
            }
            if (StringUtils.hasText(query.getStatus())) {
                wrapper.eq(CheckinRecord::getStatus, query.getStatus());
            }
            if (query.getStartTime() != null) {
                wrapper.ge(CheckinRecord::getTimestamp, query.getStartTime());
            }
            if (query.getEndTime() != null) {
                wrapper.le(CheckinRecord::getTimestamp, query.getEndTime());
            }
        }
        wrapper.orderByDesc(CheckinRecord::getTimestamp);
        return PageResult.from(checkinRecordMapper.selectPage(pager, wrapper));
    }

    @Override
    public List<CheckinRecord> listByActivity(Long activityId) {
        return checkinRecordMapper.selectList(new LambdaQueryWrapper<CheckinRecord>()
                .eq(CheckinRecord::getActivityId, activityId)
                .orderByDesc(CheckinRecord::getTimestamp));
    }
}

