import request from '@/utils/request'
import type { PageResponse } from '@/types'

// 系统统计数据类型
export interface SystemStats {
  userCount: number
  activityCount: number
  completedActivityCount: number
  registrationCount: number
  checkinCount: number
}

// 活动数据分析类型
export interface ActivitiesData {
  dailyStats: Array<{
    date: string
    count: number
  }>
  difficultyStats: Array<{
    difficulty: string
    count: number
  }>
  statusStats: Array<{
    status: string
    count: number
  }>
}

// 用户数据分析类型
export interface UsersData {
  dailyStats: Array<{
    date: string
    count: number
  }>
  roleStats: Array<{
    role: string
    count: number
  }>
  activityStats: Array<{
    userId: number
    username: string
    realName?: string
    activityCount: number
  }>
}

// 地区数据分析类型
export interface RegionData {
  regionStats: Array<{
    region: string
    count: number
  }>
}

// 获取所有用户列表
export const getAllUsers = (params?: {
  page?: number
  size?: number
  keyword?: string
}) => {
  return request.get<any, PageResponse<any>>('/admin/users', { params })
}

// 更改用户角色
export const changeUserRole = (userId: number, role: string) => {
  return request.put<any, any>(`/admin/users/${userId}/role`, { role })
}

// 获取系统统计
export const getSystemStats = () => {
  return request.get<any, SystemStats>('/admin/stats')
}

// 获取活动数据分析
export const getActivitiesData = (days: number = 30) => {
  return request.get<any, ActivitiesData>('/admin/analytics/activities', { 
    params: { days } 
  })
}

// 获取用户数据分析
export const getUsersData = (days: number = 30) => {
  return request.get<any, UsersData>('/admin/analytics/users', { 
    params: { days } 
  })
}

// 获取地区数据分析
export const getRegionData = () => {
  return request.get<any, RegionData>('/admin/analytics/regions')
}
