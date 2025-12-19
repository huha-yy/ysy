import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Select,
  DatePicker,
  Button,
  Space,
  Table,
  Tag,
  Statistic,
  message,
  Typography,
  Tooltip,
} from 'antd'
import {
  BarChartOutlined,
  CalendarOutlined,
  ReloadOutlined,
  CheckCircleOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import { getCheckinRecords } from '@/api/activity'
import { getActivities } from '@/api/activity'
import { useAuthStore } from '@/store/useAuthStore'
import type { CheckinRecord } from '@/types'
import type { PageResponse } from '@/types'
import dayjs from 'dayjs'
import './index.less'

const { Option } = Select
const { RangePicker } = DatePicker
const { Title, Text } = Typography

function CheckinStatistics() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [checkins, setCheckins] = useState<CheckinRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [size] = useState(10)
  const [activityId, setActivityId] = useState<number | undefined>()
  const [userId, setUserId] = useState<number | undefined>()
  const [status, setStatus] = useState<string | undefined>()
  const [timeRange, setTimeRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | undefined>()
  const [activities, setActivities] = useState<any[]>([])
  const [statistics, setStatistics] = useState<any>(null)

  // 检查权限
  if (user?.role !== 'organizer' && user?.role !== 'admin') {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div>您没有权限访问此页面</div>
      </div>
    )
  }

  // 加载签到记录
  const loadCheckins = async () => {
    setLoading(true)
    try {
      const params: any = { page, size }
      if (activityId) params.activityId = activityId
      if (userId) params.userId = userId
      if (status) params.status = status
      if (timeRange) {
        params.startTime = timeRange[0].toISOString()
        params.endTime = timeRange[1].toISOString()
      }

      const response: PageResponse<CheckinRecord> = await getCheckinRecords(params)
      setCheckins(response.records || [])
      setTotal(response.total || 0)
      
      // 计算统计数据
      if (response.records) {
        const totalCheckins = response.records.length
        const onTimeCheckins = response.records.filter(c => c.status === 'on_time').length
        const lateCheckins = response.records.filter(c => c.status === 'late').length
        const missedCheckins = response.records.filter(c => c.status === 'missed').length
        
        setStatistics({
          totalCheckins,
          onTimeCheckins,
          lateCheckins,
          missedCheckins,
          onTimeRate: totalCheckins > 0 ? Math.round((onTimeCheckins / totalCheckins) * 100) : 0,
        averageAccuracy: response.records.length > 0 
            ? Math.round(response.records.reduce((sum, c) => sum + (c.gpsAccuracy || 0), 0) / response.records.length) 
            : 0,
        })
      }
    } catch (error) {
      console.error('加载签到记录失败:', error)
      message.error('加载签到记录失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载活动列表
  const loadActivities = async () => {
    try {
      const response = await getActivities({ page: 1, size: 100 })
      setActivities(response.records || [])
    } catch (error) {
      console.error('加载活动列表失败:', error)
      // 不显示错误消息，因为API端点不存在是已知问题
    }
  }

  useEffect(() => {
    loadCheckins()
    loadActivities()
  }, [page, activityId, userId, status, timeRange])

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      on_time: 'green',
      late: 'orange',
      missed: 'red',
    }
    return colors[status] || 'default'
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      on_time: '准时',
      late: '延迟',
      missed: '缺席',
    }
    return texts[status] || status
  }

  // 表格列定义
  const columns = [
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => (
        <Space>
          <UserOutlined />
          <div>
            <div style={{ fontWeight: 600 }}>{user?.realName || user?.username}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {user?.username}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '活动',
      dataIndex: 'activity',
      key: 'activity',
      render: (activity: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{activity?.title || '未知活动'}</div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {activity?.location}
          </div>
        </div>
      ),
    },
    {
      title: '签到点',
      dataIndex: 'checkpointName',
      key: 'checkpointName',
      render: (name: string) => name || '-',
    },
    {
      title: '签到时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 150,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: 'GPS精度',
      dataIndex: 'gpsAccuracy',
      key: 'gpsAccuracy',
      width: 100,
      render: (accuracy: number) => accuracy ? `${accuracy}m` : '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (record: CheckinRecord) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EnvironmentOutlined />}
              onClick={() => {
                // 这里可以扩展为查看详情功能
                message.info(`查看签到详情功能开发中`)
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div className="checkin-statistics-page">
      <div className="container">
        <Card title="签到统计" extra={
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={loadCheckins}
            >
              刷新
            </Button>
          </Space>
        }>
          <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
            {/* 筛选区域 */}
            <Col span={24}>
              <Space wrap>
                <Select
                  placeholder="活动筛选"
                  allowClear
                  style={{ width: 200 }}
                  showSearch
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={setActivityId}
                >
                  {activities.map(activity => (
                    <Option key={activity.id} value={activity.id}>
                      {activity.title}
                    </Option>
                  ))}
                </Select>
                <Select
                  placeholder="用户筛选"
                  allowClear
                  style={{ width: 200 }}
                  showSearch
                  filterOption={(input, option) =>
                    option?.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  onChange={setUserId}
                >
                  {/* 这里可以加载用户列表，但暂时简化处理 */}
                  <Option key="1" value={1}>测试用户1</Option>
                  <Option key="2" value={2}>测试用户2</Option>
                </Select>
                <Select
                  placeholder="状态筛选"
                  allowClear
                  style={{ width: 150 }}
                  onChange={setStatus}
                >
                  <Option value="on_time">准时</Option>
                  <Option value="late">延迟</Option>
                  <Option value="missed">缺席</Option>
                </Select>
                <RangePicker
                  placeholder="时间范围"
                  style={{ width: 240 }}
                  onChange={setTimeRange}
                />
              </Space>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            {/* 统计数据 */}
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="总签到次数"
                  value={statistics?.totalCheckins || 0}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="准时签到"
                  value={statistics?.onTimeCheckins || 0}
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="延迟签到"
                  value={statistics?.lateCheckins || 0}
                  prefix={<CalendarOutlined />}
                  valueStyle={{ color: '#fa8c16' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Card>
                <Statistic
                  title="缺席签到"
                  value={statistics?.missedCheckins || 0}
                  prefix={<BarChartOutlined />}
                  valueStyle={{ color: '#f5222d' }}
                />
              </Card>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="准时率"
                  value={statistics?.onTimeRate || 0}
                  suffix="%"
                  precision={1}
                  valueStyle={{ color: '#52c41a' }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Card>
                <Statistic
                  title="平均GPS精度"
                  value={statistics?.averageAccuracy || 0}
                  suffix="m"
                  precision={1}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Card>
            </Col>
          </Row>

          {/* 签到记录表格 */}
          <Col span={24}>
            <Table
              columns={columns}
              dataSource={checkins}
              rowKey="id"
              loading={loading}
              pagination={{
                current: page,
                pageSize: size,
                total: total,
                onChange: setPage,
                showSizeChanger: false,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
              locale={{ emptyText: '暂无签到记录' }}
            />
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default CheckinStatistics
