import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  message,
  Drawer,
  Descriptions,
  Typography,
  Tooltip,
} from 'antd'
import {
  SearchOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  UserOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { getRegistrations, reviewRegistration } from '@/api/registration'
import { getActivityById } from '@/api/activity'
import { useAuthStore } from '@/store/useAuthStore'
import type { Registration } from '@/types'
import type { PageResponse } from '@/types'
import dayjs from 'dayjs'
import './index.less'

const { Option } = Select
const { Title, Text } = Typography

interface RegistrationWithDetails extends Registration {
  user?: {
    id: number
    username: string
    realName?: string
    email?: string
    phone?: string
  }
  activity?: {
    id: number
    title: string
    startTime: string
    endTime: string
    location: string
  }
}

function RegistrationManagement() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [registrations, setRegistrations] = useState<RegistrationWithDetails[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [size] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<string | undefined>()
  const [activityId, setActivityId] = useState<number | undefined>()
  const [activities, setActivities] = useState<any[]>([])
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
  const [reviewModalVisible, setReviewModalVisible] = useState(false)
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationWithDetails | null>(null)
  const [reviewForm] = Form.useForm()

  // 检查权限
  if (user?.role !== 'organizer' && user?.role !== 'admin') {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div>您没有权限访问此页面</div>
      </div>
    )
  }

  // 加载报名列表
  const loadRegistrations = async () => {
    setLoading(true)
    try {
      const params: any = { page, size }
      if (keyword) params.keyword = keyword
      if (status) params.status = status
      if (activityId) params.activityId = activityId

      const response: PageResponse<Registration> = await getRegistrations(params)
      
      // 为每个报名获取活动和用户信息
      const registrationsWithDetails = await Promise.all(
        response.records.map(async (registration) => {
          const enhancedRegistration = { ...registration } as RegistrationWithDetails
          
          // 获取活动信息
          try {
            const activity = await getActivityById(registration.activityId)
            enhancedRegistration.activity = activity
            
            // 如果活动列表中没有，添加到列表
            if (!activities.find(a => a.id === activity.id)) {
              setActivities(prev => [...prev, activity])
            }
          } catch (error) {
            console.error(`获取活动 ${registration.activityId} 信息失败:`, error)
            enhancedRegistration.activity = { 
              id: registration.activityId, 
              title: '未知活动' 
            }
          }
          
          // 这里模拟获取用户信息，实际项目中可能需要从API获取
          enhancedRegistration.user = {
            id: registration.userId,
            username: `用户${registration.userId}`,
            realName: '用户名称',
          }
          
          return enhancedRegistration
        })
      )

      setRegistrations(registrationsWithDetails)
      setTotal(response.total)
    } catch (error) {
      console.error('加载报名列表失败:', error)
      message.error('加载报名列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRegistrations()
  }, [page, keyword, status, activityId])

  // 查看报名详情
  const handleViewDetail = (registration: RegistrationWithDetails) => {
    setSelectedRegistration(registration)
    setDetailDrawerVisible(true)
  }

  // 审核报名
  const handleReview = (registration: RegistrationWithDetails) => {
    setSelectedRegistration(registration)
    reviewForm.setFieldsValue({
      id: registration.id,
      status: 'approved',
      notes: '',
    })
    setReviewModalVisible(true)
  }

  // 提交审核
  const handleSubmitReview = async (values: any) => {
    try {
      await reviewRegistration({
        id: values.id,
        status: values.status,
        notes: values.notes,
      })
      
      message.success(`报名已${values.status === 'approved' ? '通过' : values.status === 'rejected' ? '拒绝' : '设为候补'}`)
      setReviewModalVisible(false)
      setSelectedRegistration(null)
      reviewForm.resetFields()
      loadRegistrations()
    } catch (error) {
      console.error('审核报名失败:', error)
      message.error('审核报名失败')
    }
  }

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'processing',
      approved: 'success',
      rejected: 'error',
      waiting: 'warning',
      cancelled: 'default',
    }
    return colors[status] || 'default'
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: '待审核',
      approved: '已批准',
      rejected: '已拒绝',
      waiting: '候补',
      cancelled: '已取消',
    }
    return texts[status] || status
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
      title: '用户',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => (
        <Space>
          <UserOutlined />
          <div>
            <div>{user?.realName || user?.username}</div>
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
            <ClockCircleOutlined style={{ marginRight: 4 }} />
            {activity?.startTime && dayjs(activity.startTime).format('MM-DD HH:mm')}
            {activity?.endTime && ` ~ ${dayjs(activity.endTime).format('MM-DD HH:mm')}`}
          </div>
          <div style={{ fontSize: 12, color: '#999' }}>
            {activity?.location}
          </div>
        </div>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
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
      render: (record: RegistrationWithDetails) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          
          {record.status === 'pending' && (user?.role === 'organizer' || user?.role === 'admin') && (
            <Tooltip title="审核报名">
              <Button
                type="link"
                icon={<CheckCircleOutlined />}
                onClick={() => handleReview(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="registration-management-page">
      <div className="container">
        <Card title="报名管理">
          {/* 筛选区域 */}
          <div className="filter-section">
            <Space wrap>
              <Input.Search
                placeholder="搜索用户名、活动名称"
                allowClear
                style={{ width: 200 }}
                prefix={<SearchOutlined />}
                onSearch={setKeyword}
                enterButton
              />
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
                placeholder="状态筛选"
                allowClear
                style={{ width: 150 }}
                onChange={setStatus}
              >
                <Option value="pending">待审核</Option>
                <Option value="approved">已批准</Option>
                <Option value="rejected">已拒绝</Option>
                <Option value="waiting">候补</Option>
                <Option value="cancelled">已取消</Option>
              </Select>
            </Space>
          </div>

          {/* 报名列表 */}
          <Table
            columns={columns}
            dataSource={registrations}
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
            locale={{ emptyText: '暂无报名数据' }}
          />
        </Card>

        {/* 报名详情抽屉 */}
        <Drawer
          title="报名详情"
          placement="right"
          onClose={() => setDetailDrawerVisible(false)}
          open={detailDrawerVisible}
          width={600}
        >
          {selectedRegistration && (
            <div>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="报名ID">
                  {selectedRegistration.id}
                </Descriptions.Item>
                <Descriptions.Item label="用户">
                  {selectedRegistration.user?.realName || selectedRegistration.user?.username}
                </Descriptions.Item>
                <Descriptions.Item label="活动">
                  {selectedRegistration.activity?.title}
                </Descriptions.Item>
                <Descriptions.Item label="申请时间">
                  {dayjs(selectedRegistration.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="状态">
                  <Tag color={getStatusColor(selectedRegistration.status)}>
                    {getStatusText(selectedRegistration.status)}
                  </Tag>
                </Descriptions.Item>
                {selectedRegistration.qualificationInfo && (
                  <Descriptions.Item label="资格信息">
                    <pre>{JSON.stringify(selectedRegistration.qualificationInfo, null, 2)}</pre>
                  </Descriptions.Item>
                )}
                {selectedRegistration.reviewNote && (
                  <Descriptions.Item label="审核备注">
                    {selectedRegistration.reviewNote}
                  </Descriptions.Item>
                )}
              </Descriptions>
            </div>
          )}
        </Drawer>

        {/* 审核弹窗 */}
        <Modal
          title="审核报名申请"
          open={reviewModalVisible}
          onCancel={() => {
            setReviewModalVisible(false)
            setSelectedRegistration(null)
            reviewForm.resetFields()
          }}
          footer={null}
          width={600}
        >
          {selectedRegistration && (
            <div>
              <Descriptions column={1} style={{ marginBottom: 16 }}>
                <Descriptions.Item label="申请人">
                  {selectedRegistration.user?.realName || selectedRegistration.user?.username}
                </Descriptions.Item>
                <Descriptions.Item label="活动">
                  {selectedRegistration.activity?.title}
                </Descriptions.Item>
                <Descriptions.Item label="申请时间">
                  {dayjs(selectedRegistration.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
              </Descriptions>
              
              <Form
                form={reviewForm}
                layout="vertical"
                onFinish={handleSubmitReview}
              >
                <Form.Item name="id" hidden>
                  <Input />
                </Form.Item>
                
                <Form.Item
                  name="status"
                  label="审核结果"
                  rules={[{ required: true, message: '请选择审核结果' }]}
                >
                  <Select>
                    <Option value="approved">
                      <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a' }} />
                        通过
                      </Space>
                    </Option>
                    <Option value="rejected">
                      <Space>
                        <CloseCircleOutlined style={{ color: '#f5222d' }} />
                        拒绝
                      </Space>
                    </Option>
                    <Option value="waiting">
                      <Space>
                        <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                        候补
                      </Space>
                    </Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="notes"
                  label="审核备注"
                  rules={[{ required: true, message: '请输入审核备注' }]}
                >
                  <Input.TextArea rows={4} placeholder="请输入审核备注" />
                </Form.Item>
                
                <Form.Item style={{ textAlign: 'right' }}>
                  <Space>
                    <Button onClick={() => {
                      setReviewModalVisible(false)
                      setSelectedRegistration(null)
                      reviewForm.resetFields()
                    }}>
                      取消
                    </Button>
                    <Button type="primary" htmlType="submit">
                      提交审核
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default RegistrationManagement
