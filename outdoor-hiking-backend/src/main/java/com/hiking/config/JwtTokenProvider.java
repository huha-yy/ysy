package com.hiking.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT 工具类
 */
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtProperties jwtProperties;

    @SuppressWarnings("deprecation")
    public String generateToken(String username, Long userId, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtProperties.getExpiration());
        return jwtProperties.getTokenPrefix() + Jwts.builder()
                .setSubject(username)
                .claim("userId", userId)
                .claim("role", role)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8)), SignatureAlgorithm.HS256)
                .compact();
    }

    @SuppressWarnings("deprecation")
    public Claims getClaims(String token) {
        String actualToken = removePrefix(token);
        return Jwts.parser()
                .setSigningKey(Keys.hmacShaKeyFor(jwtProperties.getSecret().getBytes(StandardCharsets.UTF_8)))
                .build()
                .parseClaimsJws(actualToken)
                .getBody();
    }

    public boolean validateToken(String token) {
        try {
            Claims claims = getClaims(token);
            return !claims.getExpiration().before(new Date());
        } catch (Exception e) {
            return false;
        }
    }

    public String getUsername(String token) {
        Claims claims = getClaims(token);
        return claims.getSubject();
    }

    public Long getUserId(String token) {
        Claims claims = getClaims(token);
        return claims.get("userId", Long.class);
    }

    public String getRole(String token) {
        Claims claims = getClaims(token);
        return claims.get("role", String.class);
    }

    public String removePrefix(String token) {
        if (token != null && token.startsWith(jwtProperties.getTokenPrefix())) {
            return token.substring(jwtProperties.getTokenPrefix().length());
        }
        return token;
    }

    public JwtProperties getJwtProperties() {
        return jwtProperties;
    }
}

