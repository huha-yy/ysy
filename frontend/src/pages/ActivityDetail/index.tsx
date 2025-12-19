import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Descriptions,
  Divider,
  Avatar,
  Typography,
  Space,
  Statistic,
  message,
  Modal,
  Form,
  Input,
  Rate,
  Spin,
  Empty,
} from 'antd'
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  UserOutlined,
  CalendarOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  StarOutlined,
  PlusOutlined,
  EditOutlined,
} from '@ant-design/icons'
import { getActivityById, getActivityRoutes, registerActivity, getRegistrationStatus } from '@/api/activity'
import { useAuthStore } from '@/store/useAuthStore'
import type { Activity, Route, Registration } from '@/types'
import dayjs from 'dayjs'
import './index.less'

const { Title, Paragraph, Text } = Typography

function ActivityDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [routes, setRoutes] = useState<Route[]>([])
  const [registration, setRegistration] = useState<Registration | null>(null)
  const [loading, setLoading] = useState(true)
  const [registerModalVisible, setRegisterModalVisible] = useState(false)
  const [registerForm] = Form.useForm()

  // 加载活动详情
  const loadActivityDetail = async () => {
    if (!id) return

    setLoading(true)
    try {
      // 加载活动信息
      const activityData = await getActivityById(Number(id))
      setActivity(activityData)

      // 加载路线信息
      const routesData = await getActivityRoutes(Number(id))
      setRoutes(routesData)

      // 如果已登录，检查报名状态
      if (isAuthenticated()) {
        try {
          const registrationData = await getRegistrationStatus(Number(id))
          setRegistration(registrationData)
        } catch (error) {
          // 未报名或出错
          setRegistration(null)
        }
      }
    } catch (error) {
      console.error('加载活动详情失败:', error)
      message.error('加载活动详情失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivityDetail()
  }, [id])

  // 提交报名
  const handleRegister = async (values: any) => {
    if (!activity || !user) return

    try {
      const data = {
        qualificationInfo: {
          experience: values.experience,
          health: values.health,
          emergencyContact: values.emergencyContact,
        },
      }
      
      await registerActivity(activity.id, data)
      message.success('报名成功，请等待审核')
      setRegisterModalVisible(false)
      loadActivityDetail() // 重新加载数据
    } catch (error) {
      message.error('报名失败，请重试')
    }
  }

  // 获取难度标签颜色
  const getDifficultyColor = (level?: string) => {
    const colors: Record<string, string> = {
      '简单': 'green',
      '中等': 'orange',
      '困难': 'red',
      '专家': 'purple',
      'easy': 'green',
      'medium': 'orange',
      'hard': 'red',
      'expert': 'purple',
    }
    return colors[level || ''] || 'default'
  }

  // 获取难度文本
  const getDifficultyText = (level?: string) => {
    const texts: Record<string, string> = {
      'easy': '入门',
      'medium': '中级',
      'hard': '高级',
      'expert': '专家',
      '简单': '入门',
      '中等': '中级',
      '困难': '高级',
      '专家': '专家',
    }
    return texts[level || ''] || level
  }

  // 获取状态文本
  const getStatusText = (status?: string) => {
    const texts: Record<string, string> = {
      draft: '草稿',
      pending: '待审核',
      approved: '已批准',
      closed: '已关闭',
      rejected: '已拒绝',
    }
    return texts[status || ''] || status
  }

  // 获取状态颜色
  const getStatusColor = (status?: string) => {
    const colors: Record<string, string> = {
      draft: 'default',
      pending: 'processing',
      approved: 'success',
      closed: 'default',
      rejected: 'error',
    }
    return colors[status || ''] || 'default'
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!activity) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <Empty description="活动不存在" />
      </div>
    )
  }

  // 报名按钮状态
  const getRegisterButton = () => {
    if (!isAuthenticated()) {
      return (
        <Button type="primary" size="large" onClick={() => navigate('/login')}>
          登录后报名
        </Button>
      )
    }

    if (registration) {
      let statusText = ''
      let buttonType: any = 'default'
      let disabled = true

      switch (registration.status) {
        case 'pending':
          statusText = '审核中'
          buttonType = 'processing'
          break
        case 'approved':
          statusText = '已报名'
          buttonType = 'success'
          break
        case 'rejected':
          statusText = '报名被拒'
          buttonType = 'danger'
          break
        case 'waiting':
          statusText = '候补中'
          buttonType = 'warning'
          break
        case 'cancelled':
          statusText = '已取消'
          break
      }

      return <Button type={buttonType} size="large" disabled={disabled}>{statusText}</Button>
    }

    if (activity.status !== 'approved') {
      return <Button type="default" size="large" disabled>{getStatusText(activity.status)}</Button>
    }

    if ((activity.currentParticipants || 0) >= activity.capacity) {
      return <Button type="default" size="large" disabled>已满员</Button>
    }

    return (
      <Button 
        type="primary" 
        size="large" 
        onClick={() => setRegisterModalVisible(true)}
      >
        立即报名
      </Button>
    )
  }

  return (
    <div className="activity-detail-page">
      <div className="container">
        {/* 活动封面和基本信息 */}
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Card 
              cover={
                <div className="activity-cover">
                  <img 
                    src={activity.coverImage || 'https://via.placeholder.com/800x400'} 
                    alt={activity.title} 
                  />
                  <div className="activity-overlay">
                    <Tag 
                      color={getDifficultyColor(activity.difficulty)}
                      className="difficulty-tag"
                    >
                      {getDifficultyText(activity.difficulty)}
                    </Tag>
                    <Tag 
                      color={getStatusColor(activity.status)}
                      className="status-tag"
                    >
                      {getStatusText(activity.status)}
                    </Tag>
                  </div>
                </div>
              }
            >
              <div className="activity-info">
                <Title level={2}>{activity.title}</Title>
                <Paragraph>{activity.summary}</Paragraph>
                
                <Descriptions column={2} size="small" variant="bordered">
                  <Descriptions.Item 
                    label={<><EnvironmentOutlined /> 活动地点</>}
                    span={2}
                  >
                    {activity.location}
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<><CalendarOutlined /> 开始时间</>}
                  >
                    {dayjs(activity.startTime).format('YYYY-MM-DD HH:mm')}
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<><CalendarOutlined /> 结束时间</>}
                  >
                    {dayjs(activity.endTime).format('YYYY-MM-DD HH:mm')}
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<><DollarOutlined /> 活动费用</>}
                  >
                    {activity.feeInfo}
                  </Descriptions.Item>
                  <Descriptions.Item 
                    label={<><TeamOutlined /> 人数限制</>}
                  >
                    {activity.currentParticipants || 0}/{activity.capacity}
                  </Descriptions.Item>
                </Descriptions>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card title="报名信息" variant="outlined" className="register-card">
              <Space direction="vertical" style={{ width: '100%' }}>
                <Statistic 
                  title="已报名人数" 
                  value={activity.currentParticipants || 0} 
                  suffix={`/ ${activity.capacity}`}
                />
                <Button type="dashed" block disabled>
                  {(activity.currentParticipants || 0) >= activity.capacity ? '已满员' : '还剩' + (activity.capacity - (activity.currentParticipants || 0)) + '个名额'}
                </Button>
                <Divider />
                {getRegisterButton()}
              </Space>
            </Card>
            
            <Card title="组织者" variant="outlined" style={{ marginTop: 16 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar icon={<UserOutlined />} size="large" />
                  <div style={{ marginLeft: 12 }}>
                    <div>{activity.organizerName || '未知组织者'}</div>
                    <Text type="secondary">活动组织者</Text>
                  </div>
                </div>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* 活动要求和路线信息 */}
        <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
          <Col xs={24} md={12}>
            <Card title="活动要求" variant="outlined">
              {(() => {
                // 解析 requirementInfo
                const requirement = activity.requirementInfo
                if (!requirement) {
                  return <Text type="secondary">暂无特殊要求</Text>
                }
                
                // 如果是对象，解析并显示
                if (typeof requirement === 'object') {
                  return (
                    <Space direction="vertical" style={{ width: '100%' }}>
                      {requirement.experience && (
                        <div>
                          <Text strong>经验要求：</Text>
                          <Paragraph>{requirement.experience}</Paragraph>
                        </div>
                      )}
                      {requirement.health && (
                        <div>
                          <Text strong>健康要求：</Text>
                          <Paragraph>{requirement.health}</Paragraph>
                        </div>
                      )}
                      {requirement.gear && (
                        <div>
                          <Text strong>装备要求：</Text>
                          <Paragraph>
                            {Array.isArray(requirement.gear) 
                              ? requirement.gear.join('、') 
                              : requirement.gear}
                          </Paragraph>
                        </div>
                      )}
                    </Space>
                  )
                }
                
                // 如果是字符串，直接显示
                return <Paragraph>{requirement}</Paragraph>
              })()}
            </Card>
          </Col>
          <Col xs={24} md={12}>
            <Card 
              title="路线信息" 
              variant="outlined"
              extra={
                (user?.role === 'organizer' || user?.role === 'admin') && (
                  <Button 
                    type="primary" 
                    size="small" 
                    icon={<PlusOutlined />}
                    onClick={() => navigate(`/organizer/routes/create/${id}`)}
                  >
                    添加路线
                  </Button>
                )
              }
            >
              {routes.length > 0 ? (
                <Space direction="vertical" style={{ width: '100%' }}>
                  {routes.map(route => (
                    <div key={route.id} className="route-item" style={{ 
                      padding: '12px', 
                      border: '1px solid #f0f0f0', 
                      borderRadius: '6px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <div className="route-name" style={{ fontWeight: 600, marginBottom: '4px' }}>{route.name}</div>
                        <div className="route-details">
                          <span style={{ marginRight: '12px' }}>距离: {route.distance}km</span>
                          <span style={{ marginRight: '12px' }}>累计爬升: {route.elevationGain}m</span>
                          <span>难度: {route.difficultyLevel}</span>
                        </div>
                      </div>
                      {(user?.role === 'organizer' || user?.role === 'admin') && (
                        <Button 
                          type="link" 
                          icon={<EditOutlined />}
                          onClick={() => navigate(`/organizer/routes/edit/${route.id}`)}
                        >
                          编辑
                        </Button>
                      )}
                    </div>
                  ))}
                </Space>
              ) : (
                <Empty 
                  description="暂无路线信息" 
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                >
                  {(user?.role === 'organizer' || user?.role === 'admin') && (
                    <Button 
                      type="primary" 
                      icon={<PlusOutlined />}
                      onClick={() => navigate(`/organizer/routes/create/${id}`)}
                    >
                      创建路线
                    </Button>
                  )}
                </Empty>
              )}
            </Card>
          </Col>
        </Row>
      </div>

      {/* 报名弹窗 */}
      <Modal
        title="活动报名"
        open={registerModalVisible}
        onCancel={() => setRegisterModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={registerForm}
          layout="vertical"
          onFinish={handleRegister}
        >
          <Form.Item
            name="experience"
            label="徒步经验"
            rules={[{ required: true, message: '请填写您的徒步经验' }]}
          >
            <Input.TextArea rows={3} placeholder="请描述您的徒步经验，如参加过类似活动的次数和距离" />
          </Form.Item>
          
          <Form.Item
            name="health"
            label="健康状况"
            rules={[{ required: true, message: '请填写您的健康状况' }]}
          >
            <Input.TextArea rows={3} placeholder="请描述您的健康状况，确保能适应本次活动强度" />
          </Form.Item>
          
          <Form.Item
            name="emergencyContact"
            label="紧急联系人"
            rules={[{ required: true, message: '请填写紧急联系人' }]}
          >
            <Input placeholder="姓名 + 电话号码" />
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                提交报名
              </Button>
              <Button onClick={() => setRegisterModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ActivityDetail

