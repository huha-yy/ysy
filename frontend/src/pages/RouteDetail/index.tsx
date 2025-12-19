import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Row,
  Col,
  Descriptions,
  Tag,
  Button,
  Table,
  message,
  Space,
  Spin,
  Empty,
  Divider,
  Typography,
  Modal,
} from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  EnvironmentOutlined,
  ArrowUpOutlined,
  ShareAltOutlined,
  PlusOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { getRouteById, deleteRoute, getRoutePoints } from '@/api/route'
import { getActivityById } from '@/api/activity'
import { useAuthStore } from '@/store/useAuthStore'
import type { Route, RoutePointInfo } from '@/api/route'
import type { Activity } from '@/types'
import './index.less'

const { Title, Text } = Typography

function RouteDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [route, setRoute] = useState<Route | null>(null)
  const [activity, setActivity] = useState<Activity | null>(null)
  const [points, setPoints] = useState<RoutePointInfo[]>([])

  // 加载路线详情
  const loadRouteDetail = async () => {
    if (!id) return

    setLoading(true)
    try {
      // 获取路线信息
      const routeData = await getRouteById(Number(id))
      setRoute(routeData)

      // 获取活动信息
      const activityData = await getActivityById(routeData.activityId)
      setActivity(activityData)

      // 获取路线点位信息
      const pointsData = await getRoutePoints(Number(id))
      setPoints(pointsData)
    } catch (error) {
      console.error('加载路线详情失败:', error)
      message.error('加载路线详情失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRouteDetail()
  }, [id])

  // 删除路线
  const handleDeleteRoute = () => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: '确定要删除这条路线吗？此操作不可恢复。',
      okText: '确定',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteRoute(Number(id))
          message.success('路线删除成功')
          navigate(`/activities/${route?.activityId}`)
        } catch (error) {
          console.error('删除路线失败:', error)
          message.error('删除路线失败')
        }
      },
    })
  }

  // 获取难度标签颜色
  const getDifficultyColor = (level?: string) => {
    const colors: Record<string, string> = {
      '入门': 'green',
      '初级': 'cyan',
      '中级': 'orange',
      '高级': 'red',
      '专家': 'purple',
    }
    return colors[level || ''] || 'default'
  }

  // 获取点位类型标签颜色
  const getPointTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      start: 'green',
      checkpoint: 'blue',
      rest: 'orange',
      end: 'red',
      emergency: 'purple',
    }
    return colors[type] || 'default'
  }

  // 获取点位类型文本
  const getPointTypeText = (type: string) => {
    const texts: Record<string, string> = {
      start: '起点',
      checkpoint: '检查点',
      rest: '休息点',
      end: '终点',
      emergency: '紧急点',
    }
    return texts[type] || type
  }

  // 点位表格列定义
  const pointColumns = [
    {
      title: '序号',
      dataIndex: 'pointIndex',
      key: 'pointIndex',
      width: 60,
    },
    {
      title: '名称',
      dataIndex: 'pointName',
      key: 'pointName',
    },
    {
      title: '类型',
      dataIndex: 'pointType',
      key: 'pointType',
      render: (type: string) => (
        <Tag color={getPointTypeColor(type)}>
          {getPointTypeText(type)}
        </Tag>
      ),
    },
    {
      title: '坐标',
      key: 'coordinates',
      render: (record: RoutePointInfo) => (
        <Text code>{`${record.latitude}, ${record.longitude}`}</Text>
      ),
    },
    {
      title: '预期到达时间',
      dataIndex: 'expectedMinutes',
      key: 'expectedMinutes',
      render: (minutes?: number) => minutes ? `${minutes} 分钟` : '-',
    },
    {
      title: '允许偏离',
      dataIndex: 'allowedDeviationMeters',
      key: 'allowedDeviationMeters',
      render: (meters?: number) => meters ? `${meters} 米` : '-',
    },
    {
      title: '允许延迟',
      dataIndex: 'allowedDelayMinutes',
      key: 'allowedDelayMinutes',
      render: (minutes?: number) => minutes ? `${minutes} 分钟` : '-',
    },
    {
      title: '必须签到',
      dataIndex: 'mandatory',
      key: 'mandatory',
      width: 100,
      render: (mandatory?: boolean) => mandatory ? '是' : '否',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
  ]

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!route) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <Empty description="路线不存在" />
      </div>
    )
  }

  return (
    <div className="route-detail-page">
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card
              title={
                <Space>
                  <Title level={3} style={{ margin: 0 }}>
                    {route.name}
                  </Title>
                  <Tag color={getDifficultyColor(route.difficultyLevel)}>
                    {route.difficultyLevel}
                  </Tag>
                </Space>
              }
              extra={
                (user?.role === 'organizer' || user?.role === 'admin') && (
                  <Space>
                    <Button
                      type="primary"
                      icon={<EditOutlined />}
                      onClick={() => navigate(`/organizer/routes/edit/${route.id}`)}
                    >
                      编辑路线
                    </Button>
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={handleDeleteRoute}
                    >
                      删除路线
                    </Button>
                  </Space>
                )
              }
            >
              <Descriptions column={2} bordered>
                <Descriptions.Item label="所属活动">
                  {activity?.title || '未知活动'}
                </Descriptions.Item>
                <Descriptions.Item label="距离">
                  {route.distance} km
                </Descriptions.Item>
                <Descriptions.Item label="累计爬升">
                  {route.elevationGain} m
                </Descriptions.Item>
                <Descriptions.Item label="难度等级">
                  <Tag color={getDifficultyColor(route.difficultyLevel)}>
                    {route.difficultyLevel}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="路线描述" span={2}>
                  {route.description || '无描述'}
                </Descriptions.Item>
              </Descriptions>

              {route.mapImgUrl && (
                <div style={{ marginTop: 24 }}>
                  <Title level={4}>路线图</Title>
                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <img
                      src={route.mapImgUrl}
                      alt="路线图"
                      style={{ maxWidth: '100%', maxHeight: '400px' }}
                    />
                  </div>
                </div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            <Card title="路线统计" variant="outlined">
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <div className="stat-item">
                    <EnvironmentOutlined style={{ fontSize: 24, color: '#1890ff' }} />
                    <div className="stat-value">{points.length}</div>
                    <div className="stat-label">点位数量</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <ShareAltOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                    <div className="stat-value">{route.distance}</div>
                    <div className="stat-label">总距离(km)</div>
                  </div>
                </Col>
              </Row>
              <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                <Col span={12}>
                  <div className="stat-item">
                    <ArrowUpOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
                    <div className="stat-value">{route.elevationGain}</div>
                    <div className="stat-label">累计爬升(m)</div>
                  </div>
                </Col>
                <Col span={12}>
                  <div className="stat-item">
                    <PlusOutlined style={{ fontSize: 24, color: '#722ed1' }} />
                    <div className="stat-value">
                      {points.filter(p => p.mandatory).length}
                    </div>
                    <div className="stat-label">必签点位</div>
                  </div>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Card title="路线点位详情" style={{ marginTop: 24 }}>
          <Table
            dataSource={points}
            columns={pointColumns}
            rowKey="pointIndex"
            pagination={false}
            locale={{ emptyText: '暂无点位信息' }}
          />
        </Card>
      </div>
    </div>
  )
}

export default RouteDetail
