package com.hiking.common;

import com.baomidou.mybatisplus.core.metadata.IPage;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

/**
 * 分页响应结果
 *
 * @param <T> 数据类型
 * @author Hiking Team
 * @since 2025-01-20
 */
@Data
@Schema(description = "分页响应结果")
public class PageResult<T> implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 数据列表
     */
    @Schema(description = "数据列表")
    private List<T> records;

    /**
     * 总记录数
     */
    @Schema(description = "总记录数", example = "100")
    private Long total;

    /**
     * 当前页码
     */
    @Schema(description = "当前页码", example = "1")
    private Long current;

    /**
     * 每页大小
     */
    @Schema(description = "每页大小", example = "10")
    private Long size;

    /**
     * 总页数
     */
    @Schema(description = "总页数", example = "10")
    private Long pages;

    public PageResult() {
    }

    public PageResult(List<T> records, Long total, Long current, Long size) {
        this.records = records;
        this.total = total;
        this.current = current;
        this.size = size;
        this.pages = (total + size - 1) / size;
    }

    /**
     * 从 MyBatis Plus 的 IPage 转换
     */
    public static <T> PageResult<T> from(IPage<T> page) {
        return new PageResult<>(
                page.getRecords(),
                page.getTotal(),
                page.getCurrent(),
                page.getSize()
        );
    }

    /**
     * 从 MyBatis Plus 的 IPage 转换（别名方法）
     */
    public static <T> PageResult<T> of(IPage<T> page) {
        return from(page);
    }

    /**
     * 构建分页结果
     */
    public static <T> PageResult<T> build(List<T> records, Long total, Long current, Long size) {
        return new PageResult<>(records, total, current, size);
    }
}

