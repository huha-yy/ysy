import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Spin } from 'antd'
import MainLayout from './components/Layout/MainLayout'
import AuthGuard from './components/AuthGuard'

// 懒加载页面组件
const Home = lazy(() => import('./pages/Home'))
const ActivityList = lazy(() => import('./pages/ActivityList'))
const ActivityDetail = lazy(() => import('./pages/ActivityDetail'))
const ActivityCreate = lazy(() => import('./pages/ActivityCreate'))
const Checkin = lazy(() => import('./pages/Checkin'))
const Feedback = lazy(() => import('./pages/Feedback'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const OrganizerDashboard = lazy(() => import('./pages/OrganizerDashboard'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))

// Loading 组件
const PageLoading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" tip="加载中..." />
  </div>
)

function AppRouter() {
  return (
    <Suspense fallback={<PageLoading />}>
      <Routes>
        {/* 公开路由 */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* 主布局路由 */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="activities" element={<ActivityList />} />
          <Route path="activities/:id" element={<ActivityDetail />} />
          
          {/* 需要登录的路由 */}
          <Route element={<AuthGuard />}>
            <Route path="checkin/:activityId" element={<Checkin />} />
            <Route path="feedback/:activityId" element={<Feedback />} />
            <Route path="dashboard" element={<Dashboard />} />
            
            {/* 组织者路由 */}
            <Route path="organizer">
              <Route index element={<OrganizerDashboard />} />
              <Route path="activities/create" element={<ActivityCreate />} />
            </Route>
            
            {/* 管理员路由 */}
            <Route path="admin" element={<AdminDashboard />} />
          </Route>
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter

