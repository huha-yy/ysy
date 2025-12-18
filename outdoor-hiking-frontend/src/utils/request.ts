import axios, { AxiosError } from 'axios'
import { message } from 'antd'
import type { ApiResponse } from '@/types'

// 创建 axios 实例
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 15000,
})

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse

    // 如果返回的状态码不是 0，说明接口报错
    if (res.code !== 0) {
      message.error(res.message || '请求失败')
      
      // 2001: 未登录或登录过期
      if (res.code === 2001) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
      
      return Promise.reject(new Error(res.message || '请求失败'))
    }

    return res.data
  },
  (error: AxiosError) => {
    console.error('请求错误:', error)
    
    if (error.response) {
      const status = error.response.status
      
      switch (status) {
        case 401:
          message.error('未登录或登录已过期')
          localStorage.removeItem('token')
          localStorage.removeItem('user')
          window.location.href = '/login'
          break
        case 403:
          message.error('没有权限访问')
          break
        case 404:
          message.error('请求的资源不存在')
          break
        case 500:
          message.error('服务器错误')
          break
        default:
          message.error('网络错误，请稍后重试')
      }
    } else if (error.request) {
      message.error('网络错误，请检查您的网络连接')
    } else {
      message.error('请求配置错误')
    }

    return Promise.reject(error)
  }
)

export default request

