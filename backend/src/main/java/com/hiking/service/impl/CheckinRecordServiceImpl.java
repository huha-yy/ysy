package com.hiking.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hiking.common.GeoUtils;
import com.hiking.common.PageResult;
import com.hiking.common.ResultCode;
import com.hiking.common.SecurityUtils;
import com.hiking.dto.checkin.CheckinRecordQueryRequest;
import com.hiking.dto.checkin.CheckinRecordRequest;
import com.hiking.dto.route.RoutePointInfo;
import com.hiking.dto.trajectory.TrajectoryEventCreateRequest;
import com.hiking.entity.Activity;
import com.hiking.entity.CheckinRecord;
import com.hiking.exception.BusinessException;
import com.hiking.mapper.ActivityMapper;
import com.hiking.mapper.CheckinRecordMapper;
import com.hiking.service.CheckinRecordService;
import com.hiking.service.RouteService;
import com.hiking.service.SystemEventService;
import com.hiking.service.TrajectoryEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.Duration;
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
    private final RouteService routeService;
    private final TrajectoryEventService trajectoryEventService;
    private final ActivityMapper activityMapper;

    @Override
    public CheckinRecord submit(CheckinRecordRequest request) {
        // 1. 获取当前用户
        Long userId = SecurityUtils.getUserId();
        if (userId == null) {
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }

        // 2. 获取活动信息（用于时间计算）
        Activity activity = activityMapper.selectById(request.getActivityId());
        if (activity == null) {
            throw new BusinessException(ResultCode.ACTIVITY_NOT_FOUND);
        }

        // 3. 获取路线点位信息
        RoutePointInfo targetPoint = routeService.getRoutePoint(
            request.getRouteId(), 
            request.getPointIndex()
        );

        // 4. 计算地理位置偏离
        double distance = GeoUtils.calculateDistance(
            request.getLatitude(), 
            request.getLongitude(),
            targetPoint.getLatitude(), 
            targetPoint.getLongitude()
        );

        // 5. 计算时间延迟
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expectedTime = activity.getStartTime()
            .plusMinutes(targetPoint.getExpectedMinutes() != null ? targetPoint.getExpectedMinutes() : 0);
        long delayMinutes = Duration.between(expectedTime, now).toMinutes();

        // 6. 确定签到状态
        String status = "on_time";
        boolean hasWarning = false;
        StringBuilder warningMessage = new StringBuilder();

        // 检查位置偏离
        int allowedDeviation = targetPoint.getAllowedDeviationMeters() != null 
            ? targetPoint.getAllowedDeviationMeters() 
            : 500; // 默认允许偏离500米
        
        if (distance > allowedDeviation) {
            status = "deviated";
            hasWarning = true;
            warningMessage.append(String.format(
                "位置偏离：当前位置距离目标点位 %s，超出允许范围 %s。", 
                GeoUtils.formatDistance(distance),
                GeoUtils.formatDistance(allowedDeviation)
            ));
        }

        // 检查时间延迟
        int allowedDelay = targetPoint.getAllowedDelayMinutes() != null 
            ? targetPoint.getAllowedDelayMinutes() 
            : 30; // 默认允许延迟30分钟
        
        if (delayMinutes > allowedDelay) {
            if (status.equals("on_time")) {
                status = "delayed";
            }
            hasWarning = true;
            if (warningMessage.length() > 0) {
                warningMessage.append(" ");
            }
            warningMessage.append(String.format(
                "时间延迟：延迟 %d 分钟，超出允许范围 %d 分钟。", 
                delayMinutes, 
                allowedDelay
            ));
        } else if (delayMinutes < -10) { // 提前超过10分钟也算异常
            if (status.equals("on_time")) {
                status = "early";
            }
            hasWarning = true;
            if (warningMessage.length() > 0) {
                warningMessage.append(" ");
            }
            warningMessage.append(String.format(
                "时间提前：提前 %d 分钟到达，请注意安全。", 
                Math.abs(delayMinutes)
            ));
        }

        // 7. 创建签到记录
        CheckinRecord record = new CheckinRecord();
        record.setActivityId(request.getActivityId());
        record.setRouteId(request.getRouteId());
        record.setPointIndex(request.getPointIndex());
        record.setCheckpointName(targetPoint.getPointName());
        record.setLatitude(request.getLatitude());
        record.setLongitude(request.getLongitude());
        record.setStatus(status);
        record.setGpsAccuracy(request.getGpsAccuracy());
        record.setNotes(request.getNotes());
        record.setUserId(userId);
        record.setTimestamp(now);

        checkinRecordMapper.insert(record);

        // 8. 如果有异常，创建轨迹事件并发送通知
        if (hasWarning) {
            // 创建轨迹事件
            TrajectoryEventCreateRequest eventRequest = new TrajectoryEventCreateRequest();
            eventRequest.setActivityId(request.getActivityId());
            eventRequest.setUserId(userId);
            eventRequest.setRouteId(request.getRouteId());
            eventRequest.setPointIndex(request.getPointIndex());
            
            // 根据情况确定事件类型
            if (status.equals("deviated")) {
                eventRequest.setEventType("location_deviation");
            } else if (status.equals("delayed")) {
                eventRequest.setEventType("time_delay");
            } else {
                eventRequest.setEventType("other");
            }
            
            eventRequest.setLatitude(request.getLatitude());
            eventRequest.setLongitude(request.getLongitude());
            eventRequest.setDescription(warningMessage.toString());
            eventRequest.setSeverity("warning");

            trajectoryEventService.createEvent(eventRequest);

            // 发送通知给组织者
            String title = String.format("签到异常预警 - %s", targetPoint.getPointName());
            String content = String.format(
                "参与者在点位 [%s] 签到时出现异常：%s", 
                targetPoint.getPointName(),
                warningMessage.toString()
            );
            systemEventService.publishNotification(
                request.getActivityId(), 
                activity.getOrganizerId(), 
                title, 
                content
            );
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
    
    @Override
    public PageResult<CheckinRecord> getUserCheckins(int page, int size) {
        Page<CheckinRecord> pager = new Page<>(page, size);
        LambdaQueryWrapper<CheckinRecord> wrapper = new LambdaQueryWrapper<>();
        
        // 获取当前用户的签到记录
        Long userId = SecurityUtils.getUserId();
        wrapper.eq(CheckinRecord::getUserId, userId);
        
        wrapper.orderByDesc(CheckinRecord::getTimestamp);
        return PageResult.from(checkinRecordMapper.selectPage(pager, wrapper));
    }
}