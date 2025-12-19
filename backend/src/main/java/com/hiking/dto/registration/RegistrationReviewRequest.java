package com.hiking.dto.registration;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

/**
 * 报名审核请求
 */
@Data
@Schema(description = "报名审核请求")
public class RegistrationReviewRequest {

    @NotNull
    @Schema(description = "报名ID")
    private Long id;

    @NotBlank
    @Schema(description = "审核状态", example = "approved")
    private String status;

    @Schema(description = "审核备注")
    private String notes;
}

