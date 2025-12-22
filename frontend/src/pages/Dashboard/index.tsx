import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Avatar,
  Typography,
  Button,
  Form,
  Input,
  Select,
  Tabs,
  List,
  Tag,
  Divider,
  Statistic,
  message,
  Empty,
} from 'antd'
import {
  UserOutlined,
  EditOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons'
import { updateUserProfile, getUserActivities, getUserCheckins, getCurrentUser } from '@/api/auth'
import { useAuthStore } from '@/store/useAuthStore'
import dayjs from 'dayjs'
import './index.less'

const { Title, Text } = Typography
const { TextArea } = Input

function Dashboard() {
  const { user, updateUser } = useAuthStore()
  const [profileForm] = Form.useForm()
  const [activities, setActivities] = useState<any[]>([])
  const [checkins, setCheckins] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('profile')

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      try {
        // 获取最新的用户信息
        const currentUserRes = await getCurrentUser()
        if ((currentUserRes as any).code === 200) {
          // 更新用户信息到store
          const updatedUser = (currentUserRes as any).data
          const { updateUser } = useAuthStore.getState()
          updateUser(updatedUser)
          
          // 获取用户参与的活动
          const activitiesData = await getUserActivities({ page: 1, size: 5 })
          setActivities(activitiesData?.records || [])

          // 获取用户签到记录
          const checkinsData = await getUserCheckins({ page: 1, size: 5 })
          setCheckins(checkinsData?.records || [])

          // 设置表单初始值
          profileForm.setFieldsValue({
            realName: updatedUser.realName || '',
            mobile: updatedUser.phone || '',
            email: updatedUser.email || '',
            experienceLevel: updatedUser.experienceLevel || '',
            healthStatus: updatedUser.healthStatus || '',
            emergencyContact: updatedUser.emergencyContact || '',
          })
        } else {
          console.error('获取用户信息失败:', (currentUserRes as any).message)
          // 使用当前store中的用户信息
          profileForm.setFieldsValue({
            realName: user.realName || '',
            mobile: user.phone || '',
            email: user.email || '',
            experienceLevel: user.experienceLevel || '',
            healthStatus: user.healthStatus || '',
            emergencyContact: user.emergencyContact || '',
          })
          
          // 设置空数组避免页面崩溃
          setActivities([])
          setCheckins([])
        }
      } catch (error) {
        console.error('加载数据失败:', error)
        // 不显示错误消息，因为API端点不存在是已知问题
        // 设置空数组避免页面崩溃
        setActivities([])
        setCheckins([])
      }
    }

    loadData()
  }, [user?.id]) // 只在用户ID变化时重新加载

  // 更新个人资料
  const handleProfileUpdate = async (values: any) => {
    try {
      await updateUserProfile(values)
      message.success('个人资料更新成功')
      
      // 更新本地用户信息
      updateUser(values)
    } catch (error) {
      console.error('更新个人资料失败:', error)
      message.error('更新个人资料失败，请重试')
    }
  }

  if (!user) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div>请先登录</div>
      </div>
    )
  }

  // 计算统计数据
  const stats = {
    totalActivities: activities.length,
    completedCheckins: checkins.filter(c => c.status === 'completed').length,
    upcomingActivities: activities.filter(a => 
      dayjs(a.endTime).isAfter(dayjs()) && a.status === 'approved'
    ).length,
  }

  // Tab items配置
  const tabItems = [
    {
      key: 'profile',
      label: (
        <span>
          <EditOutlined />
          个人资料
        </span>
      ),
      children: (
        <Form
          form={profileForm}
          layout="vertical"
          onFinish={handleProfileUpdate}
        >
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="realName"
                label="真实姓名"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="邮箱"
                rules={[{ type: 'email' }]}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Form.Item
                name="mobile"
                label="手机号"
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="experienceLevel"
                label="徒步经验等级"
                help="请选择您的徒步经验等级，这将帮助组织者了解您的能力"
              >
                <Select placeholder="请选择经验等级">
                  <Select.Option value="初级">初级</Select.Option>
                  <Select.Option value="中级">中级</Select.Option>
                  <Select.Option value="高级">高级</Select.Option>
                  <Select.Option value="专家">专家</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="healthStatus"
                label="健康状况"
                help="请描述您的身体状况，有助于组织者评估您的参与能力"
              >
                <TextArea rows={3} placeholder="例如：无慢性疾病，可进行中等强度徒步活动" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Form.Item
                name="emergencyContact"
                label="紧急联系人"
                help="在活动过程中发生紧急情况时，我们将联系此人"
                rules={[
                  {
                    pattern: /^(.+)(\s*[:：]\s*|\s*)([\d\-\s\(\)]{7,})$/,
                    message: '请按"姓名 电话号码"格式输入紧急联系人',
                  }
                ]}
              >
                <Input placeholder="例如：张三 13800138000" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item>
            <Button type="primary" htmlType="submit">
              更新资料
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      key: 'activities',
      label: (
        <span>
          <CheckCircleOutlined />
          活动记录
        </span>
      ),
      children: (
        <List
          dataSource={activities}
          locale={{ emptyText: <Empty description="暂无活动记录" /> }}
          renderItem={(activity: any) => (
            <List.Item>
              <List.Item.Meta
                title={activity.title}
                description={
                  <div>
                    <div>时间: {dayjs(activity.startTime).format('YYYY-MM-DD HH:mm')} - {dayjs(activity.endTime).format('YYYY-MM-DD HH:mm')}</div>
                    <div>地点: {activity.location}</div>
                    <div>
                      状态: 
                      <Tag color={activity.status === 'approved' ? 'green' : activity.status === 'pending' ? 'orange' : 'default'}>
                        {activity.status === 'approved' ? '已批准' : activity.status === 'pending' ? '待审核' : activity.status}
                      </Tag>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      key: 'checkins',
      label: (
        <span>
          <CalendarOutlined />
          签到轨迹
        </span>
      ),
      children: (
        <List
          dataSource={checkins}
          locale={{ emptyText: <Empty description="暂无签到记录" /> }}
          renderItem={(checkin: any) => (
            <List.Item>
              <List.Item.Meta
                title={checkin.checkpointName || '签到点'}
                description={
                  <div>
                    <div>时间: {dayjs(checkin.timestamp).format('YYYY-MM-DD HH:mm')}</div>
                    <div>活动: {checkin.activityTitle}</div>
                    <div>
                      状态: 
                      <Tag color={checkin.status === 'on_time' ? 'green' : checkin.status === 'late' ? 'orange' : 'red'}>
                        {checkin.status === 'on_time' ? '准时' : checkin.status === 'late' ? '延迟' : '缺席'}
                      </Tag>
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ),
    },
  ]

  return (
    <div className="dashboard-page">
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={8}>
            {/* 用户信息卡片 */}
            <Card variant="outlined" className="profile-card">
              <div className="profile-header">
                <Avatar size={64} icon={<UserOutlined />} src={user.avatar} />
                <div className="profile-info">
                  <Title level={4}>{user.realName || user.username}</Title>
                  <Text type="secondary">
                    {user.username} · {user.role === 'admin' ? '管理员' : user.role === 'organizer' ? '组织者' : '参与者'}
                  </Text>
                </div>
              </div>
              
              {/* 基本信息展示 */}
              <div className="profile-details">
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <Text strong>电子邮箱</Text>
                    <div style={{ marginTop: 4, color: '#666' }}>{user.email || '未设置'}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>手机号码</Text>
                    <div style={{ marginTop: 4, color: '#666' }}>{user.phone || '未设置'}</div>
                  </Col>
                  <Col span={12}>
                    <Text strong>注册时间</Text>
                    <div style={{ marginTop: 4, color: '#666' }}>
                      {user.createdAt ? dayjs(user.createdAt).format('YYYY-MM-DD') : '未知'}
                    </div>
                  </Col>
                  <Col span={12}>
                    <Text strong>经验等级</Text>
                    <div style={{ marginTop: 4, color: '#666' }}>
                      {user.experienceLevel === 'expert' ? '专家' : 
                       user.experienceLevel === 'advanced' ? '高级' : 
                       user.experienceLevel === 'intermediate' ? '中级' : 
                       user.experienceLevel === 'beginner' ? '初级' : user.experienceLevel || '未设置'}
                    </div>
                  </Col>
                </Row>
                <Row gutter={[16, 8]} style={{ marginTop: 8 }}>
                  <Col span={24}>
                    <Text strong>健康状况</Text>
                    <div style={{ marginTop: 4, color: '#666' }}>
                      {user.healthStatus || '未设置'}
                    </div>
                  </Col>
                  <Col span={24} style={{ marginTop: 8 }}>
                    <Text strong>紧急联系人</Text>
                    <div style={{ marginTop: 4, color: '#666' }}>
                      {user.emergencyContact || '未设置'}
                    </div>
                  </Col>
                </Row>
              </div>

              <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
            </Card>
          </Col>

          <Col xs={24} lg={16}>
            <Row gutter={[24, 24]}>
              <Col xs={24} md={12}>
                {/* 统计数据卡片 */}
                <Card title="数据统计" variant="outlined" className="stats-card">
                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic
                        title="参与活动"
                        value={stats.totalActivities}
                        prefix={<CalendarOutlined />}
                      />
                    </Col>
                    <Col span={12}>
                      <Statistic
                        title="完成签到"
                        value={stats.completedCheckins}
                        prefix={<CheckCircleOutlined />}
                      />
                    </Col>
                  </Row>

                  <Divider />

                  <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Statistic
                        title="即将开始"
                        value={stats.upcomingActivities}
                        prefix={<CalendarOutlined />}
                      />
                    </Col>
                  </Row>
                </Card>
              </Col>
              
              <Col xs={24} md={12}>
                {/* 签到记录卡片 */}
                <Card title="最近签到" variant="outlined" className="checkin-card">
                  <List
                    dataSource={checkins}
                    locale={{ emptyText: <Empty description="暂无签到记录" /> }}
                    renderItem={(checkin: any) => (
                      <List.Item>
                        <List.Item.Meta
                          title={checkin.checkpointName || '签到点'}
                          description={
                            <div>
                              <div>时间: {dayjs(checkin.timestamp).format('YYYY-MM-DD HH:mm')}</div>
                              <div>
                                状态: 
                                <Tag color={checkin.status === 'on_time' ? 'green' : checkin.status === 'late' ? 'orange' : 'red'}>
                                  {checkin.status === 'on_time' ? '准时' : checkin.status === 'late' ? '延迟' : '缺席'}
                                </Tag>
                              </div>
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Dashboard