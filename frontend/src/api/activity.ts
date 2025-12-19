import request from '@/utils/request'
import type { Activity, PageResponse, Route, Registration, CheckinRecord, ActivityFeedback } from '@/types'

// 获取活动列表
export const getActivities = (params?: {
  page?: number
  size?: number
  keyword?: string
  status?: string
  difficulty?: string
  startTime?: string
  endTime?: string
}) => {
  return request.get<any, PageResponse<Activity>>('/activities', { params })
}

// 获取活动详情
export const getActivityById = (id: number) => {
  return request.get<any, Activity>(`/activities/${id}`)
}

// 获取活动路线
export const getActivityRoutes = (activityId: number) => {
  return request.get<any, Route[]>(`/routes/activity/${activityId}`)
}

// 报名活动
export const registerActivity = (activityId: number, data: any) => {
  return request.post<any, Registration>(`/activities/${activityId}/registrations`, data)
}

// 获取活动报名状态
export const getRegistrationStatus = (activityId: number) => {
  return request.get<any, Registration>(`/registrations/activity/${activityId}/user`)
}

// 创建活动
export const createActivity = (data: any) => {
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
  return request.patch(`/activities/${id}/status`, { status })
}

// 获取活动统计
export const getActivityStats = (id: number) => {
  return request.get(`/activities/${id}/stats`)
}

// 刷新活动统计
export const refreshActivityStats = (id: number) => {
  return request.post(`/activities/${id}/stats/refresh`)
}

// 提交签到
export const submitCheckin = (data: {
  activityId: number
  routeId: number
  pointIndex: number
  checkpointName: string
  latitude: number
  longitude: number
  status: string
}) => {
  return request.post<any, CheckinRecord>('/checkin-records', data)
}

// 获取活动签到记录
export const getCheckinRecords = (activityId?: number, userId?: number) => {
  const params: any = {}
  if (activityId) params.activityId = activityId
  if (userId) params.userId = userId
  return request.get<any, CheckinRecord[]>('/checkin-records', { params })
}

// 获取路线点位信息
export const getRoutePoints = (routeId: number) => {
  return request.get<any, any>(`/routes/${routeId}/points`)
}

// 提交活动反馈
export const submitFeedback = (data: {
  activityId: number
  rating: number
  comment?: string
  tags?: string[]
}) => {
  return request.post<any, ActivityFeedback>('/feedbacks', data)
}

// 获取活动反馈列表
export const getFeedbackList = (activityId?: number, page?: number, size?: number) => {
  if (activityId) {
    // 使用活动特定端点
    return request.get<any, ActivityFeedback[]>(`/feedbacks/activity/${activityId}`)
  }
  // 使用分页端点
  const params: any = {}
  if (page) params.page = page
  if (size) params.size = size
  return request.get<any, ActivityFeedback[]>('/feedbacks/page', { params })
}

// 获取活动反馈统计
export const getFeedbackStats = (activityId: number) => {
  return request.get<any, any>(`/feedbacks/activity/${activityId}/statistics`)
}

// 组织者相关API
// 获取待审核的报名列表
export const getPendingRegistrations = (params?: {
  page?: number
  size?: number
  activityId?: number
}) => {
  const queryParams: any = {
    status: 'pending', // 添加status参数筛选待审核的报名
  }
  if (params?.page) queryParams.page = params.page
  if (params?.size) queryParams.size = params.size
  if (params?.activityId) queryParams.activityId = params.activityId
  
  return request.get<any, any>('/registrations', { params: queryParams })
}

// 审核报名申请
export const reviewRegistration = (data: {
  id: number
  status: 'approved' | 'rejected' | 'waiting'
  notes?: string
}) => {
  return request.patch<any, any>('/registrations/review', data)
}

// 获取组织的活动列表 - 使用通用活动API但添加status参数筛选
export const getOrganizerActivities = (params?: {
  page?: number
  size?: number
  status?: string
  keyword?: string
}) => {
  // 后端没有特定的organizer端点，使用通用activities端点
  // 前端暂时使用mock数据或改为获取所有活动
  console.warn('API端点 /activities/organizer 不存在，使用通用端点 /activities')
  return request.get<any, any>('/activities', { params })
}

// 获取活动报名统计 - 使用活动统计API
export const getRegistrationStats = (activityId?: number) => {
  if (!activityId) {
    console.error('activityId参数缺失')
    return Promise.reject(new Error('activityId参数缺失'))
  }
  return request.get<any, any>(`/activities/${activityId}/stats`)
}