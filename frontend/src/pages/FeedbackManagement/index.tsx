import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Rate,
  Modal,
  message,
  Drawer,
  Descriptions,
  Typography,
  Tooltip,
  Row,
  Col,
  Statistic,
} from 'antd'
import {
  SearchOutlined,
  EyeOutlined,
  DeleteOutlined,
  StarOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { getFeedbackList, deleteFeedback } from '@/api/activity'
import { getActivityById } from '@/api/activity'
import { useAuthStore } from '@/store/useAuthStore'
import type { ActivityFeedback } from '@/types'
import type { PageResponse } from '@/types'
import dayjs from 'dayjs'
import './index.less'

const { Option } = Select
const { Title, Text } = Typography

interface FeedbackWithDetails extends ActivityFeedback {
  user?: {
    id: number
    username: string
    realName?: string
  }
  activity?: {
    id: number
    title: string
    startTime: string
    endTime: string
    location: string
  }
  statistics?: {
    averageRating: number
    feedbackCount: number
  }
}

function FeedbackManagement() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [feedbacks, setFeedbacks] = useState<FeedbackWithDetails[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [size] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [activityId, setActivityId] = useState<number | undefined>()
  const [rating, setRating] = useState<number | undefined>()
  const [activities, setActivities] = useState<any[]>([])
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackWithDetails | null>(null)
  const [statistics, setStatistics] = useState<any>(null)

  // 检查权限
  if (user?.role !== 'organizer' && user?.role !== 'admin') {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div>您没有权限访问此页面</div>
      </div>
    )
  }

  // 加载反馈列表
  const loadFeedbacks = async () => {
    setLoading(true)
    try {
      const params: any = { page, size }
      if (keyword) params.keyword = keyword
      if (rating) params.rating = rating
      if (activityId) params.activityId = activityId

      const response: PageResponse<ActivityFeedback> = await getFeedbackList({
        page,
        size,
        activityId,
      })
      
      // 为每个反馈获取活动和用户信息
      const feedbacksWithDetails = await Promise.all(
        response.records.map(async (feedback) => {
          const enhancedFeedback = { ...feedback } as FeedbackWithDetails
          
          // 获取活动信息
          try {
            const activity = await getActivityById(feedback.activityId)
            enhancedFeedback.activity = activity
            
            // 如果活动列表中没有，添加到列表
            if (!activities.find(a => a.id === activity.id)) {
              setActivities(prev => [...prev, activity])
            }
          } catch (error) {
            console.error(`获取活动 ${feedback.activityId} 信息失败:`, error)
            enhancedFeedback.activity = { 
              id: feedback.activityId, 
              title: '未知活动' 
            }
          }
          
          // 这里模拟获取用户信息，实际项目中可能需要从API获取
          enhancedFeedback.user = {
            id: feedback.userId,
            username: `用户${feedback.userId}`,
            realName: '用户名称',
          }
          
          return enhancedFeedback
        })
      )

      setFeedbacks(feedbacksWithDetails)
      setTotal(response.total)
    } catch (error) {
      console.error('加载反馈列表失败:', error)
      message.error('加载反馈列表失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载活动统计
  const loadStatistics = async () => {
    if (!activityId) return
    
    try {
      const response = await fetch(`/api/feedbacks/activity/${activityId}/statistics`)
      if (response.ok) {
        const data = await response.json()
        if (data.code === 200) {
          setStatistics(data.data)
        }
      }
    } catch (error) {
      console.error('加载统计数据失败:', error)
    }
  }

  useEffect(() => {
    loadFeedbacks()
    if (activityId) {
      loadStatistics()
    }
  }, [page, keyword, rating, activityId])

  // 查看反馈详情
  const handleViewDetail = (feedback: FeedbackWithDetails) => {
    setSelectedFeedback(feedback)
    setDetailDrawerVisible(true)
  }

  // 删除反馈
  const handleDelete = (feedback: FeedbackWithDetails) => {
    setSelectedFeedback(feedback)
    setDeleteModalVisible(true)
  }

  // 确认删除
  const confirmDelete = async () => {
    if (!selectedFeedback) return
    
    try {
      await deleteFeedback(selectedFeedback.id)
      message.success('反馈已删除')
      setDeleteModalVisible(false)
      setSelectedFeedback(null)
      loadFeedbacks()
    } catch (error) {
      console.error('删除反馈失败:', error)
      message.error('删除反馈失败')
    }
  }

  // 获取标签颜色
  const getTagColor = (tags: string) => {
    if (!tags) return 'default'
    
    const tagArray = tags.split(',')
    const colors: Record<string, string> = {
      '活动组织': 'blue',
      '路线规划': 'green',
      '安全保障': 'orange',
      '天气因素': 'cyan',
      '服务态度': 'purple',
    }
    
    // 返回第一个标签的颜色
    const firstTag = tagArray[0]?.trim()
    return colors[firstTag] || 'default'
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
          <div style={{ width: 32, height: 32, borderRadius: '50%', backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {user?.realName?.charAt(0) || user?.username?.charAt(0) || 'U'}
          </div>
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
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 150,
      render: (rating: number, record: FeedbackWithDetails) => (
        <div>
          <Rate disabled defaultValue={rating} style={{ fontSize: 14 }} />
          {record.createdAt && (
            <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>
              {dayjs(record.createdAt).format('YYYY-MM-DD')}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: string) => {
        if (!tags) return '-'
        
        return (
          <Space wrap>
            {tags.split(',').map((tag, index) => (
              <Tag key={index} color={getTagColor(tag)}>
                {tag.trim()}
              </Tag>
            ))}
          </Space>
        )
      },
    },
    {
      title: '反馈时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 150,
      render: (date: string) => dayjs(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (record: FeedbackWithDetails) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
            />
          </Tooltip>
          
          {(user?.role === 'organizer' || user?.role === 'admin') && (
            <Tooltip title="删除反馈">
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => handleDelete(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="feedback-management-page">
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={activityId ? 16 : 24}>
            <Card title="反馈管理">
              {/* 筛选区域 */}
              <div className="filter-section">
                <Space wrap>
                  <Input.Search
                    placeholder="搜索反馈内容"
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
                    placeholder="评分筛选"
                    allowClear
                    style={{ width: 120 }}
                    onChange={setRating}
                  >
                    <Option value={5}>5星</Option>
                    <Option value={4}>4星</Option>
                    <Option value={3}>3星</Option>
                    <Option value={2}>2星</Option>
                    <Option value={1}>1星</Option>
                  </Select>
                </Space>
              </div>

              {/* 反馈列表 */}
              <Table
                columns={columns}
                dataSource={feedbacks}
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
                locale={{ emptyText: '暂无反馈数据' }}
              />
            </Card>
          </Col>

          {activityId && statistics && (
            <Col xs={24} lg={8}>
              {/* 统计数据 */}
              <Card title="反馈统计" style={{ marginBottom: 16 }}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Statistic
                      title="平均评分"
                      value={statistics.averageRating || 0}
                      precision={1}
                      suffix={<StarOutlined style={{ color: '#faad14' }} />}
                    />
                  </Col>
                </Row>
                <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                  <Col span={12}>
                    <Statistic
                      title="反馈总数"
                      value={statistics.feedbackCount || 0}
                      prefix={<ExclamationCircleOutlined />}
                    />
                  </Col>
                  <Col span={12}>
                    <Statistic
                      title="反馈率"
                      value={statistics.feedbackCount && statistics.totalParticipants 
                        ? Math.round((statistics.feedbackCount / statistics.totalParticipants) * 100)
                        : 0}
                      suffix="%"
                    />
                  </Col>
                </Row>
              </Card>
            </Col>
          )}
        </Row>

        {/* 反馈详情抽屉 */}
        <Drawer
          title="反馈详情"
          placement="right"
          onClose={() => setDetailDrawerVisible(false)}
          open={detailDrawerVisible}
          width={600}
        >
          {selectedFeedback && (
            <div>
              <Descriptions column={1} bordered>
                <Descriptions.Item label="反馈ID">
                  {selectedFeedback.id}
                </Descriptions.Item>
                <Descriptions.Item label="用户">
                  {selectedFeedback.user?.realName || selectedFeedback.user?.username}
                </Descriptions.Item>
                <Descriptions.Item label="活动">
                  {selectedFeedback.activity?.title}
                </Descriptions.Item>
                <Descriptions.Item label="评分">
                  <Rate disabled defaultValue={selectedFeedback.rating} style={{ fontSize: 16 }} />
                </Descriptions.Item>
                <Descriptions.Item label="标签">
                  <Space wrap>
                    {selectedFeedback.tags?.split(',').map((tag, index) => (
                      <Tag key={index} color={getTagColor(tag)}>
                        {tag.trim()}
                      </Tag>
                    ))}
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="反馈时间">
                  {dayjs(selectedFeedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                </Descriptions.Item>
                <Descriptions.Item label="评论内容" span={2}>
                  <div style={{ maxHeight: 200, overflow: 'auto' }}>
                    {selectedFeedback.comment || '无评论'}
                  </div>
                </Descriptions.Item>
              </Descriptions>
            </div>
          )}
        </Drawer>

        {/* 删除确认弹窗 */}
        <Modal
          title="确认删除"
          open={deleteModalVisible}
          onCancel={() => {
            setDeleteModalVisible(false)
            setSelectedFeedback(null)
          }}
          footer={
            <Space>
              <Button onClick={() => {
                setDeleteModalVisible(false)
                setSelectedFeedback(null)
              }}>
                取消
              </Button>
              <Button type="primary" danger onClick={confirmDelete}>
                确定
              </Button>
            </Space>
          }
        >
          <p>确定要删除这条反馈吗？此操作不可恢复。</p>
        </Modal>
      </div>
    </div>
  )
}

export default FeedbackManagement
