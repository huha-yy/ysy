package com.hiking.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.hiking.common.PageResult;
import com.hiking.entity.User;
import com.hiking.mapper.ActivityMapper;
import com.hiking.mapper.CheckinRecordMapper;
import com.hiking.mapper.RegistrationMapper;
import com.hiking.mapper.UserMapper;
import com.hiking.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * 管理员服务实现
 */
@Service
@RequiredArgsConstructor
public class AdminServiceImpl extends ServiceImpl<UserMapper, User> implements AdminService {

    private final UserMapper userMapper;
    private final ActivityMapper activityMapper;
    private final RegistrationMapper registrationMapper;
    private final CheckinRecordMapper checkinRecordMapper;

    @Override
    public PageResult<User> getAllUsers(int page, int size, String keyword) {
        LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
        if (keyword != null && !keyword.trim().isEmpty()) {
            queryWrapper.and(wrapper -> 
                wrapper.like(User::getUsername, keyword)
                    .or()
                    .like(User::getRealName, keyword)
                    .or()
                    .like(User::getEmail, keyword)
            );
        }
        
        Page<User> userPage = new Page<>(page, size);
        Page<User> result = userMapper.selectPage(userPage, queryWrapper);
        
        return PageResult.from(result);
    }

    @Override
    public void changeUserRole(Long userId, String role) {
        User user = userMapper.selectById(userId);
        if (user != null) {
            user.setRole(role);
            userMapper.updateById(user);
        }
    }

    @Override
    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // 总用户数
        Long totalUsers = count(null);
        stats.put("totalUsers", totalUsers);
        
        // 总活动数
        Long totalActivities = activityMapper.selectCount(null);
        stats.put("totalActivities", totalActivities);
        
        // 已批准活动数
        LambdaQueryWrapper<com.hiking.entity.Activity> approvedQuery = new LambdaQueryWrapper<>();
        approvedQuery.eq(com.hiking.entity.Activity::getStatus, "approved");
        Long approvedActivities = activityMapper.selectCount(approvedQuery);
        stats.put("approvedActivities", approvedActivities);
        
        // 待审核活动数
        LambdaQueryWrapper<com.hiking.entity.Activity> pendingQuery = new LambdaQueryWrapper<>();
        pendingQuery.eq(com.hiking.entity.Activity::getStatus, "pending");
        Long pendingActivities = activityMapper.selectCount(pendingQuery);
        stats.put("pendingActivities", pendingActivities);
        
        // 总签到数
        Long totalCheckins = checkinRecordMapper.selectCount(null);
        stats.put("totalCheckins", totalCheckins);
        
        // 完成签到数
        LambdaQueryWrapper<com.hiking.entity.CheckinRecord> completedQuery = new LambdaQueryWrapper<>();
        completedQuery.in(com.hiking.entity.CheckinRecord::getStatus, "on_time", "late");
        Long completedCheckins = checkinRecordMapper.selectCount(completedQuery);
        stats.put("completedCheckins", completedCheckins);
        
        return stats;
    }

    @Override
    public List<Map<String, Object>> getActivitiesData(int days) {
        List<Map<String, Object>> data = new ArrayList<>();
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dateStr = date.format(formatter);
            
            // 查询该日期创建的活动数
            LambdaQueryWrapper<com.hiking.entity.Activity> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.ge(com.hiking.entity.Activity::getCreatedAt, date.atStartOfDay())
                     .lt(com.hiking.entity.Activity::getCreatedAt, date.plusDays(1).atStartOfDay());
            long count = activityMapper.selectCount(queryWrapper);
            
            Map<String, Object> item = new HashMap<>();
            item.put("date", dateStr);
            item.put("count", count);
            data.add(item);
        }
        
        return data;
    }

    @Override
    public List<Map<String, Object>> getUsersData(int days) {
        List<Map<String, Object>> data = new ArrayList<>();
        LocalDate today = LocalDate.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        
        for (int i = days - 1; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            String dateStr = date.format(formatter);
            
            // 查询该日期注册的用户数
            LambdaQueryWrapper<User> queryWrapper = new LambdaQueryWrapper<>();
            queryWrapper.ge(User::getCreatedAt, date.atStartOfDay())
                     .lt(User::getCreatedAt, date.plusDays(1).atStartOfDay());
            long count = count(queryWrapper);
            
            Map<String, Object> item = new HashMap<>();
            item.put("date", dateStr);
            item.put("count", count);
            data.add(item);
        }
        
        return data;
    }

    @Override
    public List<Map<String, Object>> getRegionData() {
        // 模拟地区数据，实际应该从活动表中提取地区信息
        List<Map<String, Object>> data = new ArrayList<>();
        
        Map<String, Object> beijing = new HashMap<>();
        beijing.put("region", "北京");
        beijing.put("count", 20);
        data.add(beijing);
        
        Map<String, Object> shanghai = new HashMap<>();
        shanghai.put("region", "上海");
        shanghai.put("count", 15);
        data.add(shanghai);
        
        Map<String, Object> guangzhou = new HashMap<>();
        guangzhou.put("region", "广州");
        guangzhou.put("count", 12);
        data.add(guangzhou);
        
        Map<String, Object> shenzhen = new HashMap<>();
        shenzhen.put("region", "深圳");
        shenzhen.put("count", 10);
        data.add(shenzhen);
        
        return data;
    }
}