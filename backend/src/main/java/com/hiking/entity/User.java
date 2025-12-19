package com.hiking.entity;

import com.baomidou.mybatisplus.annotation.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 用户实体
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
@TableName("users")
@Schema(description = "用户实体")
public class User implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 用户主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    @Schema(description = "用户ID", example = "1")
    private Long id;

    /**
     * 登录账号
     */
    @TableField("username")
    @Schema(description = "登录账号", example = "zhangsan")
    private String username;

    /**
     * 密码哈希
     */
    @TableField("password")
    @Schema(description = "密码", example = "********")
    @JsonIgnore
    private String password;

    /**
     * 角色 (participant/organizer/admin)
     */
    @TableField("role")
    @Schema(description = "角色", example = "participant", allowableValues = {"participant", "organizer", "admin"})
    private String role;

    /**
     * 真实姓名
     */
    @TableField("real_name")
    @Schema(description = "真实姓名", example = "张三")
    private String realName;

    /**
     * 手机号
     */
    @TableField("mobile")
    @Schema(description = "手机号", example = "13800138000")
    private String mobile;

    /**
     * 邮箱
     */
    @TableField("email")
    @Schema(description = "邮箱", example = "zhangsan@example.com")
    private String email;

    /**
     * 徒步经验等级
     */
    @TableField("experience_level")
    @Schema(description = "徒步经验等级", example = "中级")
    private String experienceLevel;

    /**
     * 健康状况描述
     */
    @TableField("health_status")
    @Schema(description = "健康状况描述", example = "健康")
    private String healthStatus;

    /**
     * 紧急联系人
     */
    @TableField("emergency_contact")
    @Schema(description = "紧急联系人", example = "李四 13900139000")
    private String emergencyContact;

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

