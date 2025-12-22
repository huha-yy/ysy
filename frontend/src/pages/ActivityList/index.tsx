import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Row,
  Col,
  Card,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Pagination,
  Spin,
  Empty,
} from 'antd'
import {
  SearchOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  ClockCircleOutlined,
  StarOutlined,
} from '@ant-design/icons'
import { getActivities } from '@/api/activity'
import type { Activity, PageResponse } from '@/types'
import dayjs from 'dayjs'
import './index.less'

const { Search } = Input

function ActivityList() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [activities, setActivities] = useState<Activity[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [size] = useState(12)
  const [keyword, setKeyword] = useState('')
  const [difficulty, setDifficulty] = useState<string>()

  // 加载活动列表
  const loadActivities = async () => {
    setLoading(true)
    try {
      const res: PageResponse<Activity> = await getActivities({
        page,
        size,
        keyword,
        difficulty,
      })
      setActivities(res.records)
      setTotal(res.total)
    } catch (error) {
      console.error('加载活动失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadActivities()
  }, [page, keyword, difficulty])

  // 难度标签颜色
  const getDifficultyColor = (level: string) => {
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
    return colors[level] || 'default'
  }

  // 难度文字
  const getDifficultyText = (level: string) => {
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
    return texts[level] || level
  }

  return (
    <div className="activity-list-page">
      <div className="container">
        {/* 搜索和筛选 */}
        <div className="filter-section">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={24} md={12}>
              <Search
                placeholder="搜索活动名称、地点"
                allowClear
                size="large"
                prefix={<SearchOutlined />}
                onSearch={setKeyword}
                enterButton
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Select
                placeholder="难度筛选"
                size="large"
                allowClear
                onChange={setDifficulty}
                style={{ width: '100%' }}
                options={[
                  { label: '入门', value: 'easy' },
                  { label: '中级', value: 'medium' },
                  { label: '高级', value: 'hard' },
                  { label: '专家', value: 'expert' },
                  { label: '简单', value: '简单' },
                  { label: '中等', value: '中等' },
                  { label: '困难', value: '困难' },
                ]}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Button size="large" block onClick={() => navigate('/organizer/activities/create')}>
                发布活动
              </Button>
            </Col>
          </Row>
        </div>

        {/* 活动列表 */}
        <Spin spinning={loading}>
          {activities.length > 0 ? (
            <>
              <Row gutter={[24, 24]}>
                {activities.map((activity) => (
                  <Col key={activity.id} xs={24} sm={12} md={8} lg={6}>
                    <Card
                      hoverable
                      className="activity-card"
                      cover={
                        <div className="card-cover">
                          <img
                            alt={activity.title}
                            src={activity.coverImage || '/images/default-activity-cover.svg'}
                          />
                          <Tag
                            color={getDifficultyColor(activity.difficulty)}
                            className="difficulty-tag"
                          >
                            {getDifficultyText(activity.difficulty)}
                          </Tag>
                        </div>
                      }
                      onClick={() => navigate(`/activities/${activity.id}`)}
                    >
                      <div className="card-content">
                        <h3 className="activity-title">{activity.title}</h3>
                        <Space direction="vertical" size={4} style={{ width: '100%' }}>
                          <div className="activity-meta">
                            <EnvironmentOutlined /> {activity.location}
                          </div>
                          <div className="activity-meta">
                            <ClockCircleOutlined /> {dayjs(activity.startTime).format('MM-DD HH:mm')}
                          </div>
                          <div className="activity-meta">
                            <TeamOutlined /> {activity.currentParticipants || 0}/{activity.capacity}
                          </div>
                          <div className="activity-price">
                            <span className="price">{activity.feeInfo}</span>
                          </div>
                        </Space>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>

              {/* 分页 */}
              <div className="pagination-wrapper">
                <Pagination
                  current={page}
                  pageSize={size}
                  total={total}
                  onChange={setPage}
                  showSizeChanger={false}
                  showTotal={(total) => `共 ${total} 个活动`}
                />
              </div>
            </>
          ) : (
            <Empty description="暂无活动" />
          )}
        </Spin>
      </div>
    </div>
  )
}

export default ActivityList

