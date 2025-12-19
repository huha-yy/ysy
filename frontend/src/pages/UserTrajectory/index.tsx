import React, { useState, useEffect } from 'react'
import { Card, Table, DatePicker, Button, Space, Tag, Spin, message, Empty, Tabs } from 'antd'
import { EnvironmentOutlined, CalendarOutlined, ClockCircleOutlined, FireOutlined } from '@ant-design/icons'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import dayjs from 'dayjs'
import type { ColumnsType } from 'antd/es/table'
import './index.less'

const { RangePicker } = DatePicker

// 轨迹记录接口
interface TrajectoryRecord {
  id: number
  activityId: number
  activityName: string
  activityDate: string
  startTime: string
  endTime?: string
  duration?: number // 分钟
  distance: number // 米
  checkinCount: number
  totalCheckins: number
  routeName: string
  routeImage?: string
  status: 'completed' | 'in_progress' | 'abandoned'
}

// 模拟获取用户轨迹记录数据
const fetchUserTrajectoryRecords = async (userId: number, dateRange?: [dayjs.Dayjs, dayjs.Dayjs]): Promise<TrajectoryRecord[]> => {
  // 在实际应用中，这里应该调用API获取数据
  // 模拟API调用延迟
  await new Promise(resolve => setTimeout(resolve, 500))
  
  // 模拟数据
  const mockData: TrajectoryRecord[] = [
    {
      id: 1,
      activityId: 1,
      activityName: '周末山地徒步',
      activityDate: '2024-01-15',
      startTime: '08:30',
      endTime: '12:45',
      duration: 255,
      distance: 8200,
      checkinCount: 5,
      totalCheckins: 6,
      routeName: '北山环线',
      routeImage: 'https://picsum.photos/seed/route1/400/200.jpg',
      status: 'completed'
    },
    {
      id: 2,
      activityId: 2,
      activityName: '春季登山挑战',
      activityDate: '2024-02-20',
      startTime: '09:00',
      endTime: '14:30',
      duration: 330,
      distance: 11200,
      checkinCount: 6,
      totalCheckins: 6,
      routeName: '南峰线路',
      routeImage: 'https://picsum.photos/seed/route2/400/200.jpg',
      status: 'completed'
    },
    {
      id: 3,
      activityId: 3,
      activityName: '夏日湖畔漫步',
      activityDate: '2024-03-10',
      startTime: '07:00',
      endTime: null,
      duration: null,
      distance: 5400,
      checkinCount: 2,
      totalCheckins: 4,
      routeName: '湖心小径',
      routeImage: 'https://picsum.photos/seed/route3/400/200.jpg',
      status: 'in_progress'
    }
  ]
  
  // 如果有日期范围，过滤数据
  if (dateRange) {
    const [start, end] = dateRange
    return mockData.filter(item => {
      const itemDate = dayjs(item.activityDate)
      return itemDate.isAfter(start.subtract(1, 'day')) && itemDate.isBefore(end.add(1, 'day'))
    })
  }
  
  return mockData
}

const UserTrajectory: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<TrajectoryRecord[]>([])
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null)
  const [activeTab, setActiveTab] = useState('all')
  const [userId] = useState<number>(1) // 在实际应用中，从用户状态获取

  const loadData = async () => {
    setLoading(true)
    try {
      const result = await fetchUserTrajectoryRecords(userId, dateRange || undefined)
      setData(result)
    } catch (error) {
      message.error('获取轨迹记录失败')
      console.error('获取轨迹记录失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [dateRange])

  // 状态过滤
  const filteredData = activeTab === 'all' ? data : data.filter(item => item.status === activeTab)

  // 表格列定义
  const columns: ColumnsType<TrajectoryRecord> = [
    {
      title: '活动信息',
      key: 'activity',
      render: (_, record) => (
        <div className="activity-info">
          <div className="activity-name">{record.activityName}</div>
          <div className="activity-date">
            <CalendarOutlined /> {record.activityDate}
          </div>
        </div>
      ),
    },
    {
      title: '路线',
      dataIndex: 'routeName',
      key: 'route',
      render: (text, record) => (
        <div className="route-info">
          <div className="route-name">{text}</div>
          {record.routeImage && (
            <img 
              src={record.routeImage} 
              alt={text} 
              className="route-image" 
            />
          )}
        </div>
      ),
    },
    {
      title: '时间',
      key: 'time',
      render: (_, record) => (
        <div className="time-info">
          <div><ClockCircleOutlined /> {record.startTime} {record.endTime ? `- ${record.endTime}` : ''}</div>
          {record.duration && (
            <div className="duration">时长: {Math.floor(record.duration / 60)}小时{record.duration % 60}分钟</div>
          )}
        </div>
      ),
    },
    {
      title: '距离',
      dataIndex: 'distance',
      key: 'distance',
      render: (distance) => `${(distance / 1000).toFixed(2)} 公里`,
      sorter: (a, b) => a.distance - b.distance,
    },
    {
      title: '签到',
      key: 'checkin',
      render: (_, record) => (
        <div className="checkin-info">
          <div>{record.checkinCount}/{record.totalCheckins} 点位</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(record.checkinCount / record.totalCheckins) * 100}%` }}
            ></div>
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const statusMap = {
          completed: { color: 'success', text: '已完成' },
          in_progress: { color: 'processing', text: '进行中' },
          abandoned: { color: 'error', text: '已放弃' }
        }
        const statusInfo = statusMap[status]
        return <Tag color={statusInfo.color}>{statusInfo.text}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">查看详情</Button>
          {record.status === 'in_progress' && (
            <Button type="primary" size="small">继续活动</Button>
          )}
        </Space>
      ),
    },
  ]

  const tabItems = [
    {
      key: 'all',
      label: '全部轨迹',
    },
    {
      key: 'in_progress',
      label: '进行中',
    },
    {
      key: 'completed',
      label: '已完成',
    },
    {
      key: 'abandoned',
      label: '已放弃',
    },
  ]

  return (
    <div className="user-trajectory-container">
      <Card title="我的轨迹记录" className="trajectory-card">
        <div className="trajectory-header">
          <div className="header-info">
            <h3>
              <EnvironmentOutlined /> 徒步轨迹记录
            </h3>
            <p>记录您参与的所有徒步活动轨迹和成就</p>
          </div>
          <div className="header-actions">
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder={['开始日期', '结束日期']}
              format="YYYY-MM-DD"
            />
            <Button type="primary" icon={<FireOutlined />}>生成分享海报</Button>
          </div>
        </div>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={tabItems}
          className="trajectory-tabs"
        />

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
          locale={{
            emptyText: loading ? <Spin size="large" /> : <Empty description="暂无轨迹记录" />
          }}
          className="trajectory-table"
        />
      </Card>
    </div>
  )
}

export default UserTrajectory
