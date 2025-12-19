package com.hiking.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import com.hiking.common.SecurityUtils;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * 通用元对象处理器：自动填充创建/更新时间以及操作人。
 */
@Slf4j
@Component
public class HikingMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        LocalDateTime now = LocalDateTime.now();
        this.strictInsertFill(metaObject, "createdAt", LocalDateTime.class, now);
        this.strictInsertFill(metaObject, "updatedAt", LocalDateTime.class, now);
        
        // 尝试从当前用户上下文获取用户ID
        try {
            Long currentUserId = SecurityUtils.getUserId();
            this.strictInsertFill(metaObject, "createdBy", Long.class, currentUserId);
            this.strictInsertFill(metaObject, "updatedBy", Long.class, currentUserId);
            // 自动填充organizerId
            this.strictInsertFill(metaObject, "organizerId", Long.class, currentUserId);
        } catch (Exception e) {
            log.warn("无法获取当前用户ID，使用默认值0", e);
            this.strictInsertFill(metaObject, "createdBy", Long.class, 0L);
            this.strictInsertFill(metaObject, "updatedBy", Long.class, 0L);
            this.strictInsertFill(metaObject, "organizerId", Long.class, 0L);
        }
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
        
        // 尝试从当前用户上下文获取用户ID
        try {
            Long currentUserId = SecurityUtils.getUserId();
            this.strictUpdateFill(metaObject, "updatedBy", Long.class, currentUserId);
        } catch (Exception e) {
            log.warn("无法获取当前用户ID，使用默认值0", e);
            this.strictUpdateFill(metaObject, "updatedBy", Long.class, 0L);
        }
    }
}

