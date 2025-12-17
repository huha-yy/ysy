package com.hiking.common;

import lombok.Getter;

/**
 * 响应状态码枚举
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
@Getter
public enum ResultCode {

    /**
     * 成功
     */
    SUCCESS(0, "success"),

    /**
     * 失败
     */
    ERROR(1, "操作失败"),

    /**
     * 参数错误
     */
    PARAM_ERROR(1001, "参数错误"),

    /**
     * 参数为空
     */
    PARAM_IS_BLANK(1002, "参数为空"),

    /**
     * 参数类型错误
     */
    PARAM_TYPE_ERROR(1003, "参数类型错误"),

    /**
     * 参数缺失
     */
    PARAM_NOT_COMPLETE(1004, "参数缺失"),

    /**
     * 未登录
     */
    UNAUTHORIZED(2001, "未登录或登录已过期"),

    /**
     * 无权限
     */
    FORBIDDEN(2002, "无权限访问"),

    /**
     * 账号或密码错误
     */
    USER_ACCOUNT_ERROR(2003, "账号或密码错误"),

    /**
     * 账号已存在
     */
    USER_ACCOUNT_EXIST(2004, "账号已存在"),

    /**
     * 账号不存在
     */
    USER_NOT_EXIST(2005, "账号不存在"),

    /**
     * 账号已被禁用
     */
    USER_ACCOUNT_DISABLED(2006, "账号已被禁用"),

    /**
     * Token 无效
     */
    TOKEN_INVALID(2007, "Token无效"),

    /**
     * Token 过期
     */
    TOKEN_EXPIRED(2008, "Token已过期"),

    /**
     * 资源不存在
     */
    RESOURCE_NOT_FOUND(3001, "资源不存在"),

    /**
     * 资源已存在
     */
    RESOURCE_ALREADY_EXISTS(3002, "资源已存在"),

    /**
     * 活动不存在
     */
    ACTIVITY_NOT_FOUND(4001, "活动不存在"),

    /**
     * 活动已关闭
     */
    ACTIVITY_CLOSED(4002, "活动已关闭"),

    /**
     * 活动已满员
     */
    ACTIVITY_FULL(4003, "活动已满员"),

    /**
     * 已报名
     */
    ALREADY_REGISTERED(4004, "您已报名该活动"),

    /**
     * 未报名
     */
    NOT_REGISTERED(4005, "您未报名该活动"),

    /**
     * 资格不符
     */
    QUALIFICATION_NOT_MET(4006, "您的资格不符合活动要求"),

    /**
     * 签到失败
     */
    CHECKIN_FAILED(4007, "签到失败"),

    /**
     * 签到点不匹配
     */
    CHECKPOINT_MISMATCH(4008, "签到点不匹配"),

    /**
     * 已评价
     */
    ALREADY_FEEDBACK(4009, "您已评价过该活动"),

    /**
     * 报名不存在
     */
    REGISTRATION_NOT_FOUND(6001, "报名记录不存在"),

    /**
     * 系统错误
     */
    SYSTEM_ERROR(5000, "系统错误"),

    /**
     * 数据库错误
     */
    DATABASE_ERROR(5001, "数据库错误"),

    /**
     * Redis 错误
     */
    REDIS_ERROR(5002, "Redis错误"),

    /**
     * 网络错误
     */
    NETWORK_ERROR(5003, "网络错误"),

    /**
     * 文件上传失败
     */
    FILE_UPLOAD_ERROR(5004, "文件上传失败"),

    /**
     * 第三方服务错误
     */
    THIRD_PARTY_ERROR(5005, "第三方服务错误");

    /**
     * 状态码
     */
    private final Integer code;

    /**
     * 消息
     */
    private final String message;

    ResultCode(Integer code, String message) {
        this.code = code;
        this.message = message;
    }
}

