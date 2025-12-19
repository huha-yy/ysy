import request from '@/utils/request'
import type { PageResponse } from '@/types'

// 轨迹事件类型
export interface TrajectoryEvent {
  id: number
  activityId: number
  userId: number
  eventType: string
  geojson?: string
  triggeredAt: string
  handledBy?: number
  status: 'open' | 'resolved'
  description?: string
  createdBy?: number
  updatedBy?: number
  createdAt?: string
  updatedAt?: string
  user?: {
    id: number
    username: string
    realName?: string
  }
  activity?: {
    id: number
    title: string
  }
  handler?: {
    id: number
    username: string
    realName?: string
  }
}

// 查询轨迹事件请求类型
export interface TrajectoryEventQueryRequest {
  activityId?: number
  userId?: number
  eventType?: string
  status?: string
  startTime?: string
  endTime?: string
}

// 处理轨迹事件请求类型
export interface TrajectoryEventResolveRequest {
  id: number
  status: string
  description?: string
}

// 创建轨迹事件请求类型（通常是后端自动创建，前端主要用于测试）
export interface TrajectoryEventCreateRequest {
  activityId: number
  userId: number
  eventType: string
  geojson?: string
  description?: string
}

// 获取轨迹事件列表
export const getTrajectoryEvents = (params?: {
  page?: number
  size?: number
  activityId?: number
  userId?: number
  eventType?: string
  status?: string
  startTime?: string
  endTime?: string
}) => {
  return request.get<any, PageResponse<TrajectoryEvent>>('/trajectory-events', { params })
}

// 获取轨迹事件详情
export const getTrajectoryEventById = (id: number) => {
  return request.get<any, TrajectoryEvent>(`/trajectory-events/${id}`)
}

// 创建轨迹事件
export const createTrajectoryEvent = (data: TrajectoryEventCreateRequest) => {
  return request.post<any, TrajectoryEvent>('/trajectory-events', data)
}

// 处理轨迹事件
export const resolveTrajectoryEvent = (data: TrajectoryEventResolveRequest) => {
  return request.patch<any, any>('/trajectory-events/resolve', data)
}
