# 户外徒步活动管理系统 — 后端服务

本项目采用 Spring Boot 3、MyBatis-Plus、JWT/Spring Security、Redis、SpringDoc 等栈，提供活动全生命周期、报名审核与安全预警等能力。README 既是日常开发启动指南，也是部署说明。

## 一、技术概览

- **后端框架**：Spring Boot 3.2.1 + Spring Security + JWT
- **ORM**：MyBatis-Plus + 自动填充 + 分页/乐观锁/BlockAttack 拦截器
- **缓存/会话**：Redis（用于存储登录状态时可扩展）
- **安全**：JWT + `SecurityFilterChain` + `OpenAPI BearerAuth`
- **文档**：SpringDoc OpenAPI（`/swagger-ui.html`）
- **数据库**：MySQL（已在 `database/init_outdoor_hiking.sql` 提供创建脚本）

## 二、前期准备

1. 安装 Java 17、Maven 3.8+、MySQL 8+、Redis 6+。
2. 创建数据库：`outdoor_hiking` 并执行 `database/init_outdoor_hiking.sql`（含数据表、索引、测试账号）。
3. 修改 `src/main/resources/application-dev.yml` 中的 `spring.datasource`、`spring.data.redis` 和 `jwt.secret` 为本地值。
4. 可额外配置 `application-prod.yml` 供线上部署使用。

## 三、本地运行（开发模式）

```bash
# 启动 MySQL 与 Redis
mvn clean package
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

默认端口 `8080`。接口地址示例：

- 登录：`POST /api/auth/login`
- Swagger：`http://localhost:8080/swagger-ui.html`
- API 文档：`http://localhost:8080/v3/api-docs`
- Druid：`http://localhost:8080/druid`（仅 dev 模式）

## 四、配置说明

- `application.yml`：默认共用配置（服务器、JWT、日志、SpringDoc）。
- `development` profile：启用 Druid 监控、Redis 本地连接。
- `production` profile：关闭 Swagger/Druid，日志文件输出到 `/var/logs`，依赖环境变量 `DB_USERNAME` 等。
- `JwtProperties`：绑定 `jwt.*` 配置，`JwtTokenProvider` 提供 token 生成/校验。
- `MyBatisPlusConfig`：分页、乐观锁、BlockAttack 拦截器 + `MetaObjectHandler` 填充字段。

## 五、核心模块总结

- **认证**：`/api/auth/register`（注册）、`/api/auth/login`（统一 Result）。JWT 含 `userId`/`role`。
- **活动**：`/api/activities` 提供分页/详情/创建/更新/状态变更，权限：组织者或管理员，状态变更会写 `system_events`。
- **报名审核**：`/api/registrations` 接口分页+`/review` 审核。
- **签到与轨迹**：`/api/checkin-records` 记录签到、异常会发送通知；`/api/trajectory-events` 提供异常上报与处理。
- **通知/审计**：`system_events` 表统一存通知/审计，包括审核结果、预警、签到异常等。
- **统一响应**：`Result` + `ResultCode` + `ResponseResultAdvice` + `GlobalExceptionHandler` 保证结果结构一致。

## 六、测试建议

- 执行 `mvn test`，重点覆盖服务与控制器。
- 可选：编写 Postman/Insomnia Collection（建议续写）。
- 使用 Swagger UI 进行手动接口联调。

## 七、部署建议

1. 生产环境设置 `SPRING_PROFILES_ACTIVE=prod`。
2. 使用 Maven 构建：`mvn clean package -DskipTests`，生成 `outdoor-hiking-backend.jar`。
3. 运行示例（后台）：
   ```bash
   java -jar -Dspring.profiles.active=prod outdoor-hiking-backend.jar
   ```
4. 建议配合 Nginx + HTTPS 反向代理，配置 `Authorization` header 转发。
5. 配合 `system_events` + Redis + 日志监控（Prometheus/Grafana）可持续监控报名/签到/异常。

## 八、后续方向（可选）

- 补充前端/移动端调用示例（Axios + JWT）。
- 引入 WebSocket 推送 `system_events` 与 `trajectory-events`。
- 增加 `activity_stats` 的定时同步，生成热度/完成率。
- 编写 Postman + 自动化测试脚本。

## 九、启动提醒

请记得在本地 IDE 中启动 MySQL + Redis 后，再运行 Spring Boot 项目；若变更数据库结构，须重新执行 `init_outdoor_hiking.sql` 或手动同步。

