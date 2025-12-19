import request from '@/utils/request'
import type { Route, PageResponse } from '@/types'

// 路线点位信息类型
export interface RoutePointInfo {
  pointIndex: number
  pointName: string
  pointType: 'start' | 'checkpoint' | 'rest' | 'end' | 'emergency'
  latitude: number
  longitude: number
  expectedMinutes?: number
  allowedDeviationMeters?: number
  allowedDelayMinutes?: number
  description?: string
  mandatory?: boolean
}

// 创建路线请求类型
export interface RouteCreateRequest {
  activityId: number
  name: string
  distance?: number
  elevationGain?: number
  difficultyLevel: string
  description?: string
  geojsonPath?: string
  mapImgUrl?: string
  pointsInfo: RoutePointInfo[]
}

// 更新路线请求类型
export interface RouteUpdateRequest {
  name?: string
  distance?: number
  elevationGain?: number
  difficultyLevel?: string
  description?: string
  geojsonPath?: string
  mapImgUrl?: string
  pointsInfo?: RoutePointInfo[]
}

// 创建路线
export const createRoute = (data: RouteCreateRequest) => {
  return request.post<any, Route>('/routes', data)
}

// 更新路线
export const updateRoute = (id: number, data: RouteUpdateRequest) => {
  return request.put<any, Route>(`/routes/${id}`, data)
}

// 删除路线
export const deleteRoute = (id: number) => {
  return request.delete(`/routes/${id}`)
}

// 获取路线详情
export const getRouteById = (id: number) => {
  return request.get<any, Route>(`/routes/${id}`)
}

// 根据活动ID获取路线列表
export const getRoutesByActivity = (activityId: number) => {
  return request.get<any, Route[]>(`/routes/activity/${activityId}`)
}

// 分页获取路线列表
export const getRoutesPage = (params?: {
  page?: number
  size?: number
  activityId?: number
}) => {
  return request.get<any, PageResponse<Route>>('/routes/page', { params })
}

// 获取路线的所有点位信息
export const getRoutePoints = (id: number) => {
  return request.get<any, RoutePointInfo[]>(`/routes/${id}/points`)
}

// 获取路线的特定点位信息
export const getRoutePoint = (id: number, pointIndex: number) => {
  return request.get<any, RoutePointInfo>(`/routes/${id}/points/${pointIndex}`)
}
