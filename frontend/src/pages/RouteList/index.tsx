import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  message,
  Spin,
  Empty,
  Modal,
  Tooltip,
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons'
import { getRoutesPage, deleteRoute } from '@/api/route'
import { getActivityById } from '@/api/activity'
import { useAuthStore } from '@/store/useAuthStore'
import type { Route } from '@/api/route'
import type { PageResponse } from '@/types'
import './index.less'

const { Search } = Input
const { Option } = Select

function RouteList() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [routes, setRoutes] = useState<Route[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [size] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [activityId, setActivityId] = useState<number | undefined>()

  // 加载路线列表
  const loadRoutes = async () => {
    setLoading(true)
    try {
      const params: any = { page, size }
      if (keyword) params.keyword = keyword
      if (activityId) params.activityId = activityId

      const response: PageResponse<Route> = await getRoutesPage(params)
      
      // 为每条路线获取活动信息
      const routesWithActivity = await Promise.all(
        response.records.map(async (route) => {
          try {
            const activity = await getActivityById(route.activityId)
            return {
              ...route,
              activityTitle: activity.title,
            }
          } catch (error) {
            console.error(`获取活动 ${route.activityId} 信息失败:`, error)
            return {
              ...route,
              activityTitle: '未知活动',
            }
          }
        })
      )

      setRoutes(routesWithActivity)
      setTotal(response.total)
    } catch (error) {
      console.error('加载路线列表失败:', error)
      message.error('加载路线列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoutes()
  }, [page, keyword, activityId])

  // 删除路线
  const handleDeleteRoute = (id: number, name: string) => {
    Modal.confirm({
      title: '确认删除',
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除路线 "${name}" 吗？此操作不可恢复。`,
      okText: '确定',
      cancelText: '取消',
      okType: 'danger',
      onOk: async () => {
        try {
          await deleteRoute(id)
          message.success('路线删除成功')
          loadRoutes()
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

  // 表格列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: '路线名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Route) => (
        <Space>
          <EnvironmentOutlined />
          <span>{text}</span>
        </Space>
      ),
    },
    {
      title: '所属活动',
      dataIndex: 'activityTitle',
      key: 'activityTitle',
      render: (title: string, record: Route) => (
        <Button
          type="link"
          onClick={() => navigate(`/activities/${record.activityId}`)}
        >
          {title}
        </Button>
      ),
    },
    {
      title: '距离',
      dataIndex: 'distance',
      key: 'distance',
      width: 80,
      render: (distance: number) => `${distance} km`,
    },
    {
      title: '累计爬升',
      dataIndex: 'elevationGain',
      key: 'elevationGain',
      width: 100,
      render: (elevationGain: number) => `${elevationGain} m`,
    },
    {
      title: '难度等级',
      dataIndex: 'difficultyLevel',
      key: 'difficultyLevel',
      width: 100,
      render: (level: string) => (
        <Tag color={getDifficultyColor(level)}>{level}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date?: string) => date ? new Date(date).toLocaleString() : '-',
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      render: (record: Route) => (
        <Space>
          <Tooltip title="查看详情">
            <Button
              type="link"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/routes/${record.id}`)}
            />
          </Tooltip>
          
          {(user?.role === 'organizer' || user?.role === 'admin') && (
            <>
              <Tooltip title="编辑">
                <Button
                  type="link"
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/organizer/routes/edit/${record.id}`)}
                />
              </Tooltip>
              <Tooltip title="删除">
                <Button
                  type="link"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDeleteRoute(record.id, record.name)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="route-list-page">
      <div className="container">
        <Card
          title="路线管理"
          extra={
            <Space>
              {(user?.role === 'organizer' || user?.role === 'admin') && (
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => navigate(`/organizer/routes/create`)}
                >
                  创建路线
                </Button>
              )}
            </Space>
          }
        >
          <div className="filter-section">
            <Space wrap>
              <Search
                placeholder="搜索路线名称"
                allowClear
                style={{ width: 200 }}
                prefix={<SearchOutlined />}
                onSearch={setKeyword}
                enterButton
              />
              <Select
                placeholder="筛选活动"
                allowClear
                style={{ width: 200 }}
                onChange={setActivityId}
              >
                {/* 这里可以加载活动选项，目前简化处理 */}
              </Select>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={routes}
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
            locale={{ emptyText: <Empty description="暂无路线数据" /> }}
          />
        </Card>
      </div>
    </div>
  )
}

export default RouteList
