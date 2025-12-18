import request from '@/utils/request'
import type { User } from '@/types'

// 登录
export const login = (data: { username: string; password: string }) => {
  return request.post<any, { token: string; user: User }>('/auth/login', data)
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

// 登出
export const logout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  window.location.href = '/login'
}

