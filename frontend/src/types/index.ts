// 用户类型
export interface User {
  id: number
  username: string
  realName?: string
  email: string
  phone: string
  role: 'participant' | 'organizer' | 'admin'
  avatar?: string
  createdAt: string
}

// 活动类型
export interface Activity {
  id: number
  title: string
  summary: string
  organizerId: number
  organizerName?: string
  difficulty: string
  location: string
  meetingPoint?: string
  startTime: string
  endTime: string
  capacity: number
  currentParticipants?: number
  feeInfo: string
  status: 'draft' | 'pending' | 'approved' | 'closed' | 'rejected'
  requirementInfo?: any
  attachments?: any
  createdAt: string
  updatedAt: string
}

// 路线类型
export interface Route {
  id: number
  activityId: number
  name: string
  distance: number
  elevationGain: number
  difficultyLevel: string
  pointsInfo: RoutePoint[]
  mapImgUrl?: string
  description?: string
}

// 路线点位
export interface RoutePoint {
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

// 报名记录
export interface Registration {
  id: number
  activityId: number
  userId: number
  status: 'pending' | 'approved' | 'rejected' | 'waiting' | 'cancelled'
  qualificationInfo?: string
  reviewNote?: string
  createdAt: string
}

// 签到记录
export interface CheckinRecord {
  id: number
  activityId: number
  userId: number
  routeId: number
  pointIndex: number
  checkpointName: string
  latitude: number
  longitude: number
  status: 'on_time' | 'delayed' | 'deviated' | 'early'
  gpsAccuracy?: number
  notes?: string
  timestamp: string
}

// 活动反馈
export interface ActivityFeedback {
  id: number
  activityId: number
  userId: number
  rating: number
  comment?: string
  tags?: string
  createdAt: string
}

// 活动统计
export interface ActivityStats {
  activityId: number
  totalRegistrations: number
  approvedCount: number
  completionRate: number
  heatScore: number
  reputationScore: number
  abnormalEvents: number
}

// API 响应
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

// 分页响应
export interface PageResponse<T> {
  records: T[]
  total: number
  current: number
  size: number
  pages: number
}

