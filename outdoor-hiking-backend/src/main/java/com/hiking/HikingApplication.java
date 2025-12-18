package com.hiking;

import com.hiking.config.JwtProperties;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.Environment;

import java.net.InetAddress;
import java.net.UnknownHostException;

/**
 * 户外徒步活动管理系统 - 主启动类
 *
 * 说明：
 * - Redis 暂时未启用，后期可作为性能优化（缓存、token黑名单等）
 * - 使用 JWT 无状态认证，不依赖 Session
 */
@SpringBootApplication(exclude = {
    com.alibaba.druid.spring.boot3.autoconfigure.DruidDataSourceAutoConfigure.class
})
@MapperScan("com.hiking.mapper")
@EnableConfigurationProperties(JwtProperties.class)
public class HikingApplication {

    public static void main(String[] args) throws UnknownHostException {
        ConfigurableApplicationContext application = SpringApplication.run(HikingApplication.class, args);
        Environment env = application.getEnvironment();
        String ip = InetAddress.getLocalHost().getHostAddress();
        String port = env.getProperty("server.port");
        String path = env.getProperty("server.servlet.context-path");
        String basePath;
        if (path == null || path.isEmpty() || "/".equals(path)) {
            basePath = "";
        } else {
            basePath = path.startsWith("/") ? path : ("/" + path);
        }
        String rootLocal = basePath.isEmpty() ? "/" : basePath;
        String rootExternal = rootLocal;

        System.out.println("\n----------------------------------------------------------");
        System.out.println("\t户外徒步活动管理系统 - 启动成功！");
        System.out.println("\t本地访问地址:\thttp://localhost:" + port + rootLocal);
        System.out.println("\t外部访问地址:\thttp://" + ip + ":" + port + rootExternal);
        System.out.println("\tKnife4j文档:\thttp://localhost:" + port + basePath + "/doc.html");
        System.out.println("\tSwagger UI:\thttp://localhost:" + port + basePath + "/swagger-ui.html");
        System.out.println("\tAPI文档:\t\thttp://localhost:" + port + basePath + "/v3/api-docs");
        System.out.println("\tDruid监控:\thttp://localhost:" + port + basePath + "/druid");
        System.out.println("----------------------------------------------------------\n");
    }
}

