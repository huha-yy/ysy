## API 与参数契约（基于现有数据库结构）

### 通用约定
- 所有请求（除登录/刷新令牌）需在 `Authorization` header 中携带 `Bearer {token}`，JWT 里包含 `user_id`、`role`。  
- 时间统一使用 ISO-8601（`yyyy-MM-dd'T'HH:mm:ss`），后端统一以 UTC 存储。  
- 标准响应体：

```json
{
  "code": 0,
  "message": "success",
  "data": { ... }
}
```

- `code` 非 0 表示失败，比如 `1001`=权限不足、`1002`=参数非法。

### 1. 认证与用户

| 接口 | 方法 | 请求体 | 说明 |
| --- | --- | --- | --- |
| `POST /api/auth/register` | 注册 | `{ "username", "password", "realName", "mobile", "role" }` | 创建参与者/组织者 |
| `POST /api/auth/login` | 登录 | `{ "username", "password" }` | 返回 `{ token, userId, role }` |
| `GET /api/users/me` | 当前用户 | Header: Authorization | 获取 `users`（除 password） |

### 2. 活动与路线

- `POST /api/activities`（组织者）：

```json
{
  "title": "东部峡谷徒步",
  "summary": "探访峡谷原始步道",
  "difficulty": "中级",
  "location": "杭州市富阳区",
  "meetingPoint": "大源村广场",
  "startTime": "2026-01-20T08:00:00",
  "endTime": "2026-01-20T17:00:00",
  "capacity": 50,
  "feeInfo": "100元/人（含领队）",
  "requirementInfo": {
    "experience": "3 次 25km 以上徒步",
    "health": "无心脏病/高血压",
    "gear": ["登山鞋", "头灯"]
  },
  "attachments": [
    { "fileType": "route_doc", "fileUrl": "https://example.com/route.pdf" }
  ]
}
```

- `GET /api/activities`：支持 `status`、`role`、`keyword`、`startTime`、`location` 筛选，返回活动 + 路线概览。  
- `PUT/DELETE /api/activities/{id}`：组织者/管理员可修改状态（`draft/pending/approved/closed`）。

- `POST /api/activities/{id}/routes`：上传路线与点位

```json
{
  "name": "A 线",
  "distance": 24.5,
  "difficultyLevel": "中级",
  "geojsonPath": "/files/routeA.json",
  "pointsInfo": [
    { "type": "meeting", "lat": 30.12, "lon": 120.21, "radius": 100, "order": 1 },
    { "type": "checkpoint", "lat": 30.20, "lon": 120.27, "radius": 60, "order": 2 },
    { "type": "risk", "lat": 30.25, "lon": 120.30, "riskLevel": "高", "order": 3 }
  ]
}
```

- `GET /api/activities/{id}/routes`：返回路线详情与 `pointsInfo`。

### 3. 报名与审核

- `POST /api/activities/{id}/registrations`：

```json
{
  "qualificationInfo": {
    "healthReport": "正常",
    "experienceYears": 3,
    "files": [
      { "fileType": "health_doc", "fileUrl": "https://..." }
    ]
  }
}
```

- `GET /api/registrations?status=pending`: 组织者查询待审核列表。  
- `PATCH /api/registrations/{id}`：更新 `status`（`approved/rejected/waiting/cancelled`）、`notes`。  
- 审核结果通过 `POST /api/system-events`（`event_type=notification`）推送参与者。

### 4. 签到

- `POST /api/checkin-records`：

```json
{
  "activityId": 123,
  "routeId": 456,
  "pointIndex": 2,
  "checkpointName": "A 段中途点",
  "latitude": 30.203,
  "longitude": 120.275,
  "status": "on_time"
}
```

- 服务端根据 `routes.pointsInfo[pointIndex]` 计算偏差，若超出半径或时间窗则写入 `trajectory_events`（`event_type=deviation`）。  
- `GET /api/checkin-records?activityId=123&userId=456`：查询某人签到轨迹。

### 5. 轨迹与异常

- `POST /api/trajectory-events`（由定位服务或人工触发）：

```json
{
  "activityId": 123,
  "userId": 789,
  "eventType": "deviation",
  "geojson": "...",
  "description": "偏离路线 200m",
  "status": "open"
}
```

- `PATCH /api/trajectory-events/{id}`：更新 `status=resolved`、`handledBy`、`description`。  
- `GET /api/trajectory-events?activityId=123&status=open`：实时监控异常。

### 6. 反馈与数据

- `POST /api/activity-feedback`：
  - 请求体：`{ "activityId", "userId", "rating", "comment", "tags" }`。  
  - 后台批量更新 `activity_stats`，驱动热度/完成率等指标。  
- `GET /api/activity-feedback?activityId=123`：获取评价列表。  
- `GET /api/activity-stats/{activityId}`：返回 `total_registrations`、`heat_score`、`completion_rate`、`abnormal_events`、`reputation_score` 等字段。

### 7. 系统事件与通知

- `system_events` 合并通知与审计：
  - `POST /api/system-events`: `event_type=notification/audit`、`category`=review/alert/login；包含 `resourceType/resourceId`。  
  - `GET /api/system-events?userId=xxx&status=pending`：获取待处理提醒。  
  - `PATCH /api/system-events/{id}`：标记 `status=read/handled`，供前端页面刷新。

### 8. 扩展与同步

- `GET /api/activities/{id}/export`: 导出活动（含 `requirement_info`、`attachments`、`routes.pointsInfo`）用于巡检或迁移。  
- 建议配合 WebSocket/SSE 推送 `trajectory_events` 与 `system_events` 实时流。  
- 如需我把上述接口写成 OpenAPI/Swagger 定义或生成 Postman collection，也可继续推进。需要我补这部分吗？

