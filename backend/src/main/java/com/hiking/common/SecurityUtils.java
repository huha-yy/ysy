package com.hiking.common;

public class SecurityUtils {

    private SecurityUtils() {}

    public static Long getUserId() {
        return CurrentUserHolder.getUserId();
    }

    public static Long getCurrentUserId() {
        return CurrentUserHolder.getUserId();
    }

    public static String getCurrentUserRole() {
        return CurrentUserHolder.getRole();
    }

    public static String getUsername() {
        return CurrentUserHolder.getUsername();
    }

    public static boolean isAdmin() {
        String role = getCurrentUserRole();
        return role != null && Constants.Role.ADMIN.equals(role);
    }
}

