-- =============================================
-- 户外徒步活动管理系统 - 数据库初始化脚本
-- 数据库名: outdoor_hiking
-- MySQL版本: 8.0+
-- 字符集: utf8mb4
-- =============================================

-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS outdoor_hiking 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE outdoor_hiking;

-- =============================================
-- 1. 用户表（users）
-- =============================================
CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '用户主键',
  username VARCHAR(64) NOT NULL COMMENT '登录账号',
  password VARCHAR(128) NOT NULL COMMENT '密码哈希',
  role VARCHAR(16) NOT NULL DEFAULT 'participant' COMMENT 'participant/organizer/admin',
  real_name VARCHAR(32) COMMENT '真实姓名',
  mobile VARCHAR(32) COMMENT '手机号',
  email VARCHAR(64) COMMENT '邮箱',
  experience_level VARCHAR(32) COMMENT '徒步经验等级',
  health_status VARCHAR(64) COMMENT '健康状况描述',
  emergency_contact VARCHAR(64) COMMENT '紧急联系人',
  created_by BIGINT UNSIGNED DEFAULT 0 COMMENT '创建者',
  updated_by BIGINT UNSIGNED DEFAULT 0 COMMENT '更新者',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引
  UNIQUE KEY uk_username (username),
  UNIQUE KEY uk_mobile (mobile),
  KEY idx_role (role),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='系统账户信息';

