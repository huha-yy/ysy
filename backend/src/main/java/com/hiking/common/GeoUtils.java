package com.hiking.common;

import java.math.BigDecimal;

/**
 * 地理位置计算工具类
 *
 * @author Hiking Team
 * @since 2025-01-20
 */
public class GeoUtils {

    /**
     * 地球半径（米）
     */
    private static final double EARTH_RADIUS = 6371000;

    /**
     * 计算两个经纬度坐标之间的距离（米）
     * 使用 Haversine 公式
     *
     * @param lat1 第一个点的纬度
     * @param lon1 第一个点的经度
     * @param lat2 第二个点的纬度
     * @param lon2 第二个点的经度
     * @return 距离（米）
     */
    public static double calculateDistance(BigDecimal lat1, BigDecimal lon1, 
                                          BigDecimal lat2, BigDecimal lon2) {
        if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
            return 0;
        }

        double radLat1 = Math.toRadians(lat1.doubleValue());
        double radLat2 = Math.toRadians(lat2.doubleValue());
        double deltaLat = Math.toRadians(lat2.subtract(lat1).doubleValue());
        double deltaLon = Math.toRadians(lon2.subtract(lon1).doubleValue());

        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                   Math.cos(radLat1) * Math.cos(radLat2) *
                   Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

    /**
     * 计算两个经纬度坐标之间的距离（米）- Double 版本
     *
     * @param lat1 第一个点的纬度
     * @param lon1 第一个点的经度
     * @param lat2 第二个点的纬度
     * @param lon2 第二个点的经度
     * @return 距离（米）
     */
    public static double calculateDistance(double lat1, double lon1, 
                                          double lat2, double lon2) {
        double radLat1 = Math.toRadians(lat1);
        double radLat2 = Math.toRadians(lat2);
        double deltaLat = Math.toRadians(lat2 - lat1);
        double deltaLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
                   Math.cos(radLat1) * Math.cos(radLat2) *
                   Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return EARTH_RADIUS * c;
    }

    /**
     * 判断某个点是否在目标点的允许偏离范围内
     *
     * @param currentLat 当前位置纬度
     * @param currentLon 当前位置经度
     * @param targetLat 目标位置纬度
     * @param targetLon 目标位置经度
     * @param allowedDeviationMeters 允许偏离距离（米）
     * @return true-在范围内，false-超出范围
     */
    public static boolean isWithinRange(BigDecimal currentLat, BigDecimal currentLon,
                                       BigDecimal targetLat, BigDecimal targetLon,
                                       int allowedDeviationMeters) {
        double distance = calculateDistance(currentLat, currentLon, targetLat, targetLon);
        return distance <= allowedDeviationMeters;
    }

    /**
     * 格式化距离输出
     *
     * @param meters 距离（米）
     * @return 格式化的距离字符串（如：1.2km 或 350m）
     */
    public static String formatDistance(double meters) {
        if (meters >= 1000) {
            return String.format("%.1fkm", meters / 1000);
        } else {
            return String.format("%.0fm", meters);
        }
    }
}

