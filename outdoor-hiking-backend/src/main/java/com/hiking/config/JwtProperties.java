package com.hiking.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * JWT 配置属性
 */
@Data
@Component
@ConfigurationProperties(prefix = "jwt")
public class JwtProperties {

    /**
     * Secret 密钥
     */
    private String secret;

    /**
     * Token 过期时间（毫秒）
     */
    private long expiration;

    /**
     * Token 前缀（包含空格，例如 "Bearer "）
     */
    private String tokenPrefix;

    /**
     * Header 名称
     */
    private String header;
}

