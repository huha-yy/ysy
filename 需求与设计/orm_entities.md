## ORM 实体草案（Java + JPA）

下面提供与当前 10 张表设计对应的 Java 实体示例（使用 `Jakarta Persistence` + `Lombok` 简化），可直接作为 SpringBoot 项目的基础数据模型。

```java
package com.example.trek.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String role;

    @Column(name = "real_name")
    private String realName;

    private String mobile;
    private String email;

    @Column(name = "experience_level")
    private String experienceLevel;

    @Column(name = "health_status")
    private String healthStatus;

    @Column(name = "emergency_contact")
    private String emergencyContact;

    @Column(name = "created_by")
    private Long createdBy;

    @Column(name = "updated_by")
    private Long updatedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

其余实体结构如下（省略 getter/setter，实际代码可用 Lombok 生成）：

### Activity

```java
@Data
@Entity
@Table(name = "activities")
public class Activity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "organizer_id")
    private Long organizerId;
    private String title;
    private String summary;
    private String difficulty;
    private String location;
    @Column(name = "meeting_point")
    private String meetingPoint;
    @Column(name = "start_time")
    private LocalDateTime startTime;
    @Column(name = "end_time")
    private LocalDateTime endTime;
    private Integer capacity;
    @Column(name = "fee_info")
    private String feeInfo;
    private String status;
    @Column(name = "requirement_info")
    private String requirementInfo;
    private String attachments;
    @Column(name = "created_by")
    private Long createdBy;
    @Column(name = "updated_by")
    private Long updatedBy;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### Registration

```java
@Data
@Entity
@Table(name = "registrations")
public class Registration {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "activity_id")
    private Long activityId;
    @Column(name = "user_id")
    private Long userId;
    private String status;
    @Column(name = "submitted_at")
    private LocalDateTime submittedAt;
    @Column(name = "reviewed_by")
    private Long reviewedBy;
    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
    private String notes;
    @Column(name = "qualification_info")
    private String qualificationInfo;
    @Column(name = "created_by")
    private Long createdBy;
    @Column(name = "updated_by")
    private Long updatedBy;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### Route

```java
@Data
@Entity
@Table(name = "routes")
public class Route {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "activity_id")
    private Long activityId;
    private String name;
    private Double distance;
    @Column(name = "elevation_gain")
    private Integer elevationGain;
    @Column(name = "difficulty_level")
    private String difficultyLevel;
    @Column(name = "geojson_path")
    private String geojsonPath;
    private String description;
    @Column(name = "points_info")
    private String pointsInfo;
    @Column(name = "map_img_url")
    private String mapImgUrl;
    @Column(name = "created_by")
    private Long createdBy;
    @Column(name = "updated_by")
    private Long updatedBy;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### CheckinRecord

```java
@Data
@Entity
@Table(name = "checkin_records")
public class CheckinRecord {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "activity_id")
    private Long activityId;
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "route_id")
    private Long routeId;
    @Column(name = "point_index")
    private Integer pointIndex;
    @Column(name = "checkpoint_name")
    private String checkpointName;
    private LocalDateTime timestamp;
    private Double latitude;
    private Double longitude;
    private String status;
    @Column(name = "gps_accuracy")
    private Integer gpsAccuracy;
    private String notes;
    @Column(name = "created_by")
    private Long createdBy;
    @Column(name = "updated_by")
    private Long updatedBy;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### TrajectoryEvent

```java
@Data
@Entity
@Table(name = "trajectory_events")
public class TrajectoryEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "activity_id")
    private Long activityId;
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "event_type")
    private String eventType;
    private String geojson;
    @Column(name = "triggered_at")
    private LocalDateTime triggeredAt;
    @Column(name = "handled_by")
    private Long handledBy;
    private String status;
    private String description;
    @Column(name = "created_by")
    private Long createdBy;
    @Column(name = "updated_by")
    private Long updatedBy;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### ActivityFeedback

```java
@Data
@Entity
@Table(name = "activity_feedback")
public class ActivityFeedback {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "activity_id")
    private Long activityId;
    @Column(name = "user_id")
    private Long userId;
    private Byte rating;
    private String comment;
    private String tags;
    @Column(name = "created_by")
    private Long createdBy;
    @Column(name = "updated_by")
    private Long updatedBy;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### SystemEvent

```java
@Data
@Entity
@Table(name = "system_events")
public class SystemEvent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "activity_id")
    private Long activityId;
    @Column(name = "user_id")
    private Long userId;
    @Column(name = "event_type")
    private String eventType;
    private String category;
    private String title;
    private String content;
    @Column(name = "resource_type")
    private String resourceType;
    @Column(name = "resource_id")
    private Long resourceId;
    private String status;
    @Column(name = "ip_address")
    private String ipAddress;
    @Column(name = "sent_at")
    private LocalDateTime sentAt;
    @Column(name = "read_at")
    private LocalDateTime readAt;
    @Column(name = "created_by")
    private Long createdBy;
    @Column(name = "updated_by")
    private Long updatedBy;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

### ActivityStats

```java
@Data
@Entity
@Table(name = "activity_stats")
public class ActivityStats {
    @Id
    @Column(name = "activity_id")
    private Long activityId;
    @Column(name = "total_registrations")
    private Integer totalRegistrations;
    @Column(name = "approved_count")
    private Integer approvedCount;
    @Column(name = "completion_rate")
    private Double completionRate;
    @Column(name = "heat_score")
    private Double heatScore;
    @Column(name = "reputation_score")
    private Double reputationScore;
    @Column(name = "abnormal_events")
    private Integer abnormalEvents;
    private String period;
    @Column(name = "created_by")
    private Long createdBy;
    @Column(name = "updated_by")
    private Long updatedBy;
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
```

以上类可以在 `model` 层搭配 `Repository` 与 `Service` 实现 CRUD/审核/通知等逻辑，如需我继续生成 DTO、Mapper 或测试用例，也可以接着展开。

