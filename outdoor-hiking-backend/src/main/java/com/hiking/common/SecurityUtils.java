package com.hiking.common;

import com.hiking.domain.LoginUser;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * 安全上下文工具
 */
public class SecurityUtils {

    private SecurityUtils() {}

    public static LoginUser getLoginUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof LoginUser) {
            return (LoginUser) principal;
        }
        return null;
    }

    public static Long getUserId() {
        LoginUser loginUser = getLoginUser();
        return loginUser == null ? null : loginUser.getUser().getId();
    }
    
    public static Long getCurrentUserId() {
        return getUserId();
    }
    
    public static String getCurrentUserRole() {
        LoginUser loginUser = getLoginUser();
        return loginUser == null ? null : loginUser.getUser().getRole();
    }

    public static String getUsername() {
        LoginUser loginUser = getLoginUser();
        return loginUser == null ? null : loginUser.getUsername();
    }

    public static boolean isAdmin() {
        LoginUser loginUser = getLoginUser();
        return loginUser != null && Constants.Role.ADMIN.equals(loginUser.getUser().getRole());
    }
}