-- =============================================
-- 2. 活动表（activities）
-- =============================================
CREATE TABLE IF NOT EXISTS activities (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '活动主键',
  organizer_id BIGINT UNSIGNED NOT NULL COMMENT '组织者用户 id',
  title VARCHAR(128) NOT NULL COMMENT '活动标题',
  summary VARCHAR(512) COMMENT '简介',
  difficulty VARCHAR(16) COMMENT '路线难度',
  location VARCHAR(128) COMMENT '地域/集合地',
  meeting_point VARCHAR(128) COMMENT '集合点描述',
  start_time DATETIME NOT NULL COMMENT '开始时间',
  end_time DATETIME NOT NULL COMMENT '结束时间',
  capacity INT UNSIGNED DEFAULT 0 COMMENT '人数上限',
  fee_info VARCHAR(128) COMMENT '费用说明',
  status VARCHAR(16) DEFAULT 'draft' COMMENT '状态 draft/pending/approved/closed',
  requirement_info JSON COMMENT '资格/健康/装备要求',
  attachments JSON COMMENT '路线/健康档案等文件',
  created_by BIGINT UNSIGNED DEFAULT 0 COMMENT '创建者',
  updated_by BIGINT UNSIGNED DEFAULT 0 COMMENT '更新者',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引
  KEY idx_organizer_id (organizer_id),
  KEY idx_status (status),
  KEY idx_start_time (start_time),
  KEY idx_location (location),
  KEY idx_difficulty (difficulty),
  KEY idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动基础信息';

-- =============================================
-- 3. 报名表（registrations）
-- =============================================
CREATE TABLE IF NOT EXISTS registrations (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '报名记录',
  activity_id BIGINT UNSIGNED NOT NULL COMMENT '活动 id',
  user_id BIGINT UNSIGNED NOT NULL COMMENT '参与者 id',
  status VARCHAR(16) DEFAULT 'pending' COMMENT 'pending/approved/rejected/waiting/cancelled',
  submitted_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '报名时间',
  reviewed_by BIGINT UNSIGNED DEFAULT 0 COMMENT '审核人',
  reviewed_at DATETIME COMMENT '审核时间',
  notes VARCHAR(512) COMMENT '审核备注',
  qualification_info JSON COMMENT '健康/经验/资质详情',
  created_by BIGINT UNSIGNED DEFAULT 0 COMMENT '创建者',
  updated_by BIGINT UNSIGNED DEFAULT 0 COMMENT '更新者',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引与约束
  UNIQUE KEY uk_activity_user (activity_id, user_id) COMMENT '防止重复报名',
  KEY idx_user_id (user_id),
  KEY idx_status (status),
  KEY idx_submitted_at (submitted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='参与者报名与审核';

-- =============================================
-- 4. 路线表（routes）
-- =============================================
CREATE TABLE IF NOT EXISTS routes (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '路线主键',
  activity_id BIGINT UNSIGNED NOT NULL COMMENT '所属活动',
  name VARCHAR(128) COMMENT '路线名',
  distance DECIMAL(6,2) COMMENT '总距离（km）',
  elevation_gain INT COMMENT '累计爬升（m）',
  difficulty_level VARCHAR(16) COMMENT '难度分级',
  geojson_path VARCHAR(256) COMMENT 'GeoJSON 数据或存储路径',
  description VARCHAR(512) COMMENT '路线描述',
  points_info JSON COMMENT '点位/风险/签到位数组',
  map_img_url VARCHAR(256) COMMENT '路线图链接',
  created_by BIGINT UNSIGNED DEFAULT 0 COMMENT '创建者',
  updated_by BIGINT UNSIGNED DEFAULT 0 COMMENT '更新者',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引
  KEY idx_activity_id (activity_id),
  KEY idx_difficulty_level (difficulty_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='路线与点位信息';

-- =============================================
-- 5. 签到记录（checkin_records）
-- =============================================
CREATE TABLE IF NOT EXISTS checkin_records (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '签到记录',
  activity_id BIGINT UNSIGNED NOT NULL COMMENT '活动',
  user_id BIGINT UNSIGNED NOT NULL COMMENT '参与者',
  route_id BIGINT UNSIGNED NOT NULL COMMENT '路线',
  point_index INT COMMENT 'points_info 中点位索引',
  checkpoint_name VARCHAR(128) COMMENT '签到点名称（冗余展示）',
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '签到时间',
  latitude DECIMAL(9,6) COMMENT '签到纬度',
  longitude DECIMAL(9,6) COMMENT '签到经度',
  status VARCHAR(16) COMMENT 'on_time/late/missed',
  gps_accuracy INT COMMENT '定位精度（m）',
  notes VARCHAR(256) COMMENT '备注',
  created_by BIGINT UNSIGNED DEFAULT 0 COMMENT '创建者',
  updated_by BIGINT UNSIGNED DEFAULT 0 COMMENT '更新者',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引
  KEY idx_activity_id (activity_id),
  KEY idx_user_id (user_id),
  KEY idx_route_id (route_id),
  KEY idx_timestamp (timestamp),
  KEY idx_activity_user (activity_id, user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='GPS 签到记录';

-- =============================================
-- 6. 轨迹与异常（trajectory_events）
-- =============================================
CREATE TABLE IF NOT EXISTS trajectory_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '轨迹事件',
  activity_id BIGINT UNSIGNED NOT NULL COMMENT '活动 id',
  user_id BIGINT UNSIGNED NOT NULL COMMENT '用户 id',
  event_type VARCHAR(32) COMMENT 'deviation/stop/emergency',
  geojson TEXT COMMENT '轨迹/围栏片段',
  triggered_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '触发时间',
  handled_by BIGINT UNSIGNED DEFAULT 0 COMMENT '处理人',
  status VARCHAR(16) DEFAULT 'open' COMMENT 'open/resolved',
  description VARCHAR(256) COMMENT '事件说明',
  created_by BIGINT UNSIGNED DEFAULT 0 COMMENT '创建者',
  updated_by BIGINT UNSIGNED DEFAULT 0 COMMENT '更新者',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引
  KEY idx_activity_id (activity_id),
  KEY idx_user_id (user_id),
  KEY idx_status (status),
  KEY idx_event_type (event_type),
  KEY idx_triggered_at (triggered_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='轨迹异常与安全事件';

-- =============================================
-- 7. 活动评价（activity_feedback）
-- =============================================
CREATE TABLE IF NOT EXISTS activity_feedback (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '评价记录',
  activity_id BIGINT UNSIGNED NOT NULL COMMENT '活动 id',
  user_id BIGINT UNSIGNED NOT NULL COMMENT '打分用户',
  rating TINYINT UNSIGNED COMMENT '评分 1-5',
  comment VARCHAR(512) COMMENT '文字反馈',
  tags VARCHAR(256) COMMENT '标签',
  created_by BIGINT UNSIGNED DEFAULT 0 COMMENT '创建者',
  updated_by BIGINT UNSIGNED DEFAULT 0 COMMENT '更新者',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引与约束
  UNIQUE KEY uk_activity_user (activity_id, user_id) COMMENT '防止重复评价',
  KEY idx_rating (rating),
  KEY idx_created_at (created_at),
  
  -- CHECK约束（MySQL 8.0+）
  CONSTRAINT chk_rating CHECK (rating >= 1 AND rating <= 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='参与者评分与反馈';

-- =============================================
-- 8. 系统事件（system_events）
-- =============================================
CREATE TABLE IF NOT EXISTS system_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY COMMENT '事件记录',
  activity_id BIGINT UNSIGNED COMMENT '关联活动',
  user_id BIGINT UNSIGNED COMMENT '触发/接收用户',
  event_type VARCHAR(32) COMMENT 'notification/audit',
  category VARCHAR(64) COMMENT 'review_result/alert/login/... ',
  title VARCHAR(128) COMMENT '展示标题',
  content TEXT COMMENT '正文/详情',
  resource_type VARCHAR(64) COMMENT '操作资源',
  resource_id BIGINT UNSIGNED COMMENT '资源标识',
  status VARCHAR(16) COMMENT 'pending/handled/read',
  ip_address VARCHAR(64) COMMENT '来源地址',
  sent_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '发生时间',
  read_at DATETIME COMMENT '阅读时间（通知场景）',
  created_by BIGINT UNSIGNED DEFAULT 0 COMMENT '创建者',
  updated_by BIGINT UNSIGNED DEFAULT 0 COMMENT '更新者',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引
  KEY idx_user_id (user_id),
  KEY idx_activity_id (activity_id),
  KEY idx_event_type (event_type),
  KEY idx_category (category),
  KEY idx_status (status),
  KEY idx_sent_at (sent_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='通知 + 审计日志';

-- =============================================
-- 9. 活动统计（activity_stats）
-- =============================================
CREATE TABLE IF NOT EXISTS activity_stats (
  activity_id BIGINT UNSIGNED PRIMARY KEY COMMENT '活动 id',
  total_registrations INT UNSIGNED DEFAULT 0 COMMENT '报名数',
  approved_count INT UNSIGNED DEFAULT 0 COMMENT '审核通过数',
  completion_rate DECIMAL(5,2) DEFAULT 0 COMMENT '完成率',
  heat_score DECIMAL(6,2) DEFAULT 0 COMMENT '热度值',
  reputation_score DECIMAL(6,2) DEFAULT 0 COMMENT '组织者信誉',
  abnormal_events INT UNSIGNED DEFAULT 0 COMMENT '异常事件数',
  period VARCHAR(16) COMMENT 'day/week/month',
  created_by BIGINT UNSIGNED DEFAULT 0 COMMENT '创建者',
  updated_by BIGINT UNSIGNED DEFAULT 0 COMMENT '更新者',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  
  -- 索引
  KEY idx_heat_score (heat_score),
  KEY idx_reputation_score (reputation_score)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='活动统计与热度';

-- =============================================
-- 初始化测试数据（可选）
-- =============================================

-- 插入管理员账号（密码: admin123 的BCrypt哈希值）
INSERT INTO users (username, password, role, real_name, mobile, email, created_by, updated_by) 
VALUES ('admin', '123', 'admin', '系统管理员', '13800138000', 'admin@hiking.com', 1, 1)
ON DUPLICATE KEY UPDATE username=username;

-- 插入测试组织者账号（密码: organizer123）
INSERT INTO users (username, password, role, real_name, mobile, email, experience_level, created_by, updated_by) 
VALUES ('organizer1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'organizer', '张三', '13900139000', 'organizer@hiking.com', '高级', 1, 1)
ON DUPLICATE KEY UPDATE username=username;

-- 插入测试参与者账号（密码: user123）
INSERT INTO users (username, password, role, real_name, mobile, email, experience_level, health_status, emergency_contact, created_by, updated_by) 
VALUES ('user1', '$2a$10$N.zmdr9k7uOCQb376NoUnuTJ8iAt6Z5EHsM8lE9lBOsl7iKTVKIUi', 'participant', '李四', '13700137000', 'user1@hiking.com', '中级', '健康', '王五 13600136000', 1, 1)
ON DUPLICATE KEY UPDATE username=username;

-- =============================================
-- 验证表创建
-- =============================================
SELECT 
    TABLE_NAME AS '表名',
    TABLE_COMMENT AS '表注释',
    TABLE_ROWS AS '行数',
    ROUND(DATA_LENGTH/1024/1024, 2) AS '数据大小(MB)',
    ROUND(INDEX_LENGTH/1024/1024, 2) AS '索引大小(MB)'
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'outdoor_hiking'
ORDER BY TABLE_NAME;

-- =============================================
-- 显示所有表的索引信息
-- =============================================
SELECT 
    TABLE_NAME AS '表名',
    INDEX_NAME AS '索引名',
    COLUMN_NAME AS '列名',
    INDEX_TYPE AS '索引类型',
    NON_UNIQUE AS '是否允许重复'
FROM information_schema.STATISTICS 
WHERE TABLE_SCHEMA = 'outdoor_hiking'
ORDER BY TABLE_NAME, INDEX_NAME, SEQ_IN_INDEX;

