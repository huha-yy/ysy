import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  DatePicker,
  Modal,
  message,
  Form,
  Drawer,
  Descriptions,
  Divider,
  Typography,
  Alert,
} from 'antd'
import {
  ExclamationCircleOutlined,
  SearchOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  EyeOutlined,
  SyncOutlined,
} from '@ant-design/icons'
import { getTrajectoryEvents, resolveTrajectoryEvent } from '@/api/trajectory'
import { getActivityById } from '@/api/activity'
import { useAuthStore } from '@/store/useAuthStore'
import type { TrajectoryEvent, TrajectoryEventResolveRequest } from '@/api/trajectory'
import type { Activity } from '@/types'
import dayjs from 'dayjs'
import './index.less'

const { RangePicker } = DatePicker
const { Option } = Select
const { Text, Title } = Typography

function TrajectoryMonitor() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [events, setEvents] = useState<TrajectoryEvent[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [size] = useState(10)
  const [selectedEvent, setSelectedEvent] = useState<TrajectoryEvent | null>(null)
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
  const [resolveModalVisible, setResolveModalVisible] = useState(false)
  const [resolveForm] = Form.useForm()
  const [filters, setFilters] = useState({
    activityId: undefined as number | undefined,
    userId: undefined as number | undefined,
    eventType: undefined as string | undefined,
    status: undefined as string | undefined,
    timeRange: undefined as [dayjs.Dayjs, dayjs.Dayjs] | undefined,
  })

  // 加载轨迹事件列表
  const loadEvents = async () => {
    setLoading(true)
    try {
      const params: any = {
        page,
        size,
      }

      if (filters.activityId) params.activityId = filters.activityId
      if (filters.userId) params.userId = filters.userId
      if (filters.eventType) params.eventType = filters.eventType
      if (filters.status) params.status = filters.status
      if (filters.timeRange) {
        params.startTime = filters.timeRange[0].toISOString()
        params.endTime = filters.timeRange[1].toISOString()
      }

      const response = await getTrajectoryEvents(params)
      
      // 为每个事件获取活动和用户信息
      const eventsWithDetails = await Promise.all(
        response.records.map(async (event) => {
          const enhancedEvent = { ...event }
          
          // 获取活动信息
          try {
            const activity = await getActivityById(event.activityId)
            enhancedEvent.activity = activity
          } catch (error) {
            console.error(`获取活动 ${event.activityId} 信息失败:`, error)
            enhancedEvent.activity = { id: event.activityId, title: '未知活动' }
          }
          
          return enhancedEvent
        })
      )

      setEvents(eventsWithDetails)
      setTotal(response.total)
    } catch (error) {
      console.error('加载轨迹事件失败:', error)
      message.error('加载轨迹事件失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [page, filters])

  // 查看事件详情
  const handleViewEventDetail = (event: TrajectoryEvent) => {
    setSelectedEvent(event)
    setDetailDrawerVisible(true)
  }

  // 处理轨迹事件
  const handleResolveEvent = (event: TrajectoryEvent) => {
    setSelectedEvent(event)
    setResolveForm.setFieldsValue({
      id: event.id,
      status: 'resolved',
      description: '',
    })
    setResolveModalVisible(true)
  }

  // 提交处理
  const handleSubmitResolve = async (values: any) => {
    try {
      const data: TrajectoryEventResolveRequest = {
        id: values.id,
        status: values.status,
        description: values.description,
      }
      
      await resolveTrajectoryEvent(data)
      message.success('轨迹事件处理成功')
      setResolveModalVisible(false)
      setSelectedEvent(null)
      resolveForm.resetFields()
      loadEvents()
    } catch (error) {
      console.error('处理轨迹事件失败:', error)
      message.error('处理轨迹事件失败')
    }
  }

  // 获取事件类型标签颜色
  const getEventTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      deviation: 'orange',
      'signal-lost': 'red',
      'stuck-too-long': 'purple',
      'off-route': 'volcano',
      emergency: 'red',
    }
    return colors[type] || 'default'
  }

  // 获取事件类型文本
  const getEventTypeText = (type: string) => {
    const texts: Record<string, string> = {
      deviation: '轨迹偏离',
      'signal-lost': '信号丢失',
      'stuck-too-long': '停留过久',
      'off-route': '偏离路线',
      emergency: '紧急情况',
    }
    return texts[type] || type
  }

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    return status === 'open' ? 'red' : 'green'
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    return status === 'open' ? '未处理' : '已处理'
  }

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '事件类型',
      dataIndex: 'eventType',
      key: 'eventType',
      width: 120,
      render: (type: string) => (
        <Tag color={getEventTypeColor(type)}>
          {getEventTypeText(type)}
        </Tag>
      ),
    },
    {
      title: '活动',
      dataIndex: 'activity',
      key: 'activity',
      render: (activity?: { id: number; title: string }) => (
        <Button type="link" onClick={() => window.open(`/activities/${activity?.id}`)}>
          {activity?.title || '未知活动'}
        </Button>
      ),
    },
    {
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      width: 120,
      render: (user?: { id: number; username: string; realName?: string }) => (
        <Space>
          <UserOutlined />
          <span>{user?.realName || user?.username || '未知用户'}</span>
        </Space>
      ),
    },
    {
      title: '触发时间',
      dataIndex: 'triggeredAt',
      key: 'triggeredAt',
      width: 180,
      render: (time: string) => dayjs(time).format('YYYY-MM-DD HH:mm:ss'),
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
      width: 180,
      render: (record: TrajectoryEvent) => (
        <Space>
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewEventDetail(record)}
          >
            查看
          </Button>
          {record.status === 'open' && (user?.role === 'organizer' || user?.role === 'admin') && (
            <Button
              type="link"
              icon={<CheckCircleOutlined />}
              onClick={() => handleResolveEvent(record)}
            >
              处理
            </Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="trajectory-monitor-page">
      <div className="container">
        <Card title="轨迹异常监控">
          {/* 筛选区域 */}
          <div className="filter-section">
            <Space wrap>
              <Input
                placeholder="用户ID"
                style={{ width: 120 }}
                value={filters.userId}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value ? Number(e.target.value) : undefined })}
              />
              <Select
                placeholder="事件类型"
                style={{ width: 150 }}
                allowClear
                value={filters.eventType}
                onChange={(value) => setFilters({ ...filters, eventType: value })}
              >
                <Option value="deviation">轨迹偏离</Option>
                <Option value="signal-lost">信号丢失</Option>
                <Option value="stuck-too-long">停留过久</Option>
                <Option value="off-route">偏离路线</Option>
                <Option value="emergency">紧急情况</Option>
              </Select>
              <Select
                placeholder="状态"
                style={{ width: 120 }}
                allowClear
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
              >
                <Option value="open">未处理</Option>
                <Option value="resolved">已处理</Option>
              </Select>
              <RangePicker
                style={{ width: 240 }}
                placeholder={['开始时间', '结束时间']}
                value={filters.timeRange}
                onChange={(dates) => setFilters({ ...filters, timeRange: dates || undefined })}
              />
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => setPage(1)}
              >
                搜索
              </Button>
              <Button
                icon={<SyncOutlined />}
                onClick={loadEvents}
              >
                刷新
              </Button>
            </Space>
          </div>

          {/* 事件列表 */}
          <Table
            columns={columns}
            dataSource={events}
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
            locale={{ emptyText: '暂无轨迹异常事件' }}
          />
        </Card>

        {/* 事件详情抽屉 */}
        <Drawer
          title="轨迹异常详情"
          placement="right"
          onClose={() => setDetailDrawerVisible(false)}
          open={detailDrawerVisible}
          width={600}
        >
          {selectedEvent && (
            <div>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="事件ID">
                  {selectedEvent.id}
                </Descriptions.Item>
                <Descriptions.Item label="事件类型">
                  <Tag color={getEventTypeColor(selectedEvent.eventType)}>
                    {getEventTypeText(selectedEvent.eventType)}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="活动">
                  {selectedEvent.activity?.title || '未知活动'}
                </Descriptions.Item>
                <Descriptions.Item label="用户">
                  {selectedEvent.user?.realName || selectedEvent.user?.username || '未知用户'}
                </Descriptions.Item>
                <Descriptions.Item label="触发时间">
                  {dayjs(selectedEvent.triggeredAt).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={getStatusColor(selectedEvent.status)}>
                    {getStatusText(selectedEvent.status)}
                  </Tag>
                </Descriptions.Item>
                {selectedEvent.description && (
                  <Descriptions.Item label="事件描述">
                    {selectedEvent.description}
                  </Descriptions.Item>
                )}
              </Descriptions>

              {selectedEvent.status === 'open' && (
                <Alert
                  message="未处理的轨迹异常"
                  description="此轨迹异常事件尚未处理，请及时处理以保障参与者安全。"
                  type="warning"
                  showIcon
                  style={{ marginTop: 16 }}
                />
              )}
            </div>
          )}
        </Drawer>

        {/* 处理事件弹窗 */}
        <Modal
          title="处理轨迹异常"
          open={resolveModalVisible}
          onCancel={() => {
            setResolveModalVisible(false)
            setSelectedEvent(null)
            resolveForm.resetFields()
          }}
          footer={null}
          width={600}
        >
          <Form
            form={resolveForm}
            layout="vertical"
            onFinish={handleSubmitResolve}
          >
            <Form.Item name="id" hidden>
              <Input />
            </Form.Item>
            
            <Form.Item
              name="status"
              label="处理状态"
              rules={[{ required: true, message: '请选择处理状态' }]}
              initialValue="resolved"
            >
              <Select disabled>
                <Option value="resolved">已处理</Option>
              </Select>
            </Form.Item>
            
            <Form.Item
              name="description"
              label="处理说明"
              rules={[{ required: true, message: '请输入处理说明' }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="请描述处理措施和结果"
              />
            </Form.Item>
            
            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => {
                  setResolveModalVisible(false)
                  setSelectedEvent(null)
                  resolveForm.resetFields()
                }}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit">
                  提交处理
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default TrajectoryMonitor
