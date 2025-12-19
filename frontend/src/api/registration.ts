import request from '@/utils/request'
import type { PageResponse } from '@/types'

// 报名查询请求类型
export interface RegistrationQueryRequest {
  activityId?: number
  userId?: number
  status?: string
}

// 报名审核请求类型
export interface RegistrationReviewRequest {
  id: number
  status: 'approved' | 'rejected' | 'waiting'
  notes?: string
}

// 获取报名列表
export const getRegistrations = (params?: {
  page?: number
  size?: number
  keyword?: string
  status?: string
  activityId?: number
}) => {
  return request.get<any, PageResponse<any>>('/registrations', { params })
}

// 审核报名
export const reviewRegistration = (data: RegistrationReviewRequest) => {
  return request.patch<any, any>('/registrations/review', data)
}

// 获取用户对活动的报名状态
export const getUserRegistrationForActivity = (activityId: number) => {
  return request.get<any, any>(`/registrations/activity/${activityId}/user`)
}
