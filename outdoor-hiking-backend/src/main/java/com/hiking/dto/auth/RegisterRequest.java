package com.hiking.dto.auth;

import jakarta.validation.constraints.NotBlank;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 注册请求参数
 */
@Data
@Schema(description = "注册请求")
public class RegisterRequest {

    @NotBlank(message = "用户名不能为空")
    @Schema(description = "用户名", example = "new_hiker")
    private String username;

    @NotBlank(message = "密码不能为空")
    @Schema(description = "密码", example = "securePassword123")
    private String password;

    @Schema(description = "角色", example = "participant")
    private String role;

    @Schema(description = "真实姓名", example = "张三")
    private String realName;

    @Schema(description = "手机号", example = "13800138000")
    private String mobile;

    @Schema(description = "邮箱", example = "user@example.com")
    private String email;
}

