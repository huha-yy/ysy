package com.hiking.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hiking.dto.route.RouteCreateRequest;
import com.hiking.dto.route.RoutePointInfo;
import com.hiking.dto.route.RouteUpdateRequest;
import com.hiking.entity.Route;

import java.util.List;

/**
 * 路线服务接口
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
public interface RouteService {

    /**
     * 创建路线
     *
     * @param request 创建请求
     * @return 路线信息
     */
    Route createRoute(RouteCreateRequest request);

    /**
     * 更新路线
     *
     * @param id 路线ID
     * @param request 更新请求
     * @return 路线信息
     */
    Route updateRoute(Long id, RouteUpdateRequest request);

    /**
     * 删除路线
     *
     * @param id 路线ID
     */
    void deleteRoute(Long id);

    /**
     * 根据ID查询路线
     *
     * @param id 路线ID
     * @return 路线信息
     */
    Route getRouteById(Long id);

    /**
     * 根据活动ID查询路线列表
     *
     * @param activityId 活动ID
     * @return 路线列表
     */
    List<Route> getRoutesByActivityId(Long activityId);

    /**
     * 分页查询路线
     *
     * @param page 页码
     * @param size 每页数量
     * @param activityId 活动ID（可选）
     * @return 分页结果
     */
    Page<Route> pageRoutes(int page, int size, Long activityId);

    /**
     * 获取路线的点位信息
     *
     * @param routeId 路线ID
     * @return 点位信息列表
     */
    List<RoutePointInfo> getRoutePoints(Long routeId);

    /**
     * 根据点位索引获取点位信息
     *
     * @param routeId 路线ID
     * @param pointIndex 点位索引
     * @return 点位信息
     */
    RoutePointInfo getRoutePoint(Long routeId, Integer pointIndex);

    /**
     * 检查用户是否有权限管理该路线
     * （只有活动的组织者或管理员可以管理路线）
     *
     * @param routeId 路线ID
     */
    void checkRoutePermission(Long routeId);
}

