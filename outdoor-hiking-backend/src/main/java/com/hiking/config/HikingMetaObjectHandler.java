package com.hiking.config;

import com.baomidou.mybatisplus.core.handlers.MetaObjectHandler;
import lombok.extern.slf4j.Slf4j;
import org.apache.ibatis.reflection.MetaObject;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

/**
 * 通用元对象处理器：自动填充创建/更新时间以及操作人。
 *
 * <p>当前暂时将创建/更新人为 0，后续会替换为认证信息。
 */
@Slf4j
@Component
public class HikingMetaObjectHandler implements MetaObjectHandler {

    @Override
    public void insertFill(MetaObject metaObject) {
        LocalDateTime now = LocalDateTime.now();
        this.strictInsertFill(metaObject, "createdAt", LocalDateTime.class, now);
        this.strictInsertFill(metaObject, "updatedAt", LocalDateTime.class, now);
        this.strictInsertFill(metaObject, "createdBy", Long.class, 0L);
        this.strictInsertFill(metaObject, "updatedBy", Long.class, 0L);
    }

    @Override
    public void updateFill(MetaObject metaObject) {
        this.strictUpdateFill(metaObject, "updatedAt", LocalDateTime.class, LocalDateTime.now());
        this.strictUpdateFill(metaObject, "updatedBy", Long.class, 0L);
    }
}

