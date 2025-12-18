# 户外徒步活动管理系统 - 前端

## 技术栈

- ⚛️ **React 18** + **TypeScript** - 类型安全的现代化开发
- 🎨 **Ant Design 5** - 企业级UI组件库
- ⚡ **Vite** - 极速构建工具
- 🗺️ **高德地图 JS API** - 地图与定位服务
- 📊 **ECharts** - 数据可视化
- 🔄 **Zustand** - 轻量级状态管理
- 🪝 **ahooks** - React Hooks 工具库

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 项目结构

```
outdoor-hiking-frontend/
├── public/                 # 静态资源
│   └── logo.svg
├── src/
│   ├── api/               # API 接口
│   │   ├── activity.ts    # 活动相关
│   │   ├── auth.ts        # 认证相关
│   │   ├── checkin.ts     # 签到相关
│   │   └── ...
│   ├── assets/            # 图片、字体等资源
│   ├── components/        # 通用组件
│   │   ├── Layout/        # 布局组件
│   │   ├── Map/           # 地图组件
│   │   ├── ActivityCard/  # 活动卡片
│   │   └── ...
│   ├── pages/             # 页面组件
│   │   ├── Home/          # 首页
│   │   ├── ActivityList/  # 活动列表
│   │   ├── ActivityDetail/# 活动详情
│   │   ├── Checkin/       # 签到
│   │   ├── Dashboard/     # 个人中心
│   │   └── ...
│   ├── hooks/             # 自定义 Hooks
│   ├── store/             # 状态管理
│   ├── styles/            # 全局样式
│   ├── types/             # TypeScript 类型
│   ├── utils/             # 工具函数
│   ├── App.tsx            # 根组件
│   ├── main.tsx           # 入口文件
│   └── router.tsx         # 路由配置
├── .env.development       # 开发环境变量
├── .env.production        # 生产环境变量
├── index.html             # HTML 模板
├── tsconfig.json          # TypeScript 配置
├── vite.config.ts         # Vite 配置
└── package.json           # 项目依赖

```

## 环境变量

`.env.development`:
```
VITE_API_BASE_URL=http://localhost:8080/api
VITE_AMAP_KEY=你的高德地图Key
```

`.env.production`:
```
VITE_API_BASE_URL=https://api.hiking.com/api
VITE_AMAP_KEY=你的高德地图Key
```

## 响应式设计

- **PC端** (≥1200px): 完整功能，多列布局
- **平板** (768-1199px): 双列布局，抽屉菜单
- **移动端** (<768px): 单列布局，底部导航

## 核心功能

### 用户端
- ✅ 活动浏览与筛选（地图/列表模式）
- ✅ 活动详情与报名
- ✅ 实时签到与定位
- ✅ 活动反馈与评价
- ✅ 个人中心与历史

### 组织者端
- ✅ 活动创建与管理
- ✅ 报名审核
- ✅ 实时参与者监控
- ✅ 数据统计分析

### 管理员端
- ✅ 活动审核
- ✅ 用户管理
- ✅ 系统监控
- ✅ 数据报表

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## License

MIT

