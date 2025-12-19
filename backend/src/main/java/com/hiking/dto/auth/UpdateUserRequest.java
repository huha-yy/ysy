package com.hiking.dto.auth;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 更新用户信息请求
 */
@Data
@Schema(description = "更新用户信息请求")
public class UpdateUserRequest {

    @Schema(description = "真实姓名")
    private String realName;

    @Schema(description = "手机号")
    private String mobile;

    @Schema(description = "邮箱")
    private String email;

    @Schema(description = "经验等级")
    private String experienceLevel;

    @Schema(description = "健康状况")
    private String healthStatus;

    @Schema(description = "紧急联系人")
    private String emergencyContact;
}
