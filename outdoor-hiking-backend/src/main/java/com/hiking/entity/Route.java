package com.hiking.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.baomidou.mybatisplus.extension.handlers.JacksonTypeHandler;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 路线实体
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
@TableName(value = "routes", autoResultMap = true)
@Schema(description = "路线实体")
public class Route implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 路线主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "路线ID", example = "1")
    private Long id;

    /**
     * 所属活动
     */
    @TableField("activity_id")
    @Schema(description = "所属活动ID", example = "1")
    private Long activityId;

    /**
     * 路线名
     */
    @TableField("name")
    @Schema(description = "路线名", example = "A 线")
    private String name;

    /**
     * 总距离（km）
     */
    @TableField("distance")
    @Schema(description = "总距离（km）", example = "24.5")
    private BigDecimal distance;

    /**
     * 累计爬升（m）
     */
    @TableField("elevation_gain")
    @Schema(description = "累计爬升（m）", example = "800")
    private Integer elevationGain;

    /**
     * 难度分级
     */
    @TableField("difficulty_level")
    @Schema(description = "难度分级", example = "中级")
    private String difficultyLevel;

    /**
     * GeoJSON 数据或存储路径
     */
    @TableField("geojson_path")
    @Schema(description = "GeoJSON路径")
    private String geojsonPath;

    /**
     * 路线描述
     */
    @TableField("description")
    @Schema(description = "路线描述")
    private String description;

    /**
     * 点位/风险/签到位数组 (JSON)
     */
    @TableField(value = "points_info", typeHandler = JacksonTypeHandler.class)
    @Schema(description = "点位信息")
    private Object pointsInfo;

    /**
     * 路线图链接
     */
    @TableField("map_img_url")
    @Schema(description = "路线图URL")
    private String mapImgUrl;

    /**
     * 创建者
     */
    @TableField(value = "created_by", fill = FieldFill.INSERT)
    @Schema(description = "创建者ID")
    private Long createdBy;

    /**
     * 更新者
     */
    @TableField(value = "updated_by", fill = FieldFill.INSERT_UPDATE)
    @Schema(description = "更新者ID")
    private Long updatedBy;

    /**
     * 创建时间
     */
    @TableField(value = "created_at", fill = FieldFill.INSERT)
    @Schema(description = "创建时间")
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    @TableField(value = "updated_at", fill = FieldFill.INSERT_UPDATE)
    @Schema(description = "更新时间")
    private LocalDateTime updatedAt;
}

