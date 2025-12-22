import { Routes, Route, Navigate } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Spin } from 'antd'
import MainLayout from './components/Layout/MainLayout'
import AuthGuard from './components/AuthGuard'

// 懒加载页面组件
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Home = lazy(() => import('./pages/Home'))
const ActivityList = lazy(() => import('./pages/ActivityList'))
const ActivityDetail = lazy(() => import('./pages/ActivityDetail'))
const RouteDetail = lazy(() => import('./pages/RouteDetail'))
const Checkin = lazy(() => import('./pages/Checkin'))
const Feedback = lazy(() => import('./pages/Feedback'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const OrganizerDashboard = lazy(() => import('./pages/OrganizerDashboard'))
const ActivityCreate = lazy(() => import('./pages/ActivityCreate'))
const RouteCreate = lazy(() => import('./pages/RouteCreate'))
const RouteList = lazy(() => import('./pages/RouteList'))
const TrajectoryMonitor = lazy(() => import('./pages/TrajectoryMonitor'))
const RegistrationManagement = lazy(() => import('./pages/RegistrationManagement'))
const FeedbackManagement = lazy(() => import('./pages/FeedbackManagement'))
const CheckpointSettings = lazy(() => import('./pages/CheckpointSettings'))
const CheckinStatistics = lazy(() => import('./pages/CheckinStatistics'))
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'))
const ActivityReview = lazy(() => import('./pages/ActivityReview'))
const UserManagement = lazy(() => import('./pages/UserManagement'))
const DataAnalytics = lazy(() => import('./pages/DataAnalytics'))
const UserAchievements = lazy(() => import('./pages/UserAchievements'))
const UserTrajectory = lazy(() => import('./pages/UserTrajectory'))

// 懒加载页面组件
const PageLoading = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Spin size="large" />
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
          <Route path="routes/:id" element={<RouteDetail />} />
          
          {/* 需要登录的路由 */}
          <Route element={<AuthGuard />}>
            <Route path="checkin/:activityId" element={<Checkin />} />
            <Route path="feedback/:activityId" element={<Feedback />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="achievements" element={<UserAchievements />} />
            <Route path="trajectory" element={<UserTrajectory />} />
          
            {/* 组织者路由 */}
            <Route path="organizer">
              <Route index element={<OrganizerDashboard />} />
              <Route path="activities/create" element={<ActivityCreate />} />
              <Route path="routes/create/:activityId" element={<RouteCreate />} />
              <Route path="routes/edit/:id" element={<RouteCreate />} />
              <Route path="routes" element={<RouteList />} />
              <Route path="trajectory" element={<TrajectoryMonitor />} />
              <Route path="registrations" element={<RegistrationManagement />} />
              <Route path="feedbacks" element={<FeedbackManagement />} />
              <Route path="checkpoints" element={<CheckpointSettings />} />
              <Route path="checkin-statistics" element={<CheckinStatistics />} />
            </Route>
            
            {/* 管理员路由 */}
            <Route path="admin">
              <Route index element={<AdminDashboard />} />
              <Route path="activities/review" element={<ActivityReview />} />
              <Route path="routes" element={<RouteList />} />
              <Route path="trajectory" element={<TrajectoryMonitor />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="analytics" element={<DataAnalytics />} />
              <Route path="registrations" element={<RegistrationManagement />} />
              <Route path="feedbacks" element={<FeedbackManagement />} />
              <Route path="checkpoints" element={<CheckpointSettings />} />
              <Route path="checkin-statistics" element={<CheckinStatistics />} />
            </Route>
            </Route>
        </Route>
        
        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default AppRouter