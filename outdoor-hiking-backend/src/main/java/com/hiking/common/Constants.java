package com.hiking.common;

/**
 * 系统常量
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
public class Constants {

    /**
     * UTF-8 字符集
     */
    public static final String UTF8 = "UTF-8";

    /**
     * 成功标记
     */
    public static final Integer SUCCESS = 0;

    /**
     * 失败标记
     */
    public static final Integer FAIL = 1;

    /**
     * 登录用户 Redis Key 前缀
     */
    public static final String LOGIN_USER_KEY = "login:user:";

    /**
     * Token 有效期（Redis Key TTL，单位：秒）
     */
    public static final Long TOKEN_EXPIRE = 7 * 24 * 60 * 60L;

    /**
     * 验证码 Redis Key 前缀
     */
    public static final String CAPTCHA_CODE_KEY = "captcha:code:";

    /**
     * 验证码有效期（单位：分钟）
     */
    public static final Long CAPTCHA_EXPIRATION = 5L;

    /**
     * 用户角色
     */
    public static class Role {
        /**
         * 参与者
         */
        public static final String PARTICIPANT = "participant";

        /**
         * 组织者
         */
        public static final String ORGANIZER = "organizer";

        /**
         * 管理员
         */
        public static final String ADMIN = "admin";
    }

    /**
     * 活动状态
     */
    public static class ActivityStatus {
        /**
         * 草稿
         */
        public static final String DRAFT = "draft";

        /**
         * 待审核
         */
        public static final String PENDING = "pending";

        /**
         * 已批准
         */
        public static final String APPROVED = "approved";

        /**
         * 已关闭
         */
        public static final String CLOSED = "closed";

        /**
         * 已拒绝
         */
        public static final String REJECTED = "rejected";
    }

    /**
     * 报名状态
     */
    public static class RegistrationStatus {
        /**
         * 待审核
         */
        public static final String PENDING = "pending";

        /**
         * 已批准
         */
        public static final String APPROVED = "approved";

        /**
         * 已拒绝
         */
        public static final String REJECTED = "rejected";

        /**
         * 候补
         */
        public static final String WAITING = "waiting";

        /**
         * 已取消
         */
        public static final String CANCELLED = "cancelled";
    }
    
    // 快捷访问常量（为了向后兼容）
    String ROLE_ADMIN = Role.ADMIN;
    String ROLE_ORGANIZER = Role.ORGANIZER;
    String ROLE_PARTICIPANT = Role.PARTICIPANT;
    String REGISTRATION_STATUS_APPROVED = RegistrationStatus.APPROVED;
    String REGISTRATION_STATUS_PENDING = RegistrationStatus.PENDING;
    String REGISTRATION_STATUS_REJECTED = RegistrationStatus.REJECTED;

    /**
     * 签到状态
     */
    public static class CheckinStatus {
        /**
         * 准时
         */
        public static final String ON_TIME = "on_time";

        /**
         * 延迟
         */
        public static final String LATE = "late";

        /**
         * 缺席
         */
        public static final String MISSED = "missed";
    }

    /**
     * 轨迹事件类型
     */
    public static class TrajectoryEventType {
        /**
         * 偏离路线
         */
        public static final String DEVIATION = "deviation";

        /**
         * 长时间停留
         */
        public static final String STOP = "stop";

        /**
         * 紧急情况
         */
        public static final String EMERGENCY = "emergency";
    }

    /**
     * 轨迹事件状态
     */
    public static class TrajectoryEventStatus {
        /**
         * 未处理
         */
        public static final String OPEN = "open";

        /**
         * 已处理
         */
        public static final String RESOLVED = "resolved";
    }

    /**
     * 系统事件类型
     */
    public static class SystemEventType {
        /**
         * 通知
         */
        public static final String NOTIFICATION = "notification";

        /**
         * 审计
         */
        public static final String AUDIT = "audit";
    }

    /**
     * 系统事件分类
     */
    public static class SystemEventCategory {
        /**
         * 审核结果
         */
        public static final String REVIEW_RESULT = "review_result";

        /**
         * 预警
         */
        public static final String ALERT = "alert";

        /**
         * 登录
         */
        public static final String LOGIN = "login";

        /**
         * 操作
         */
        public static final String OPERATION = "operation";
    }

    /**
     * 点位类型
     */
    public static class PointType {
        /**
         * 集合点
         */
        public static final String MEETING = "meeting";

        /**
         * 签到点
         */
        public static final String CHECKPOINT = "checkpoint";

        /**
         * 风险点
         */
        public static final String RISK = "risk";

        /**
         * 终点
         */
        public static final String FINISH = "finish";
    }

    /**
     * 难度等级
     */
    public static class Difficulty {
        /**
         * 简单
         */
        public static final String EASY = "easy";

        /**
         * 中等
         */
        public static final String MEDIUM = "medium";

        /**
         * 困难
         */
        public static final String HARD = "hard";

        /**
         * 专家
         */
        public static final String EXPERT = "expert";
    }
}

