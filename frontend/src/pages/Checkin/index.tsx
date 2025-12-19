import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Tag,
  Descriptions,
  message,
  Modal,
  Form,
  Input,
  Space,
  List,
  Divider,
  Empty,
} from 'antd'
import {
  EnvironmentOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import { getActivityById, getActivityRoutes, submitCheckin, getCheckinRecords } from '@/api/activity'
import { useAuthStore } from '@/store/useAuthStore'
import AMap from '@/components/AMap'
import type { Activity, Route, CheckinRecord } from '@/types'
import dayjs from 'dayjs'
import './index.less'

const { Title, Paragraph, Text } = Typography

function Checkin() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [activity, setActivity] = useState<Activity | null>(null)
  const [routes, setRoutes] = useState<Route[]>([])
  const [checkins, setCheckins] = useState<CheckinRecord[]>([])
  const [currentRoute, setCurrentRoute] = useState<Route | null>(null)
  const [currentLocation, setCurrentLocation] = useState<{ lng: number; lat: number } | null>(null)
  const [currentPointIndex, setCurrentPointIndex] = useState<number>(0)
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [notes, setNotes] = useState('')

  // 加载活动数据
  useEffect(() => {
    const loadData = async () => {
      if (!id) return

      setLoading(true)
      try {
        // 加载活动信息
        const activityData = await getActivityById(Number(id))
        setActivity(activityData)

        // 加载路线信息
        const routesData = await getActivityRoutes(Number(id))
        setRoutes(routesData)
        if (routesData.length > 0) {
          setCurrentRoute(routesData[0])
        }

        // 加载签到记录
        const checkinsData = await getCheckinRecords(Number(id), user?.id)
        setCheckins(checkinsData || [])
      } catch (error) {
        console.error('加载数据失败:', error)
        message.error('加载数据失败')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [id, user])

  // 定位完成回调
  const handleLocationComplete = (position: { lng: number; lat: number }) => {
    setCurrentLocation(position)
  }

  // 签到确认
  const handleCheckin = async () => {
    if (!activity || !currentRoute || !currentLocation) {
      message.error('定位信息不完整')
      return
    }

    // 检查是否已签到此点位
    const alreadyCheckedIn = checkins.some(
      item => item.pointIndex === currentPointIndex
    )

    if (alreadyCheckedIn) {
      message.warning('您已在此点位签到')
      return
    }

    setSubmitting(true)
    try {
      await submitCheckin({
        activityId: activity.id,
        routeId: currentRoute.id,
        pointIndex: currentPointIndex,
        checkpointName: `签到点${currentPointIndex + 1}`,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        status: 'on_time',
      })
      
      message.success('签到成功')
      setShowConfirmModal(false)
      setNotes('')
      
      // 刷新签到记录
      const checkinsData = await getCheckinRecords(Number(id), user?.id)
      setCheckins(checkinsData || [])
    } catch (error) {
      console.error('签到失败:', error)
      message.error('签到失败，请重试')
    } finally {
      setSubmitting(false)
    }
  }

  // 切换签到点
  const switchCheckinPoint = (index: number) => {
    setCurrentPointIndex(index)
  }

  // 计算到下一个签到点的距离
  const calculateNextPointDistance = () => {
    if (!currentLocation || !currentRoute || !currentRoute.pointsInfo) return null
    
    const currentPoint = currentRoute.pointsInfo[currentPointIndex]
    if (!currentPoint) return null
    
    // 这里应该调用地图组件提供的计算距离方法
    // 暂时返回一个示例值
    return Math.round(Math.random() * 1000) + 100 // 模拟距离，实际应使用真实计算
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <div>加载中...</div>
      </div>
    )
  }

  if (!activity || !currentRoute) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <Empty description="活动或路线信息不存在" />
      </div>
    )
  }

  // 获取当前签到点信息
  const currentCheckinPoint = currentRoute.pointsInfo?.[currentPointIndex]

  // 检查是否已完成所有签到点
  const finishedAllPoints = currentPointIndex >= (currentRoute.pointsInfo?.length || 0) - 1

  return (
    <div className="checkin-page">
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} md={16}>
            <Card title="地图签到" variant="outlined">
              <AMap
                center={currentLocation ? [currentLocation.lng, currentLocation.lat] : undefined}
                zoom={16}
                markers={
                  currentCheckinPoint
                    ? [
                        {
                          position: [currentCheckinPoint.longitude, currentCheckinPoint.latitude],
                          title: currentCheckinPoint.pointName || `签到点${currentPointIndex + 1}`,
                        },
                      ]
                    : []
                }
                onLocationComplete={handleLocationComplete}
              />

              <div className="checkin-info">
                <Descriptions column={2} size="small">
                  <Descriptions.Item label="当前位置">
                    {currentLocation ? `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}` : '获取中...'}
                  </Descriptions.Item>
                  <Descriptions.Item label="目标签到点">
                    {currentCheckinPoint ? currentCheckinPoint.pointName || `签到点${currentPointIndex + 1}` : '无'}
                  </Descriptions.Item>
                  {currentLocation && currentCheckinPoint && (
                    <Descriptions.Item label="距离目标点">
                      {calculateNextPointDistance()} 米
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="签到状态">
                    {finishedAllPoints ? (
                      <Tag color="success" icon={<CheckCircleOutlined />}>
                        已完成所有签到点
                      </Tag>
                    ) : (
                      <Tag color="processing" icon={<ClockCircleOutlined />}>
                        待签到
                      </Tag>
                    )}
                  </Descriptions.Item>
                </Descriptions>

                <div className="checkin-actions">
                  <Space>
                    <Button
                      type="primary"
                      size="large"
                      disabled={!currentLocation || finishedAllPoints}
                      onClick={() => setShowConfirmModal(true)}
                    >
                      {finishedAllPoints ? '已完成签到' : '签到此位置'}
                    </Button>
                    <Button
                      size="large"
                      icon={<HomeOutlined />}
                      onClick={() => navigate(`/activities/${id}`)}
                    >
                      返回活动
                    </Button>
                  </Space>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={8}>
            <Card title="路线信息" variant="outlined" className="route-info">
              <div className="route-title">{currentRoute.name}</div>
              <div className="route-details">
                <div>距离: {currentRoute.distance}km</div>
                <div>累计爬升: {currentRoute.elevationGain}m</div>
                <div>难度: {currentRoute.difficultyLevel}</div>
              </div>

              <Divider />

              <div className="checkpoint-list">
                <Title level={5}>签到点列表</Title>
                {currentRoute.pointsInfo && currentRoute.pointsInfo.length > 0 ? (
                  <List
                    size="small"
                    dataSource={currentRoute.pointsInfo}
                    renderItem={(point: any, index: number) => {
                      const isCheckedIn = checkins.some(item => item.pointIndex === index)
                      const isCurrent = index === currentPointIndex

                      return (
                        <List.Item
                          className={`checkpoint-item ${isCheckedIn ? 'checked' : ''} ${isCurrent ? 'current' : ''}`}
                          onClick={() => switchCheckinPoint(index)}
                        >
                          <div className="checkpoint-content">
                            <div className="checkpoint-name">
                              {point.pointName || `签到点${index + 1}`}
                            </div>
                            <div className="checkpoint-status">
                              {isCheckedIn ? (
                                <Tag color="success" icon={<CheckCircleOutlined />}>
                                  已签到
                                </Tag>
                              ) : (
                                <Tag
                                  color={isCurrent ? 'processing' : 'default'}
                                  icon={isCurrent ? <ClockCircleOutlined /> : null}
                                >
                                  {isCurrent ? '当前' : '待签到'}
                                </Tag>
                              )}
                            </div>
                          </div>
                        </List.Item>
                      )
                    }}
                  />
                ) : (
                  <Empty description="暂无签到点" />
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* 签到确认弹窗 */}
      <Modal
        title="签到确认"
        open={showConfirmModal}
        onOk={handleCheckin}
        onCancel={() => setShowConfirmModal(false)}
        confirmLoading={submitting}
      >
        <div className="checkin-confirm">
          <p>
            确认在此位置签到：<Text strong>{currentCheckinPoint?.pointName || `签到点${currentPointIndex + 1}`}</Text>
          </p>
          <p>
            当前位置：<Text type="secondary">
              {currentLocation ? `${currentLocation.lat.toFixed(6)}, ${currentLocation.lng.toFixed(6)}` : '未知'}
            </Text>
          </p>
          <Form.Item label="备注（可选）">
            <Input.TextArea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="可以添加签到备注信息"
              rows={3}
            />
          </Form.Item>
        </div>
      </Modal>
    </div>
  )
}

export default Checkin

