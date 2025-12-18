package com.hiking.dto.route;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

/**
 * 路线点位信息
 * 
 * 用于解析和封装 routes.points_info JSON 字段
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
public class RoutePointInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 点位索引（与 checkin_records.point_index 关联）
     */
    private Integer pointIndex;

    /**
     * 点位名称（如：集合点、休息点、终点等）
     */
    private String pointName;

    /**
     * 点位类型：start-起点, checkpoint-检查点, rest-休息点, end-终点, emergency-紧急点
     */
    private String pointType;

    /**
     * 纬度
     */
    private BigDecimal latitude;

    /**
     * 经度
     */
    private BigDecimal longitude;

    /**
     * 预期到达时间（分钟，相对于活动开始时间）
     */
    private Integer expectedMinutes;

    /**
     * 允许偏离距离（米）
     */
    private Integer allowedDeviationMeters;

    /**
     * 允许延迟时间（分钟）
     */
    private Integer allowedDelayMinutes;

    /**
     * 点位描述（如：风险提示、注意事项等）
     */
    private String description;

    /**
     * 是否必须签到
     */
    private Boolean mandatory;
}

