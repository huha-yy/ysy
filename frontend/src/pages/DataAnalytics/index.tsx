import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  DatePicker,
  Select,
  Button,
  Spin,
  message,
  Statistic,
  Table,
} from 'antd'
import {
  BarChartOutlined,
  ReloadOutlined,
  CalendarOutlined,
  UserOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import {
  getSystemStats,
  getActivitiesData,
  getUsersData,
  getRegionData,
  type SystemStats,
  type ActivitiesData,
  type UsersData,
  type RegionData,
} from '@/api/admin'
import { useAuthStore } from '@/store/useAuthStore'
import dayjs from 'dayjs'
import './index.less'

const { RangePicker } = DatePicker
const { Option } = Select

function DataAnalytics() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null)
  const [activitiesData, setActivitiesData] = useState<ActivitiesData | null>(null)
  const [usersData, setUsersData] = useState<UsersData | null>(null)
  const [regionData, setRegionData] = useState<RegionData | null>(null)
  const [days, setDays] = useState(30)
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'users' | 'regions'>('overview')

  // 检查管理员权限
  if (user?.role !== 'admin') {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div>您没有权限访问此页面</div>
      </div>
    )
  }

  // 加载系统统计数据
  const loadSystemStats = async () => {
    setLoading(true)
    try {
      const stats = await getSystemStats()
      setSystemStats(stats)
    } catch (error) {
      console.error('加载系统统计失败:', error)
      message.error('加载系统统计失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载活动数据分析
  const loadActivitiesData = async () => {
    setLoading(true)
    try {
      const data = await getActivitiesData(days)
      setActivitiesData(data)
    } catch (error) {
      console.error('加载活动数据失败:', error)
      message.error('加载活动数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载用户数据分析
  const loadUsersData = async () => {
    setLoading(true)
    try {
      const data = await getUsersData(days)
      setUsersData(data)
    } catch (error) {
      console.error('加载用户数据失败:', error)
      message.error('加载用户数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 加载地区数据分析
  const loadRegionData = async () => {
    setLoading(true)
    try {
      const data = await getRegionData()
      setRegionData(data)
    } catch (error) {
      console.error('加载地区数据失败:', error)
      message.error('加载地区数据失败')
    } finally {
      setLoading(false)
    }
  }

  // 根据活动选项卡加载数据
  useEffect(() => {
    switch (activeTab) {
      case 'overview':
        loadSystemStats()
        break
      case 'activities':
        loadActivitiesData()
        break
      case 'users':
        loadUsersData()
        break
      case 'regions':
        loadRegionData()
        break
    }
  }, [activeTab, days])

  // 活动统计表格列定义
  const activityStatsColumns = [
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '活动数量',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
    },
  ]

  // 用户活跃度表格列定义
  const userActivityColumns = [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: any) => (
        <div>
          <div>{record.realName || text}</div>
          <div style={{ fontSize: 12, color: '#999' }}>{text}</div>
        </div>
      ),
    },
    {
      title: '参与活动数',
      dataIndex: 'activityCount',
      key: 'activityCount',
      sorter: (a: any, b: any) => a.activityCount - b.activityCount,
    },
  ]

  // 地区统计表格列定义
  const regionStatsColumns = [
    {
      title: '地区',
      dataIndex: 'region',
      key: 'region',
    },
    {
      title: '活动数量',
      dataIndex: 'count',
      key: 'count',
      sorter: (a: any, b: any) => a.count - b.count,
    },
  ]

  return (
    <div className="data-analytics-page">
      {/* 过滤器和刷新按钮 */}
      <Card className="admin-card filter-card">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              {(activeTab === 'activities' || activeTab === 'users') && (
                <Select
                  value={days}
                  onChange={setDays}
                  style={{ width: 120 }}
                >
                  <Option value={7}>最近7天</Option>
                  <Option value={30}>最近30天</Option>
                  <Option value={90}>最近90天</Option>
                </Select>
              )}
            </Space>
          </Col>
          <Col>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                switch (activeTab) {
                  case 'overview':
                    loadSystemStats()
                    break
                  case 'activities':
                    loadActivitiesData()
                    break
                  case 'users':
                    loadUsersData()
                    break
                  case 'regions':
                    loadRegionData()
                    break
                }
              }}
              className="admin-btn admin-btn-primary"
            >
              刷新
            </Button>
          </Col>
        </Row>
      </Card>

      {/* 标签页导航 */}
      <Card className="admin-card tab-card" style={{ marginTop: 16 }}>
          <div className="tab-container">
            <div
              className={`tab-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChartOutlined />
              <span>系统概览</span>
            </div>
            <div
              className={`tab-item ${activeTab === 'activities' ? 'active' : ''}`}
              onClick={() => setActiveTab('activities')}
            >
              <CalendarOutlined />
              <span>活动分析</span>
            </div>
            <div
              className={`tab-item ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <UserOutlined />
              <span>用户分析</span>
            </div>
            <div
              className={`tab-item ${activeTab === 'regions' ? 'active' : ''}`}
              onClick={() => setActiveTab('regions')}
            >
              <EnvironmentOutlined />
              <span>地区分析</span>
            </div>
          </div>
        </Card>

        <Spin spinning={loading} style={{ width: '100%', minHeight: 400 }}>
          {activeTab === 'overview' && systemStats && (
            <div className="stats-container">
              <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
                <Col xs={24} sm={12} md={6}>
                  <Card className="admin-card admin-stat-card">
                    <Statistic
                      title="用户总数"
                      value={systemStats.userCount}
                      prefix={<UserOutlined />}
                      valueStyle={{ color: '#3f8600' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card className="admin-card admin-stat-card">
                    <Statistic
                      title="活动总数"
                      value={systemStats.activityCount}
                      prefix={<CalendarOutlined />}
                      valueStyle={{ color: '#1890ff' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card className="admin-card admin-stat-card">
                    <Statistic
                      title="报名总数"
                      value={systemStats.registrationCount}
                      prefix={<BarChartOutlined />}
                      valueStyle={{ color: '#722ed1' }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} md={6}>
                  <Card className="admin-card admin-stat-card">
                    <Statistic
                      title="签到总数"
                      value={systemStats.checkinCount}
                      prefix={<EnvironmentOutlined />}
                      valueStyle={{ color: '#fa8c16' }}
                    />
                  </Card>
                </Col>
                </Row>
              </div>
            )}

            {activeTab === 'activities' && activitiesData && (
              <div className="chart-container">
                <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
                  <Col span={24}>
                    <Card title="每日活动数量" className="admin-card" style={{ marginBottom: 24 }}>
                      <Table
                        dataSource={activitiesData.dailyStats}
                        columns={activityStatsColumns}
                        rowKey="date"
                        pagination={false}
                        size="small"
                        className="admin-table"
                      />
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card title="活动难度分布" className="admin-card">
                      <Row gutter={[16, 16]}>
                        {activitiesData.difficultyStats.map((item, index) => (
                          <Col key={index} xs={24} sm={12} md={6}>
                            <Card className="admin-card admin-stat-card">
                              <Statistic
                                title={item.difficulty}
                                value={item.count}
                                valueStyle={{
                                  color: item.difficulty === '简单' ? '#52c41a' :
                                         item.difficulty === '中等' ? '#fa8c16' :
                                         item.difficulty === '困难' ? '#f5222d' : '#722ed1'
                                }}
                              />
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card title="活动状态分布" className="admin-card">
                      <Row gutter={[16, 16]}>
                        {activitiesData.statusStats.map((item, index) => (
                          <Col key={index} xs={24} sm={12} md={6}>
                            <Card className="admin-card admin-stat-card">
                              <Statistic
                                title={item.status}
                                value={item.count}
                                valueStyle={{
                                  color: item.status === '已完成' ? '#52c41a' :
                                         item.status === '进行中' ? '#1890ff' :
                                         item.status === '已取消' ? '#f5222d' : '#8c8c8c'
                                }}
                              />
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}

            {activeTab === 'users' && usersData && (
              <div className="chart-container">
                <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
                  <Col span={24}>
                    <Card title="每日新增用户" className="admin-card" style={{ marginBottom: 24 }}>
                      <Table
                        dataSource={usersData.dailyStats}
                        columns={activityStatsColumns}
                        rowKey="date"
                        pagination={false}
                        size="small"
                        className="admin-table"
                      />
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card title="用户角色分布" className="admin-card">
                      <Row gutter={[16, 16]}>
                        {usersData.roleStats.map((item, index) => (
                          <Col key={index} xs={24} sm={8}>
                            <Card className="admin-card admin-stat-card">
                              <Statistic
                                title={item.role === 'participant' ? '参与者' :
                                         item.role === 'organizer' ? '组织者' : '管理员'}
                                value={item.count}
                                prefix={item.role === 'participant' ? <UserOutlined /> :
                                       item.role === 'organizer' ? <CalendarOutlined /> : <BarChartOutlined />}
                                valueStyle={{
                                  color: item.role === 'participant' ? '#1890ff' :
                                         item.role === 'organizer' ? '#fa8c16' : '#f5222d'
                                }}
                              />
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </Col>
                  <Col span={24}>
                    <Card title="用户活跃度TOP10" className="admin-card">
                      <Table
                        dataSource={usersData.activityStats.slice(0, 10)}
                        columns={userActivityColumns}
                        rowKey="userId"
                        pagination={false}
                        size="small"
                        className="admin-table"
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            )}

            {activeTab === 'regions' && regionData && (
              <div className="chart-container">
                <Row gutter={[24, 24]} style={{ marginTop: 16 }}>
                  <Col span={24}>
                    <Card title="地区活动分布" className="admin-card">
                      <Table
                        dataSource={regionData.regionStats}
                        columns={regionStatsColumns}
                        rowKey="region"
                        pagination={false}
                        size="small"
                        className="admin-table"
                      />
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
          </Spin>
    </div>
  )
}

export default DataAnalytics