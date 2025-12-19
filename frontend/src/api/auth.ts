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

// 获取用户参与的活动列表
export const getUserActivities = (params?: {
  page?: number
  size?: number
  status?: string
}) => {
  // 使用后端API获取用户参与的活动
  const queryParams: any = {}
  if (params?.page) queryParams.page = params.page
  if (params?.size) queryParams.size = params.size
  if (params?.status) queryParams.status = params.status
  
  return request.get<any, any>('/users/activities', { params: queryParams })
}

// 获取用户的签到记录
export const getUserCheckins = (params?: {
  page?: number
  size?: number
}) => {
  // 使用后端API获取用户的签到记录
  const queryParams: any = {}
  if (params?.page) queryParams.page = params.page
  if (params?.size) queryParams.size = params.size
  
  return request.get<any, any>('/users/checkins', { params: queryParams })
}

// 管理员相关API
// 获取所有用户列表
export const getAllUsers = (params?: {
  page?: number
  size?: number
  keyword?: string
}) => {
  // 使用后端API获取所有用户列表
  const queryParams: any = {}
  if (params?.page) queryParams.page = params.page
  if (params?.size) queryParams.size = params.size
  if (params?.keyword) queryParams.keyword = params.keyword
  
  return request.get<any, any>('/admin/users', { params: queryParams })
}

// 更改用户角色
export const changeUserRole = (data: {
  userId: number
  role: 'participant' | 'organizer' | 'admin'
}) => {
  // 使用后端API更改用户角色
  return request.put<any, any>(`/admin/users/${data.userId}/role`, { role: data.role })
}

// 获取系统统计
export const getSystemStats = () => {
  // 使用后端API获取系统统计
  return request.get<any, any>('/admin/stats')
}

// 数据分析相关API
export const getActivitiesData = (params?: {
  days?: number
}) => {
  // 使用后端API获取活动数据分析
  const queryParams: any = {}
  if (params?.days) queryParams.days = params.days
  
  return request.get<any, any>('/admin/analytics/activities', { params: queryParams })
}

export const getUsersData = (params?: {
  days?: number
}) => {
  // 使用后端API获取用户数据分析
  const queryParams: any = {}
  if (params?.days) queryParams.days = params.days
  
  return request.get<any, any>('/admin/analytics/users', { params: queryParams })
}

export const getRegionData = () => {
  // 使用后端API获取地区数据分析
  return request.get<any, any>('/admin/analytics/regions')
}

// 登出
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}