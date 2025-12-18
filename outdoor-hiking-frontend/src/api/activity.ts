import request from '@/utils/request'
import type { Activity, PageResponse } from '@/types'

// 获取活动列表
export const getActivities = (params?: {
  page?: number
  size?: number
  keyword?: string
  location?: string
  difficultyLevel?: string
  startTime?: string
  endTime?: string
}) => {
  return request.get<any, PageResponse<Activity>>('/activities/page', { params })
}

// 获取活动详情
export const getActivityById = (id: number) => {
  return request.get<any, Activity>(`/activities/${id}`)
}

// 创建活动
export const createActivity = (data: Partial<Activity>) => {
  return request.post<any, Activity>('/activities', data)
}

// 更新活动
export const updateActivity = (id: number, data: Partial<Activity>) => {
  return request.put<any, Activity>(`/activities/${id}`, data)
}

// 删除活动
export const deleteActivity = (id: number) => {
  return request.delete(`/activities/${id}`)
}

// 更改活动状态
export const changeActivityStatus = (id: number, status: string) => {
  return request.put(`/activities/${id}/status`, { status })
}

// 获取活动统计
export const getActivityStats = (id: number) => {
  return request.get(`/activities/${id}/stats`)
}

// 刷新活动统计
export const refreshActivityStats = (id: number) => {
  return request.post(`/activities/${id}/stats/refresh`)
}

