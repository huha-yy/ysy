package com.hiking.config;

import com.hiking.common.CurrentUserHolder;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    public JwtRequestFilter(JwtTokenProvider tokenProvider) {
        this.tokenProvider = tokenProvider;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        try {
            String header = request.getHeader(tokenProvider.getJwtProperties().getHeader());
            if (StringUtils.hasText(header) && header.startsWith(tokenProvider.getJwtProperties().getTokenPrefix()) && tokenProvider.validateToken(header)) {
                String username = tokenProvider.getUsername(header);
                Long userId = tokenProvider.getUserId(header);
                String role = tokenProvider.getRole(header);
                CurrentUserHolder.setUsername(username);
                CurrentUserHolder.setUserId(userId);
                CurrentUserHolder.setRole(role);
            }
            // 继续过滤链，无论是否有token
            filterChain.doFilter(request, response);
        } finally {
            // 请求处理完成后，清除用户信息
            CurrentUserHolder.clear();
        }
    }
}
