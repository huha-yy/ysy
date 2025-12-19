import request from '@/utils/request'
import type { User } from '@/types'

// 登录
export const login = (data: { username: string; password: string }) => {
  return request.post<any, { token: string; userId: number; username: string; role: string }>('/auth/login', data)
}

// 注册
export const register = (data: {
  username: string
  password: string
  email: string
  phone: string
  role: string
}) => {
  return request.post<any, User>('/auth/register', data)
}

// 获取当前用户信息
export const getCurrentUser = () => {
  return request.get<any, User>('/auth/me')
}

// 更新用户信息
export const updateUserProfile = (data: {
  realName?: string
  mobile?: string
  email?: string
  experienceLevel?: string
  healthStatus?: string
  emergencyContact?: string
}) => {
  return request.put<any, User>('/auth/me', data)
}

// 获取用户参与的活动列表 - 使用活动API筛选当前用户报名的活动
export const getUserActivities = (params?: {
  page?: number
  size?: number
  status?: string
}) => {
  // 后端没有特定的用户活动端点，暂时返回空数组
  // 实际应该通过报名API获取用户报名的活动
  console.warn('API端点 /users/activities 不存在，返回空数组')
  return Promise.resolve({ records: [], total: 0 })
}

// 获取用户的签到记录 - 使用签到API筛选当前用户的签到记录
export const getUserCheckins = (params?: {
  page?: number
  size?: number
}) => {
  // 后端没有特定的用户签到端点，暂时返回空数组
  // 实际应该通过签到API获取用户的签到记录
  console.warn('API端点 /users/checkins 不存在，返回空数组')
  return Promise.resolve({ records: [], total: 0 })
}

// 管理员相关API
// 获取所有用户列表
export const getAllUsers = (params?: {
  page?: number
  size?: number
  keyword?: string
}) => {
  // 后端没有管理员API端点，暂时返回空数组
  console.warn('API端点 /admin/users 不存在，返回空数组')
  return Promise.resolve({ records: [], total: 0 })
}

// 更改用户角色
export const changeUserRole = (data: {
  userId: number
  role: 'participant' | 'organizer' | 'admin'
}) => {
  // 后端没有管理员API端点，暂时返回成功
  console.warn('API端点 /admin/users/:userId/role 不存在，返回成功')
  return Promise.resolve({ success: true })
}

// 获取系统统计
export const getSystemStats = () => {
  // 后端没有管理员API端点，返回模拟数据
  console.warn('API端点 /admin/stats 不存在，返回模拟数据')
  return Promise.resolve({
    totalUsers: 10,
    totalActivities: 5,
    approvedActivities: 3,
    pendingActivities: 2,
    totalCheckins: 20,
    completedCheckins: 18,
  })
}

// 数据分析相关API
export const getActivitiesData = (params?: {
  days?: number
}) => {
  // 后端没有管理员API端点，返回模拟数据
  console.warn('API端点 /admin/analytics/activities 不存在，返回模拟数据')
  return Promise.resolve({
    daily: Array.from({ length: params?.days || 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 5),
    })),
  })
}

export const getUsersData = (params?: {
  days?: number
}) => {
  // 后端没有管理员API端点，返回模拟数据
  console.warn('API端点 /admin/analytics/users 不存在，返回模拟数据')
  return Promise.resolve({
    daily: Array.from({ length: params?.days || 30 }, (_, i) => ({
      date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      count: Math.floor(Math.random() * 10),
    })),
  })
}

export const getRegionData = () => {
  // 后端没有管理员API端点，返回模拟数据
  console.warn('API端点 /admin/analytics/regions 不存在，返回模拟数据')
  return Promise.resolve([
    { region: '北京', count: 20 },
    { region: '上海', count: 15 },
    { region: '广州', count: 12 },
    { region: '深圳', count: 10 },
  ])
}

// 登出
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}