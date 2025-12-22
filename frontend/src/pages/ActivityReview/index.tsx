import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Tag,
  Form,
  Input,
  Select,
  Modal,
  message,
  Space,
  Row,
  Col,
  Statistic,
} from 'antd'
import {
  CheckOutlined,
  CloseOutlined,
  EyeOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
} from '@ant-design/icons'
import { getActivities, changeActivityStatus } from '@/api/activity'
import { useAuthStore } from '@/store/useAuthStore'
import type { Activity, PageResponse } from '@/types'
import dayjs from 'dayjs'
import './index.less'

const { Option } = Select

function ActivityReview() {
  const { user, hasRole } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [size] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [status, setStatus] = useState<string>('pending')
  const [reviewModalVisible, setReviewModalVisible] = useState(false)
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null)
  const [action, setAction] = useState<'approve' | 'reject'>('approve')
  const [reason, setReason] = useState('')

  // 检查管理员权限
  if (!hasRole('admin')) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div>您没有权限访问此页面</div>
      </div>
    )
  }

  // 加载活动列表
  const loadActivities = async () => {
    setLoading(true)
    try {
      const res: PageResponse<Activity> = await getActivities({
        page,
        size,
        keyword,
        status,
      })
      setActivities(res.records || [])
      setTotal(res.total || 0)
    } catch (error) {
      console.error('加载活动列表失败:', error)
      message.error('加载活动列表失败')
      setActivities([])
      setTotal(0)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [page, keyword, status])

  // 查看活动详情
  const handleViewDetail = (activity: Activity) => {
    // 这里可以跳转到活动详情页或打开详情弹窗
    message.info(`查看活动: ${activity.title}`)
  }

  // 打开审核弹窗
  const handleReview = (activity: Activity, actionType: 'approve' | 'reject') => {
    setSelectedActivity(activity)
    setAction(actionType)
    setReason('')
    setReviewModalVisible(true)
  }

  // 提交审核
  const handleSubmitReview = async () => {
    if (!selectedActivity) return

    try {
      const newStatus = action === 'approve' ? 'approved' : 'rejected'
      await changeActivityStatus(selectedActivity.id, newStatus)
      
      message.success(`活动已${action === 'approve' ? '通过审核' : '拒绝审核'}`)
      setReviewModalVisible(false)
      setSelectedActivity(null)
      loadActivities() // 刷新列表
    } catch (error) {
      console.error('审核失败:', error)
      message.error('审核失败，请重试')
    }
  }

  // 获取状态标签颜色
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'default',
      pending: 'processing',
      approved: 'success',
      rejected: 'error',
      closed: 'default',
    }
    return colors[status] || 'default'
  }

  // 获取状态文本
  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      draft: '草稿',
      pending: '待审核',
      approved: '已批准',
      rejected: '已拒绝',
      closed: '已关闭',
    }
    return texts[status] || status
  }

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '活动名称',
      dataIndex: 'title',
      key: 'title',
      ellipsis: true,
    },
    {
      title: '组织者',
      dataIndex: 'organizerName',
      key: 'organizerName',
      render: (_, record: Activity) => record.organizerName || '未知',
    },
    {
      title: '活动时间',
      dataIndex: 'startTime',
      key: 'startTime',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '活动地点',
      dataIndex: 'location',
      key: 'location',
      ellipsis: true,
    },
    {
      title: '人数限制',
      key: 'participants',
      render: (_, record: Activity) => (
        <span>{record.currentParticipants || 0}/{record.capacity}</span>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Activity) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
          >
            查看
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckOutlined />}
                onClick={() => handleReview(record, 'approve')}
              >
                通过
              </Button>
              <Button
                type="link"
                size="small"
                danger
                icon={<CloseOutlined />}
                onClick={() => handleReview(record, 'reject')}
              >
                拒绝
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="activity-review-page">
      <div className="container">
        {/* 页面标题和统计 */}
        <div className="page-header">
          <h1>活动审核</h1>
          <Row gutter={16} style={{ marginTop: 16 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="待审核活动"
                  value={activities.filter(a => a.status === 'pending').length}
                  prefix={<CalendarOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已批准活动"
                  value={activities.filter(a => a.status === 'approved').length}
                  prefix={<CheckOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已拒绝活动"
                  value={activities.filter(a => a.status === 'rejected').length}
                  prefix={<CloseOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="总活动数"
                  value={total}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
          </Row>
        </div>

        {/* 搜索和筛选 */}
        <Card style={{ marginBottom: 16 }}>
          <Form layout="inline">
            <Form.Item label="活动名称">
              <Input
                placeholder="请输入活动名称"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                allowClear
              />
            </Form.Item>
            <Form.Item label="状态">
              <Select
                value={status}
                onChange={setStatus}
                style={{ width: 120 }}
              >
                <Option value="pending">待审核</Option>
                <Option value="approved">已批准</Option>
                <Option value="rejected">已拒绝</Option>
                <Option value="">全部</Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={loadActivities}>
                搜索
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* 活动列表表格 */}
        <Card>
          <Table
            columns={columns}
            dataSource={activities}
            rowKey="id"
            loading={loading}
            pagination={{
              current: page,
              pageSize: size,
              total: total,
              onChange: setPage,
              showSizeChanger: false,
              showQuickJumper: true,
              showTotal: (total) => `共 ${total} 条记录`,
            }}
            scroll={{ x: 1000 }}
          />
        </Card>
      </div>

      {/* 审核弹窗 */}
      <Modal
        title={`活动审核 - ${selectedActivity?.title}`}
        open={reviewModalVisible}
        onCancel={() => setReviewModalVisible(false)}
        onOk={handleSubmitReview}
        okText={action === 'approve' ? '通过' : '拒绝'}
        cancelText="取消"
        okType={action === 'approve' ? 'primary' : 'danger'}
      >
        <div>
          <p>您确定要{action === 'approve' ? '通过' : '拒绝'}此活动吗？</p>
          {action === 'reject' && (
            <Form.Item label="拒绝原因">
              <Input.TextArea
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="请输入拒绝原因"
              />
            </Form.Item>
          )}
        </div>
      </Modal>
    </div>
  )
}

export default ActivityReview
