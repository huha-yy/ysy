package com.hiking.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.hiking.common.PageResult;
import com.hiking.common.Result;
import com.hiking.dto.route.RouteCreateRequest;
import com.hiking.dto.route.RoutePointInfo;
import com.hiking.dto.route.RouteUpdateRequest;
import com.hiking.entity.Route;
import com.hiking.service.RouteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 路线管理控制器
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@RestController
@RequestMapping("/api/routes")
@RequiredArgsConstructor
public class RouteController {

    private final RouteService routeService;

    /**
     * 创建路线（组织者/管理员）
     */
    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public Result<Route> createRoute(@Valid @RequestBody RouteCreateRequest request) {
        Route route = routeService.createRoute(request);
        return Result.success(route);
    }

    /**
     * 更新路线（组织者/管理员）
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public Result<Route> updateRoute(@PathVariable Long id, 
                                     @Valid @RequestBody RouteUpdateRequest request) {
        Route route = routeService.updateRoute(id, request);
        return Result.success(route);
    }

    /**
     * 删除路线（组织者/管理员）
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ORGANIZER', 'ADMIN')")
    public Result<Void> deleteRoute(@PathVariable Long id) {
        routeService.deleteRoute(id);
        return Result.success();
    }

    /**
     * 查询路线详情（公开）
     */
    @GetMapping("/{id}")
    public Result<Route> getRoute(@PathVariable Long id) {
        Route route = routeService.getRouteById(id);
        return Result.success(route);
    }

    /**
     * 根据活动ID查询路线列表（公开）
     */
    @GetMapping("/activity/{activityId}")
    public Result<List<Route>> getRoutesByActivity(@PathVariable Long activityId) {
        List<Route> routes = routeService.getRoutesByActivityId(activityId);
        return Result.success(routes);
    }

    /**
     * 分页查询路线（公开）
     */
    @GetMapping("/page")
    public Result<PageResult<Route>> pageRoutes(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Long activityId) {
        Page<Route> pageResult = routeService.pageRoutes(page, size, activityId);
        return Result.success(PageResult.of(pageResult));
    }

    /**
     * 获取路线的所有点位信息（公开）
     */
    @GetMapping("/{id}/points")
    public Result<List<RoutePointInfo>> getRoutePoints(@PathVariable Long id) {
        List<RoutePointInfo> points = routeService.getRoutePoints(id);
        return Result.success(points);
    }

    /**
     * 获取路线的特定点位信息（公开）
     */
    @GetMapping("/{id}/points/{pointIndex}")
    public Result<RoutePointInfo> getRoutePoint(@PathVariable Long id, 
                                                @PathVariable Integer pointIndex) {
        RoutePointInfo point = routeService.getRoutePoint(id, pointIndex);
        return Result.success(point);
    }
}

