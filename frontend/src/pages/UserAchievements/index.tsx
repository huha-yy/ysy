import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Statistic,
  Typography,
  Table,
  Tag,
  Progress,
  Space,
  Button,
  Avatar,
  Divider,
} from 'antd'
import {
  TrophyOutlined,
  FireOutlined,
  StarOutlined,
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import { useAuthStore } from '@/store/useAuthStore'
import type { CheckinRecord } from '@/types'
import './index.less'

const { Title, Text } = Typography

interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  points: number
  level: 'bronze' | 'silver' | 'gold' | 'diamond'
  unlockedAt: string
  progress?: number
  totalProgress?: number
}

interface UserStats {
  totalActivities: number
  completedActivities: number
  totalDistance: number
  totalCheckins: number
  avgRating: number
  joinDate: string
}

function UserAchievements() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [userStats, setUserStats] = useState<UserStats | null>(null)

  // 模拟用户成就数据
  const mockAchievements: Achievement[] = [
    {
      id: 1,
      name: '首次徒步',
      description: '完成您的第一次徒步活动',
      icon: '🎯',
      points: 10,
      level: 'bronze',
      unlockedAt: '2024-01-15',
    },
    {
      id: 2,
      name: '路线探索者',
      description: '创建了5条不同的徒步路线',
      icon: '🗺️',
      points: 50,
      level: 'silver',
      unlockedAt: '2024-03-20',
    },
    {
      id: 3,
      name: '登山达人',
      description: '累计徒步距离达到100公里',
      icon: '🏔️',
      points: 100,
      level: 'gold',
      unlockedAt: '2024-05-15',
    },
    {
      id: 4,
      name: '长期坚持',
      description: '连续3个月坚持每周徒步',
      icon: '🏃',
      points: 150,
      level: 'diamond',
      unlockedAt: '2024-08-15',
    },
    {
      id: 5,
      name: '领航专家',
      description: '成功带领团队完成10次长途徒步',
      icon: '🧭',
      points: 200,
      level: 'diamond',
      unlockedAt: '2024-10-15',
    },
  ]

  // 模拟用户统计数据
  const mockUserStats: UserStats = {
    totalActivities: 42,
    completedActivities: 38,
    totalDistance: 286.5,
    totalCheckins: 156,
    avgRating: 4.7,
    joinDate: '2023-02-15',
  }

  useEffect(() => {
    // 模拟加载成就数据
    setTimeout(() => {
      setAchievements(mockAchievements)
      setUserStats(mockUserStats)
      setLoading(false)
    }, 1000)
  }, [])

  // 获取成就等级颜色
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      bronze: '#d4b2a',
      silver: '#c0c0c0',
      gold: '#f1c40f',
      diamond: '#50c2e8',
    }
    return colors[level] || '#d4b2a'
  }

  // 获取成就进度
  const getProgressColor = (progress?: number, total?: number) => {
    if (!progress || !total) return '#f5f5f5'
    
    const percentage = (progress / total) * 100
    if (percentage >= 100) return '#52c41a'
    if (percentage >= 80) return '#faad14'
    if (percentage >= 60) return '#fa8c16'
    if (percentage >= 40) return '#faad14'
    return '#faad14'
  }

  return (
    <div className="user-achievements-page">
      <div className="container">
        <Row gutter={[24, 24]}>
          {/* 成就展示卡片 */}
          <Col xs={24} lg={16}>
            <Card title="个人成就" extra={
              <Button
                type="primary"
                icon={<TrophyOutlined />}
                onClick={() => {
                  message.info('成就系统开发中，更多功能即将推出')
                }}
              >
                查看全部成就
              </Button>
            }>
              <div className="achievement-summary">
                <div className="summary-item">
                  <Statistic
                    title="成就点数"
                    value={userStats?.totalCheckins || 0}
                    prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                    valueStyle={{ color: '#faad14' }}
                  />
                  <Text>总成就点数</Text>
                </div>
                <div className="summary-item">
                  <Statistic
                    title="活动参与"
                    value={userStats?.totalActivities || 0}
                    prefix={<CalendarOutlined style={{ color: '#1890ff' }} />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <Text>参与活动数</Text>
                </div>
                <div className="summary-item">
                  <Statistic
                    title="完成率"
                    value={userStats?.totalActivities && userStats?.completedActivities 
                      ? Math.round((userStats.completedActivities / userStats.totalActivities) * 100)
                      : 0}
                    suffix="%"
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <Text>活动完成率</Text>
                </div>
              </div>
            </Card>
          </Col>

          {/* 成就列表 */}
          <Col xs={24} lg={8}>
            <Card title="成就解锁进度">
              <div className="achievement-levels">
                <div className="level-indicator">
                  <Text>当前等级：</Text>
                  <div className="level-bar">
                    <div 
                      className={`level current`}
                      style={{ backgroundColor: getLevelColor('bronze') }}
                    />
                    <div 
                      className={`level ${mockAchievements[0].progress ? 'progress' : ''}`}
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                    <div 
                      className={`level ${mockAchievements[1].progress ? 'progress' : ''}`}
                      style={{ backgroundColor: '#f5f5f5' }}
                    />
                    <div 
                      className={`level ${mockAchievements[2].progress ? 'progress' : ''}`}
                      style={{ backgroundColor: '#c0c0c0' }}
                    />
                    <div 
                      className={`level ${mockAchievements[3].progress ? 'progress' : ''}`}
                      style={{ backgroundColor: '#f1c40f' }}
                    />
                    <div 
                      className={`level ${mockAchievements[4].progress ? 'progress' : ''}`}
                      style={{ backgroundColor: '#f1c40f' }}
                    />
                  </div>
                  <div style={{ textAlign: 'center', marginTop: '8px' }}>
                    <div className="level-info">
                      <TrophyOutlined style={{ fontSize: 24, color: getLevelColor('bronze') }} />
                      <Text style={{ fontSize: 16, color: '#fff' }}>入门</Text>
                    </div>
                    <div className="level-info">
                      <TrophyOutlined style={{ fontSize: 24, color: getLevelColor('silver') }} />
                      <Text style={{ fontSize: 16, color: '#fff' }}>进阶</Text>
                    </div>
                    <div className="level-info">
                      <TrophyOutlined style={{ fontSize: 24, color: getLevelColor('gold') }} />
                      <Text style={{ fontSize: 16, color: '#fff' }}>精通</Text>
                    </div>
                    <div className="level-info">
                      <TrophyOutlined style={{ fontSize: 24, color: getLevelColor('diamond') }} />
                      <Text style={{ fontSize: 16, color: '#fff' }}>大师</Text>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Col>

          {/* 成就列表 */}
          <Col xs={24} lg={16}>
            <Card title="成就详情" extra={
              <Button
                icon={<CalendarOutlined />}
                onClick={() => {
                  message.info('成就详情功能开发中')
                }}
              >
                查看历史记录
              </Button>
            }>
              <Table
                columns={[
                  {
                    title: '图标',
                    dataIndex: 'icon',
                    key: 'icon',
                    width: 60,
                    render: (icon: string) => (
                      <span style={{ fontSize: 24 }}>{icon}</span>
                    ),
                  },
                  {
                    title: '成就名称',
                    dataIndex: 'name',
                    key: 'name',
                  },
                  {
                    title: '描述',
                    dataIndex: 'description',
                    key: 'description',
                    ellipsis: true,
                  },
                  {
                    title: '成就点数',
                    dataIndex: 'points',
                    key: 'points',
                    width: 80,
                  },
                  {
                    title: '解锁时间',
                    dataIndex: 'unlockedAt',
                    key: 'unlockedAt',
                    width: 120,
                    render: (date: string) => {
                      const date = new Date(date)
                      return date.toLocaleString()
                    },
                  },
                  {
                    title: '进度',
                    key: 'progress',
                    width: 120,
                    render: (progress: number, record: Achievement) => (
                      <Progress
                        percent={Math.min((progress / 5) * 20, 100)}
                        size="small"
                        strokeColor={getProgressColor(record.progress, record.totalProgress)}
                        format={(percent: number) => `${percent}%`}
                      />
                    ),
                  },
                ]}
                dataSource={achievements}
                rowKey="id"
                pagination={false}
                locale={{ emptyText: '暂无成就数据' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 个人统计 */}
        <Col xs={24} lg={8}>
            <Card title="个人统计">
              <div className="stats-grid">
                <div className="stat-item">
                  <Statistic
                    title="总距离"
                    value={userStats?.totalDistance || 0}
                    suffix="km"
                    prefix={<EnvironmentOutlined />}
                    valueStyle={{ color: '#1890ff' }}
                  />
                  <Text>累计徒步距离</Text>
                </div>
                <div className="stat-item">
                  <Statistic
                    title="平均评分"
                    value={userStats?.avgRating || 0}
                    suffix="/ 5"
                    prefix={<StarOutlined />}
                    valueStyle={{ color: '#faad14' }}
                  />
                  <Text>平均活动评分</Text>
                </div>
                <div className="stat-item">
                  <Statistic
                    title="加入时间"
                    value={userStats?.joinDate || '-'}
                    prefix={<ClockCircleOutlined />}
                    valueStyle={{ color: '#52c41a' }}
                  />
                  <Text>注册时间</Text>
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default UserAchievements
