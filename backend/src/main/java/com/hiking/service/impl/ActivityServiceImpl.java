package com.hiking.service.impl;

import cn.hutool.core.util.ObjectUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hiking.common.Constants;
import com.hiking.common.PageResult;
import com.hiking.common.SecurityUtils;
import com.hiking.dto.activity.ActivityCreateRequest;
import com.hiking.dto.activity.ActivityRegisterRequest;
import com.hiking.dto.activity.ActivityUpdateRequest;
import com.hiking.entity.Activity;
import com.hiking.entity.Registration;
import com.hiking.entity.User;
import com.hiking.exception.BusinessException;
import com.hiking.mapper.ActivityMapper;
import com.hiking.mapper.RegistrationMapper;
import com.hiking.mapper.UserMapper;
import com.hiking.service.ActivityService;
import com.hiking.service.SystemEventService;
import com.hiking.vo.ActivityVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import static com.hiking.common.ResultCode.ACTIVITY_NOT_FOUND;
import static com.hiking.common.ResultCode.FORBIDDEN;

/**
 * 活动服务实现
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ActivityServiceImpl extends ServiceImpl<ActivityMapper, Activity> implements ActivityService {

    private final ActivityMapper activityMapper;
    private final SystemEventService systemEventService;
    private final ObjectMapper objectMapper;
    private final UserMapper userMapper;
    private final RegistrationMapper registrationMapper;

    @Override
    public PageResult<Activity> pageActivities(int page, int size, String status, String keyword) {
        Page<Activity> pager = new Page<>(page, size);
        LambdaQueryWrapper<Activity> wrapper = new LambdaQueryWrapper<>();
        if (StringUtils.hasText(status)) {
            wrapper.eq(Activity::getStatus, status);
        }
        if (StringUtils.hasText(keyword)) {
            wrapper.and(w -> w.like(Activity::getTitle, keyword).or().like(Activity::getSummary, keyword));
        }
        wrapper.orderByDesc(Activity::getStartTime);
        return PageResult.from(activityMapper.selectPage(pager, wrapper));
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Activity createActivity(ActivityCreateRequest request) {
        Activity activity = new Activity();
        activity.setTitle(request.getTitle());
        activity.setSummary(request.getSummary());
        activity.setDifficulty(request.getDifficulty());
        activity.setLocation(request.getLocation());
        activity.setMeetingPoint(request.getMeetingPoint());
        activity.setStartTime(request.getStartTime());
        activity.setEndTime(request.getEndTime());
        activity.setCapacity(request.getCapacity());
        activity.setFeeInfo(request.getFeeInfo());
        
        // 处理 requirementInfo: 如果是JSON字符串，需要先解析为Object
        if (StringUtils.hasText(request.getRequirementInfo())) {
            try {
                Object requirementObj = objectMapper.readValue(request.getRequirementInfo(), Object.class);
                activity.setRequirementInfo(requirementObj);
            } catch (Exception e) {
                log.error("解析requirementInfo失败: {}", request.getRequirementInfo(), e);
                throw new BusinessException(4000, "活动要求信息格式错误");
            }
        }
        
        // 处理 attachments: 如果是JSON字符串，需要先解析为Object
        if (StringUtils.hasText(request.getAttachments())) {
            try {
                Object attachmentsObj = objectMapper.readValue(request.getAttachments(), Object.class);
                activity.setAttachments(attachmentsObj);
            } catch (Exception e) {
                log.error("解析attachments失败: {}", request.getAttachments(), e);
                throw new BusinessException(4000, "附件信息格式错误");
            }
        }
        
        activity.setOrganizerId(SecurityUtils.getUserId());
        activity.setStatus(Constants.ActivityStatus.PENDING);
        activityMapper.insert(activity);
        return activity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Activity updateActivity(Long id, ActivityUpdateRequest request) {
        Activity activity = requireOrganizerOrAdmin(id);
        if (StringUtils.hasText(request.getTitle())) {
            activity.setTitle(request.getTitle());
        }
        if (StringUtils.hasText(request.getSummary())) {
            activity.setSummary(request.getSummary());
        }
        if (StringUtils.hasText(request.getDifficulty())) {
            activity.setDifficulty(request.getDifficulty());
        }
        if (StringUtils.hasText(request.getLocation())) {
            activity.setLocation(request.getLocation());
        }
        if (StringUtils.hasText(request.getMeetingPoint())) {
            activity.setMeetingPoint(request.getMeetingPoint());
        }
        if (request.getStartTime() != null) {
            activity.setStartTime(request.getStartTime());
        }
        if (request.getEndTime() != null) {
            activity.setEndTime(request.getEndTime());
        }
        if (ObjectUtil.isNotNull(request.getCapacity())) {
            activity.setCapacity(request.getCapacity());
        }
        if (StringUtils.hasText(request.getFeeInfo())) {
            activity.setFeeInfo(request.getFeeInfo());
        }
        
        // 处理 requirementInfo: 如果是JSON字符串，需要先解析为Object
        if (StringUtils.hasText(request.getRequirementInfo())) {
            try {
                Object requirementObj = objectMapper.readValue(request.getRequirementInfo(), Object.class);
                activity.setRequirementInfo(requirementObj);
            } catch (Exception e) {
                log.error("解析requirementInfo失败: {}", request.getRequirementInfo(), e);
                throw new BusinessException(4000, "活动要求信息格式错误");
            }
        }
        
        // 处理 attachments: 如果是JSON字符串，需要先解析为Object
        if (StringUtils.hasText(request.getAttachments())) {
            try {
                Object attachmentsObj = objectMapper.readValue(request.getAttachments(), Object.class);
                activity.setAttachments(attachmentsObj);
            } catch (Exception e) {
                log.error("解析attachments失败: {}", request.getAttachments(), e);
                throw new BusinessException(4000, "附件信息格式错误");
            }
        }
        activityMapper.updateById(activity);
        return activity;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void changeStatus(Long id, String status) {
        Activity activity = requireOrganizerOrAdmin(id);
        activity.setStatus(status);
        activityMapper.updateById(activity);
        String message = "活动\"" + activity.getTitle() + "\"已更新状态为：" + status;
        systemEventService.publishNotification(activity.getId(), activity.getOrganizerId(), "活动审核状态变更", message);
    }

    @Override
    public Activity requireOrganizerOrAdmin(Long id) {
        Activity activity = activityMapper.selectById(id);
        if (activity == null) {
            throw new BusinessException(ACTIVITY_NOT_FOUND);
        }
        Long currentUserId = SecurityUtils.getUserId();
        if (!SecurityUtils.isAdmin() && !activity.getOrganizerId().equals(currentUserId)) {
            throw new BusinessException(FORBIDDEN);
        }
        return activity;
    }
    
    @Override
    public PageResult<Activity> getUserActivities(int page, int size, String status) {
        Page<Activity> pager = new Page<>(page, size);
        LambdaQueryWrapper<Activity> wrapper = new LambdaQueryWrapper<>();
        
        // 获取当前用户报名的活动
        wrapper.inSql(Activity::getId, 
            "SELECT activity_id FROM registrations WHERE user_id = " + SecurityUtils.getUserId());
            
        if (StringUtils.hasText(status)) {
            wrapper.eq(Activity::getStatus, status);
        }
        
        wrapper.orderByDesc(Activity::getStartTime);
        return PageResult.from(activityMapper.selectPage(pager, wrapper));
    }
    
    @Override
    public ActivityVO getActivityVO(Long id) {
        // 查询活动信息
        Activity activity = activityMapper.selectById(id);
        if (activity == null) {
            throw new BusinessException(ACTIVITY_NOT_FOUND);
        }
        
        // 查询组织者信息
        User organizer = userMapper.selectById(activity.getOrganizerId());
        String organizerName = organizer != null ? 
            (StringUtils.hasText(organizer.getRealName()) ? organizer.getRealName() : organizer.getUsername()) 
            : "未知组织者";
        
        // 查询当前已通过审核的报名人数
        Integer currentParticipants = Math.toIntExact(registrationMapper.selectCount(
            new LambdaQueryWrapper<Registration>()
                .eq(Registration::getActivityId, id)
                .eq(Registration::getStatus, "approved")
        ));
        
        // 转换为 VO
        return ActivityVO.fromEntity(activity, organizerName, currentParticipants);
    }
    
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Registration registerActivity(Long activityId, ActivityRegisterRequest request) {
        // 检查活动是否存在
        Activity activity = activityMapper.selectById(activityId);
        if (activity == null) {
            throw new BusinessException(ACTIVITY_NOT_FOUND);
        }
        
        // 检查活动状态
        if (!"approved".equals(activity.getStatus())) {
            throw new BusinessException(4000, "活动未通过审核，无法报名");
        }
        
        // 检查活动是否已结束
        if (activity.getEndTime().isBefore(java.time.LocalDateTime.now())) {
            throw new BusinessException(4000, "活动已结束，无法报名");
        }
        
        // 检查是否已报名
        Long currentUserId = SecurityUtils.getUserId();
        LambdaQueryWrapper<Registration> queryWrapper = new LambdaQueryWrapper<>();
        queryWrapper.eq(Registration::getActivityId, activityId)
                   .eq(Registration::getUserId, currentUserId)
                   .ne(Registration::getStatus, "cancelled");
        
        Registration existingRegistration = registrationMapper.selectOne(queryWrapper);
        if (existingRegistration != null) {
            throw new BusinessException(4000, "您已报名此活动，请勿重复报名");
        }
        
        // 检查报名人数是否已满
        Integer currentParticipants = Math.toIntExact(registrationMapper.selectCount(
            new LambdaQueryWrapper<Registration>()
                .eq(Registration::getActivityId, activityId)
                .eq(Registration::getStatus, "approved")
        ));
        
        if (currentParticipants >= activity.getCapacity()) {
            throw new BusinessException(4000, "活动报名人数已满");
        }
        
        // 创建报名记录
        Registration registration = new Registration();
        registration.setActivityId(activityId);
        registration.setUserId(currentUserId);
        registration.setStatus("pending"); // 默认为待审核状态
        registration.setSubmittedAt(java.time.LocalDateTime.now());
        registration.setQualificationInfo(request.getQualificationInfo());
        registration.setNotes(request.getNotes());
        
        registrationMapper.insert(registration);
        
        // 发送系统通知给组织者
        systemEventService.publishNotification(
            activityId, 
            activity.getOrganizerId(), 
            "新报名通知", 
            "活动有新的报名申请，请及时审核"
        );
        
        return registration;
    }
}