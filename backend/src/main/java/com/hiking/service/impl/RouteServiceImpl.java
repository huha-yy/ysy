package com.hiking.service.impl;

import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hiking.common.Constants;
import com.hiking.common.ResultCode;
import com.hiking.common.SecurityUtils;
import com.hiking.dto.route.RouteCreateRequest;
import com.hiking.dto.route.RoutePointInfo;
import com.hiking.dto.route.RouteUpdateRequest;
import com.hiking.entity.Activity;
import com.hiking.entity.Route;
import com.hiking.exception.BusinessException;
import com.hiking.mapper.ActivityMapper;
import com.hiking.mapper.RouteMapper;
import com.hiking.service.RouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

/**
 * 路线服务实现类
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Service
@RequiredArgsConstructor
public class RouteServiceImpl implements RouteService {

    private final RouteMapper routeMapper;
    private final ActivityMapper activityMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Route createRoute(RouteCreateRequest request) {
        // 1. 验证活动是否存在
        Activity activity = activityMapper.selectById(request.getActivityId());
        if (activity == null) {
            throw new BusinessException(ResultCode.ACTIVITY_NOT_FOUND);
        }

        // 2. 权限校验：只有组织者或管理员可以创建路线
        Long currentUserId = SecurityUtils.getCurrentUserId();
        String currentRole = SecurityUtils.getCurrentUserRole();
        
        if (!activity.getOrganizerId().equals(currentUserId) 
            && !Constants.Role.ADMIN.equals(currentRole)) {
            throw new BusinessException(ResultCode.FORBIDDEN);
        }

        // 3. 验证点位信息
        validateRoutePoints(request.getPointsInfo());

        // 4. 创建路线
        Route route = new Route();
        BeanUtils.copyProperties(request, route);
        route.setPointsInfo(request.getPointsInfo());

        routeMapper.insert(route);
        return route;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Route updateRoute(Long id, RouteUpdateRequest request) {
        // 1. 检查路线是否存在
        Route route = getRouteById(id);

        // 2. 权限校验
        checkRoutePermission(id);

        // 3. 验证点位信息
        if (request.getPointsInfo() != null) {
            validateRoutePoints(request.getPointsInfo());
        }

        // 4. 更新路线
        if (request.getName() != null) {
            route.setName(request.getName());
        }
        if (request.getDistance() != null) {
            route.setDistance(request.getDistance());
        }
        if (request.getElevationGain() != null) {
            route.setElevationGain(request.getElevationGain());
        }
        if (request.getDifficultyLevel() != null) {
            route.setDifficultyLevel(request.getDifficultyLevel());
        }
        if (request.getDescription() != null) {
            route.setDescription(request.getDescription());
        }
        if (request.getGeojsonPath() != null) {
            route.setGeojsonPath(request.getGeojsonPath());
        }
        if (request.getMapImgUrl() != null) {
            route.setMapImgUrl(request.getMapImgUrl());
        }
        if (request.getPointsInfo() != null) {
            route.setPointsInfo(request.getPointsInfo());
        }

        routeMapper.updateById(route);
        return route;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteRoute(Long id) {
        // 1. 检查路线是否存在
        Route route = getRouteById(id);

        // 2. 权限校验
        checkRoutePermission(id);

        // 3. 删除路线（实际场景可能需要检查是否有关联的签到记录）
        routeMapper.deleteById(id);
    }

    @Override
    public Route getRouteById(Long id) {
        Route route = routeMapper.selectById(id);
        if (route == null) {
            throw new BusinessException(ResultCode.NOT_FOUND, "路线不存在");
        }
        return route;
    }

    @Override
    public List<Route> getRoutesByActivityId(Long activityId) {
        LambdaQueryWrapper<Route> wrapper = new LambdaQueryWrapper<>();
        wrapper.eq(Route::getActivityId, activityId)
               .orderByAsc(Route::getId);
        return routeMapper.selectList(wrapper);
    }

    @Override
    public Page<Route> pageRoutes(int page, int size, Long activityId) {
        Page<Route> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Route> wrapper = new LambdaQueryWrapper<>();
        
        if (activityId != null) {
            wrapper.eq(Route::getActivityId, activityId);
        }
        
        wrapper.orderByDesc(Route::getCreatedAt);
        return routeMapper.selectPage(pageParam, wrapper);
    }

    @Override
    public List<RoutePointInfo> getRoutePoints(Long routeId) {
        Route route = getRouteById(routeId);
        Object pointsInfo = route.getPointsInfo();
        
        if (pointsInfo == null) {
            return Collections.emptyList();
        }

        // 将 JSON 数据转换为 RoutePointInfo 列表
        String jsonStr = JSONUtil.toJsonStr(pointsInfo);
        return JSONUtil.toList(jsonStr, RoutePointInfo.class);
    }

    @Override
    public RoutePointInfo getRoutePoint(Long routeId, Integer pointIndex) {
        List<RoutePointInfo> points = getRoutePoints(routeId);
        
        return points.stream()
                .filter(p -> p.getPointIndex().equals(pointIndex))
                .findFirst()
                .orElseThrow(() -> new BusinessException(ResultCode.NOT_FOUND, "点位不存在"));
    }

    @Override
    public void checkRoutePermission(Long routeId) {
        Route route = getRouteById(routeId);
        Activity activity = activityMapper.selectById(route.getActivityId());
        
        if (activity == null) {
            throw new BusinessException(ResultCode.ACTIVITY_NOT_FOUND);
        }

        Long currentUserId = SecurityUtils.getCurrentUserId();
        String currentRole = SecurityUtils.getCurrentUserRole();

        // 只有活动组织者或管理员可以管理路线
        if (!activity.getOrganizerId().equals(currentUserId) 
            && !Constants.Role.ADMIN.equals(currentRole)) {
            throw new BusinessException(ResultCode.FORBIDDEN);
        }
    }

    /**
     * 验证路线点位信息
     *
     * @param points 点位列表
     */
    private void validateRoutePoints(List<RoutePointInfo> points) {
        if (points == null || points.size() < 2) {
            throw new BusinessException(ResultCode.PARAM_ERROR, "至少需要起点和终点两个点位");
        }

        // 检查点位索引是否连续且从0开始
        for (int i = 0; i < points.size(); i++) {
            RoutePointInfo point = points.get(i);
            
            if (point.getPointIndex() == null || !point.getPointIndex().equals(i)) {
                throw new BusinessException(ResultCode.PARAM_ERROR, 
                    "点位索引必须从0开始连续编号");
            }
            
            if (point.getLatitude() == null || point.getLongitude() == null) {
                throw new BusinessException(ResultCode.PARAM_ERROR, 
                    "点位经纬度不能为空");
            }
            
            if (point.getPointName() == null || point.getPointName().trim().isEmpty()) {
                throw new BusinessException(ResultCode.PARAM_ERROR, 
                    "点位名称不能为空");
            }
        }

        // 验证起点和终点
        RoutePointInfo firstPoint = points.get(0);
        RoutePointInfo lastPoint = points.get(points.size() - 1);
        
        if (!"start".equals(firstPoint.getPointType())) {
            throw new BusinessException(ResultCode.PARAM_ERROR, "第一个点位必须是起点(start)");
        }
        
        if (!"end".equals(lastPoint.getPointType())) {
            throw new BusinessException(ResultCode.PARAM_ERROR, "最后一个点位必须是终点(end)");
        }
    }
}

