import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Form,
  Input,
  Button,
  Rate,
  Typography,
  Row,
  Col,
  List,
  Avatar,
  Divider,
  Tag,
  message,
  Empty,
} from 'antd'
import {
  StarOutlined,
  UserOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons'
import { submitFeedback, getFeedbackList, getFeedbackStats } from '@/api/activity'
import { useAuthStore } from '@/store/useAuthStore'
import type { ActivityFeedback } from '@/types'
import dayjs from 'dayjs'
import './index.less'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

function Feedback() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [activity, setActivity] = useState<any>(null)
  const [feedbacks, setFeedbacks] = useState<ActivityFeedback[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [form] = Form.useForm()

  // 加载活动数据和反馈
  useEffect(() => {
    const loadData = async () => {
      if (!id) return

      setLoading(true)
      try {
        // 这里应该先获取活动详情
        // const activityData = await getActivityById(Number(id))
        // setActivity(activityData)
        
        // 加载反馈列表
        const feedbacksData = await getFeedbackList(Number(id), 1, 10)
        setFeedbacks(feedbacksData || [])

        // 加载反馈统计
        const statsData = await getFeedbackStats(Number(id))
        setStats(statsData)

        // 检查当前用户是否已经提交过反馈
        if (user && feedbacksData) {
          const userFeedback = feedbacksData.find(item => item.userId === user.id)
          setHasSubmitted(!!userFeedback)
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        message.error('加载数据失败')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, user])

  // 提交反馈
  const handleSubmit = async (values: any) => {
    if (!isAuthenticated()) {
      message.error('请先登录')
      navigate('/login')
      return
    }

    setSubmitting(true)
    try {
      const data = {
        activityId: Number(id),
        rating: values.rating,
        comment: values.comment,
        tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()) : [],
      }

      await submitFeedback(data)
      message.success('反馈提交成功')
      setHasSubmitted(true)
      form.resetFields()
      
      // 刷新反馈列表
      const feedbacksData = await getFeedbackList(Number(id), 1, 10)
      setFeedbacks(feedbacksData || [])
    } catch (error) {
      console.error('提交反馈失败:', error)
      message.error('提交反馈失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <div>加载中...</div>
      </div>
    )
  }

  return (
    <div className="feedback-page">
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Card
              title="活动反馈"
              extra={
                <Button
                  icon={<ArrowLeftOutlined />}
                  onClick={() => navigate(`/activities/${id}`)}
                >
                  返回活动
                </Button>
              }
            >
              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                disabled={hasSubmitted}
              >
                <Form.Item
                  name="rating"
                  label="评分"
                  rules={[{ required: true, message: '请选择评分' }]}
                >
                  <Rate
                    disabled={hasSubmitted}
                    tooltips={['很差', '较差', '一般', '良好', '很好', '非常棒']}
                  />
                </Form.Item>

                <Form.Item
                  name="comment"
                  label="评价"
                  rules={[{ required: true, message: '请输入评价内容' }]}
                >
                  <TextArea
                    disabled={hasSubmitted}
                    rows={4}
                    placeholder="请分享您的活动体验..."
                    showCount
                    maxLength={500}
                  />
                </Form.Item>

                <Form.Item
                  name="tags"
                  label="标签"
                >
                  <Input
                    disabled={hasSubmitted}
                    placeholder="请输入标签，用逗号分隔"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={submitting}
                    disabled={hasSubmitted}
                  >
                    {hasSubmitted ? '已提交反馈' : '提交反馈'}
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="反馈统计" variant="outlined">
              {stats ? (
                <div className="feedback-stats">
                  <div className="stat-item">
                    <div className="stat-value">{stats.averageRating || 0}</div>
                    <div className="stat-label">平均评分</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-value">{stats.feedbackCount || 0}</div>
                    <div className="stat-label">总评价数</div>
                  </div>
                </div>
              ) : (
                <Empty description="暂无统计数据" />
              )}
            </Card>

            <Card title="最新反馈" variant="outlined" style={{ marginTop: 16 }}>
              {feedbacks.length > 0 ? (
                <List
                  dataSource={feedbacks.slice(0, 5)}
                  renderItem={(feedback: ActivityFeedback) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar icon={<UserOutlined />} />}
                        title={
                          <div>
                            <Rate disabled value={feedback.rating} style={{ fontSize: 14 }} />
                            <span style={{ marginLeft: 8 }}>
                              {dayjs(feedback.createdAt).format('YYYY-MM-DD HH:mm')}
                            </span>
                          </div>
                        }
                        description={
                          <div>
                            {feedback.comment}
                            {feedback.tags && (
                              <div style={{ marginTop: 8 }}>
                                {feedback.tags.split(',').map((tag: string, index: number) => (
                                  <Tag key={index} style={{ marginRight: 4 }}>
                                    {tag.trim()}
                                  </Tag>
                                ))}
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <Empty description="暂无反馈" />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Feedback

