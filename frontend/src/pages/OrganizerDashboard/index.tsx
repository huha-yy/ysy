import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Typography,
  Tabs,
  Table,
  Tag,
  Form,
  Input,
  Select,
  message,
  Modal,
  Statistic,
  Space,
} from 'antd'
import {
  PlusOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  ShareAltOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  StarOutlined,
} from '@ant-design/icons'
import { 
  getOrganizerActivities, 
  getPendingRegistrations, 
  reviewRegistration,
  getRegistrationStats 
} from '@/api/activity'
import { useAuthStore } from '@/store/useAuthStore'
import { useNavigate } from 'react-router-dom'
import type { Activity, Registration } from '@/types'
import dayjs from 'dayjs'
import './index.less'

const { Title, Paragraph, Text } = Typography
const { TextArea } = Input

function OrganizerDashboard() {
  const { user, hasRole } = useAuthStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('activities')
  const [activities, setActivities] = useState<Activity[]>([])
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [stats, setStats] = useState<any>(null)
  const [reviewModalVisible, setReviewModalVisible] = useState(false)
  const [reviewForm] = Form.useForm()
  const [currentActivity, setCurrentActivity] = useState<Activity | null>(null)

  // 检查用户权限
  if (!hasRole('organizer') && !hasRole('admin')) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div>您没有权限访问此页面</div>
      </div>
    )
  }

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        // 并行加载活动列表和报名申请
        const [activitiesData, registrationsData] = await Promise.all([
          getOrganizerActivities({ page: 1, size: 10 }),
          getPendingRegistrations({ page: 1, size: 10 }),
        ])
        
        // 如果API返回的数据是所有活动，则在前端筛选当前用户创建的活动
        const allActivities = activitiesData?.records || []
        const filteredActivities = allActivities.filter((activity: any) => 
          activity.organizerId === user?.userId || hasRole('admin')
        )
        
        setActivities(filteredActivities)
        setRegistrations(registrationsData?.records || [])
      } catch (error) {
        console.error('加载数据失败:', error)
        message.error('加载数据失败')
        // 设置空数组避免页面崩溃
        setActivities([])
        setRegistrations([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user, hasRole])

  // 审核报名申请
  const handleReview = async (values: any) => {
    try {
      await reviewRegistration({
        id: values.id,
        status: values.status,
        notes: values.notes,
      })
      
      message.success(`申请已${values.status === 'approved' ? '批准' : values.status === 'rejected' ? '拒绝' : '处理为候补'}`)
      setReviewModalVisible(false)
      
      // 刷新报名列表
      const registrationsData = await getPendingRegistrations({ page: 1, size: 10 })
      setRegistrations(registrationsData?.records || [])
    } catch (error) {
      console.error('审核失败:', error)
      message.error('审核失败，请重试')
    }
  }

  // 查看活动报名统计
  const handleViewStats = async (activityId: number) => {
    try {
      const statsData = await getRegistrationStats(activityId)
      setStats(statsData)
      setCurrentActivity(activities.find(a => a.id === activityId))
    } catch (error) {
      console.error('获取统计数据失败:', error)
      message.error('获取统计数据失败')
    }
  }

  // 表格列定义
  const activityColumns = [
    {
      title: '活动名称',
      dataIndex: 'title',
      key: 'title',
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
    },
    {
      title: '人数',
      dataIndex: 'capacity',
      key: 'capacity',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          draft: 'default',
          pending: 'processing',
          approved: 'success',
          rejected: 'error',
          closed: 'default',
        }
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Activity) => (
        <Button
          type="link"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewStats(record.id)}
        >
          查看统计
        </Button>
      ),
    },
  ]

  const registrationColumns = [
    {
      title: '申请人',
      dataIndex: ['user', 'realName'],
      key: 'applicant',
      render: (_, record: any) => record.user?.realName || record.user?.username || '未知',
    },
    {
      title: '申请时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          pending: 'processing',
          approved: 'success',
          rejected: 'error',
          waiting: 'warning',
        }
        return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record: Registration) => (
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => {
            setCurrentActivity(activities.find(a => a.id === record.activityId))
            setReviewModalVisible(true)
            reviewForm.setFieldsValue({
              id: record.id,
              status: 'approved',
              notes: '',
            })
          }}
        >
          审核
        </Button>
      ),
    },
  ]

  // Tab items配置
  const tabItems = [
    {
      key: 'activities',
      label: (
        <span>
          <PlusOutlined />
          我的活动
        </span>
      ),
      children: (
        <Table
          dataSource={activities}
          columns={activityColumns}
          loading={loading}
          pagination={false}
          rowKey="id"
        />
      ),
    },
    {
      key: 'registrations',
      label: (
        <span>
          <CheckCircleOutlined />
          报名管理
        </span>
      ),
      children: (
        <Table
          dataSource={registrations}
          columns={registrationColumns}
          loading={loading}
          pagination={false}
          rowKey="id"
        />
      ),
    },
    {
      key: 'routes',
      label: (
        <span>
          <ShareAltOutlined />
          路线管理
        </span>
      ),
      children: (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Title level={4}>路线管理</Title>
          <Paragraph>
            在这里可以管理您组织的活动路线，包括创建、编辑和查看路线。
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/organizer/routes')}
            >
              查看所有路线
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                // 如果有活动，选择第一个活动；否则提示先创建活动
                if (activities.length > 0) {
                  navigate(`/organizer/routes/create/${activities[0].id}`)
                } else {
                  message.warning('请先创建活动，再创建路线')
                  navigate('/organizer/activities/create')
                }
              }}
            >
              创建新路线
            </Button>
          </Space>
        </div>
      ),
    },
    {
      key: 'registration-management',
      label: (
        <span>
          <TeamOutlined />
          报名管理
        </span>
      ),
      children: (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Title level={4}>报名管理</Title>
          <Paragraph>
            在这里可以查看和管理您组织活动的报名申请，包括审核和处理报名信息。
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => navigate('/organizer/registrations')}
            >
              查看所有报名
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                // 如果有活动，选择第一个活动；否则提示先创建活动
                if (activities.length > 0) {
                  message.info(`已跳转到活动 ${activities[0].title} 的报名管理`)
                } else {
                  message.warning('请先创建活动，再管理报名')
                  navigate('/organizer/activities/create')
                }
              }}
            >
              管理活动报名
            </Button>
          </Space>
        </div>
      ),
    },
    {
      key: 'feedbacks',
      label: (
        <span>
          <StarOutlined />
          反馈管理
        </span>
      ),
      children: (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Title level={4}>反馈管理</Title>
          <Paragraph>
            在这里可以查看和管理您组织的活动反馈，包括分析反馈统计和改进服务质量。
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              icon={<EyeOutlined />}
              onClick={() => navigate('/organizer/feedbacks')}
            >
              查看所有反馈
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                // 如果有活动，选择第一个活动；否则提示先创建活动
                if (activities.length > 0) {
                  message.info(`已跳转到活动 ${activities[0].title} 的反馈管理`)
                } else {
                  message.warning('请先创建活动，再管理反馈')
                  navigate('/organizer/activities/create')
                }
              }}
            >
              管理活动反馈
            </Button>
          </Space>
        </div>
      ),
    },
    {
      key: 'checkpoints',
      label: (
        <span>
          <EnvironmentOutlined />
          签到点设置
        </span>
      ),
      children: (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Title level={4}>签到点设置</Title>
          <Paragraph>
            在这里可以设置和管理活动路线的签到点，确保参与者能够按时签到，提升活动安全性。
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              icon={<EnvironmentOutlined />}
              onClick={() => navigate('/organizer/checkpoints')}
            >
              查看所有签到点
            </Button>
            <Button
              icon={<PlusOutlined />}
              onClick={() => {
                // 如果有活动，选择第一个活动；否则提示先创建活动
                if (activities.length > 0) {
                  message.info(`已跳转到活动 ${activities[0].title} 的签到点设置`)
                } else {
                  message.warning('请先创建活动，再设置签到点')
                  navigate('/organizer/activities/create')
                }
              }}
            >
              设置签到点
            </Button>
          </Space>
        </div>
      ),
    },
  ]

  return (
    <div className="organizer-dashboard">
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
          </Col>
        </Row>

        {/* 报名审核弹窗 */}
        <Modal
          title="审核报名申请"
          open={reviewModalVisible}
          onCancel={() => setReviewModalVisible(false)}
          footer={null}
          width={600}
        >
          {currentActivity && (
            <div>
              <Paragraph>
                <Text strong>活动: {currentActivity.title}</Text>
                <br />
                <Text type="secondary">
                  时间: {dayjs(currentActivity.startTime).format('YYYY-MM-DD HH:mm')} - {dayjs(currentActivity.endTime).format('YYYY-MM-DD HH:mm')}
                  <br />
                  地点: {currentActivity.location}
                </Text>
              </Paragraph>
              
              <Form
                form={reviewForm}
                layout="vertical"
                onFinish={handleReview}
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
                    <Select.Option value="approved">批准</Select.Option>
                    <Select.Option value="rejected">拒绝</Select.Option>
                    <Select.Option value="waiting">候补</Select.Option>
                  </Select>
                </Form.Item>
                
                <Form.Item
                  name="notes"
                  label="审核备注"
                >
                  <TextArea rows={4} placeholder="请输入审核备注" />
                </Form.Item>
                
                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    提交审核
                  </Button>
                </Form.Item>
              </Form>
            </div>
          )}
        </Modal>

        {/* 统计数据弹窗 */}
        {stats && (
          <Modal
            title="活动报名统计"
            open={!!stats}
            onCancel={() => setStats(null)}
            footer={[
              <Button onClick={() => setStats(null)}>关闭</Button>,
            ]}
            width={600}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Card variant="outlined">
                  <Statistic
                    title="总报名人数"
                    value={stats.totalRegistrations || stats.data?.totalRegistrations || 0}
                  />
                </Card>
              </Col>
              <Col span={12}>
                <Card variant="outlined">
                  <Statistic
                    title="已批准人数"
                    value={stats.approvedCount || stats.data?.approvedCount || 0}
                  />
                </Card>
              </Col>
            </Row>
            
            {currentActivity && (
              <>
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card variant="outlined">
                      <Statistic
                        title="待审核人数"
                        value={stats.pendingCount || stats.data?.pendingCount || 0}
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card variant="outlined">
                      <Statistic
                        title="拒绝人数"
                        value={stats.rejectedCount || stats.data?.rejectedCount || 0}
                      />
                    </Card>
                  </Col>
                </Row>
                
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Card variant="outlined">
                      <Statistic
                        title="完成率"
                        value={stats.completionRate || stats.data?.completionRate || 0}
                        suffix="%"
                      />
                    </Card>
                  </Col>
                  <Col span={12}>
                    <Card variant="outlined">
                      <Statistic
                        title="活动评分"
                        value={stats.averageRating || stats.data?.averageRating || 0}
                        precision={1}
                        suffix="/ 5"
                      />
                    </Card>
                  </Col>
                </Row>
              </>
            )}
          </Modal>
        )}
      </div>
    </div>
  )
}

export default OrganizerDashboard