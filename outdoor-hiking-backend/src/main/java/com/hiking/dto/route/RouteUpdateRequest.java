package com.hiking.dto.route;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.List;

/**
 * 更新路线请求
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
public class RouteUpdateRequest implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 路线名称
     */
    @Size(max = 128, message = "路线名称不能超过128个字符")
    private String name;

    /**
     * 总距离（km）
     */
    @DecimalMin(value = "0.01", message = "总距离必须大于0")
    @DecimalMax(value = "9999.99", message = "总距离不能超过9999.99km")
    private BigDecimal distance;

    /**
     * 累计爬升（m）
     */
    @Min(value = 0, message = "累计爬升不能为负数")
    private Integer elevationGain;

    /**
     * 难度分级
     */
    private String difficultyLevel;

    /**
     * 路线描述
     */
    @Size(max = 512, message = "路线描述不能超过512个字符")
    private String description;

    /**
     * GeoJSON 路径
     */
    @Size(max = 256, message = "GeoJSON路径不能超过256个字符")
    private String geojsonPath;

    /**
     * 路线图URL
     */
    @Size(max = 256, message = "路线图URL不能超过256个字符")
    private String mapImgUrl;

    /**
     * 点位信息列表
     */
    private List<RoutePointInfo> pointsInfo;
}

