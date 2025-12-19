import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Typography,
  Tabs,
  Table,
  DatePicker,
  Select,
  Button,
} from 'antd'
import {
  BarChart,
  PieChart,
  LineChart,
} from 'echarts'
import {
  CalendarOutlined,
  TrendingUpOutlined,
} from '@ant-design/icons'
import { 
  getActivitiesData,
  getUsersData,
  getRegionData,
} from '@/api/auth'
import { useAuthStore } from '@/store/useAuthStore'
import dayjs from 'dayjs'
import './index.less'

const { Title, Paragraph, Text } = Typography

function DataAnalytics() {
  const { user, hasRole } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('activities')
  const [activitiesData, setActivitiesData] = useState<any[]>([])
  const [usersData, setUsersData] = useState<any[]>([])
  const [regionData, setRegionData] = useState<any[]>([])
  const [dateRange, setDateRange] = useState<[any, any]>([
    dayjs().subtract(30, 'day'),
    dayjs(),
  ])
  const [chartType, setChartType] = useState<'activities' | 'users' | 'regions'>('activities')

  // 检查管理员权限
  if (!hasRole('admin')) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div>您没有权限访问此页面</div>
      </div>
    )
  }

  // 加载数据
  useEffect(() => {
    const loadData = async () => {
      if (!user) return

      setLoading(true)
      try {
        // 并行加载所有数据
        const [activitiesResult, usersResult, regionsResult] = await Promise.all([
          getActivitiesData({ days: 30 }),
          getUsersData({ days: 30 }),
          getRegionData({ days: 30 }),
        ])

        setActivitiesData(activitiesResult?.activities || [])
        setUsersData(usersResult?.users || [])
        setRegionData(regionsResult?.regions || [])
      } catch (error) {
        console.error('加载数据失败:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  // 活动统计图表配置
  const activitiesChartOptions = {
    title: {
      text: '活动数量趋势',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['活动状态分布'],
    },
    grid: {
      left: '10%',
      right: '10%',
    },
    xAxis: {
      type: 'category',
      data: activitiesData.map(item => item.date),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '总活动数',
        type: 'line',
        smooth: true,
        data: activitiesData.map(item => ({
          date: item.date,
          total: item.total || 0,
          approved: item.approved || 0,
          pending: item.pending || 0,
          rejected: item.rejected || 0,
        })),
      },
    ],
  }

  // 用户统计图表配置
  const usersChartOptions = {
    title: {
      text: '用户注册趋势',
      left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {
      data: ['用户角色分布'],
    },
    grid: {
      left: '10%',
      right: '10%',
    },
    xAxis: {
      type: 'category',
      data: usersData.map(item => item.date),
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        name: '新注册用户',
        type: 'line',
        smooth: true,
        data: usersData.map(item => ({
          date: item.date,
          total: item.total || 0,
          participant: item.participant || 0,
          organizer: item.organizer || 0,
          admin: item.admin || 0,
        })),
      },
      ],
  }

  // 地区分布图表配置
  const regionsChartOptions = {
    title: {
      text: '活动地区分布',
      left: 'center',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)',
    },
    legend: {
      data: ['地区'],
    },
    series: [
      {
        name: '活动数量',
        type: 'pie',
        radius: ['40%', '70%'],
        data: regionData.map(item => ({
          name: item.region,
          value: item.count || 0,
        })),
      },
    ],
  }

  return (
    <div className="data-analytics">
      <div className="container">
        <Title level={2}>数据统计与分析</Title>
        <Paragraph>查看系统运营数据和趋势分析，帮助优化运营策略。</Paragraph>
        
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <Card title="时间筛选" className="filter-card">
              <DatePicker.RangePicker
                value={dateRange}
                onChange={setDateRange}
                style={{ width: '100%' }}
                format="YYYY-MM-DD"
              />
              
              <Button
                type="primary"
                onClick={() => loadData()}
                style={{ marginTop: 16 }}
              >
                查询数据
              </Button>
            </Card>
          </Col>
        </Row>

        <Row gutter={[24, 24]}>
          <Col xs={24} lg={18}>
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <Tabs.TabPane tab="活动统计" key="activities">
                <Card>
                  <BarChart
                    style={{ height: 300 }}
                    option={activitiesChartOptions}
                    notMerge={true}
                  />
                </Card>
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="用户统计" key="users">
                <Card>
                  <BarChart
                    style={{ height: 300 }}
                    option={usersChartOptions}
                    notMerge={true}
                  />
                </Card>
              </Tabs.TabPane>
              
              <Tabs.TabPane tab="地区分析" key="regions">
                <Card>
                  <PieChart
                    style={{ height: 300 }}
                    option={regionsChartOptions}
                    notMerge={true}
                  />
                </Card>
              </Tabs.TabPane>
            </Tabs>
          </Col>

          <Col xs={24} lg={6}>
            <Card title="数据表格" className="table-card">
              <Tabs activeKey={chartType} onChange={setChartType}>
                <Tabs.TabPane tab="活动数据" key="activities-data">
                  <Table
                    dataSource={activitiesData}
                    columns={[
                      {
                        title: '日期',
                        dataIndex: 'date',
                        key: 'date',
                      render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
                      sorter: (a: any, b: any) => 
                          dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
                        ),
                      },
                      {
                        title: '总活动数',
                        dataIndex: 'total',
                        key: 'total',
                      render: (text: number, record: any) => <Text strong>{text}</Text>,
                      sorter: (a: any, b: any) => b.total - a.total,
                      ),
                      {
                        title: '已批准',
                        dataIndex: 'approved',
                        key: 'approved',
                        render: (text: number, record: any) => <Text strong>{text}</Text>,
                      sorter: (a: any, b: any) => b.approved - a.approved,
                      ),
                      {
                        title: '待审核',
                        dataIndex: 'pending',
                        key: 'pending',
                        render: (text: number, record: any) => <Text strong>{text}</Text>,
                        sorter: (a: any, b: any) => b.pending - a.pending,
                      ),
                      {
                        title: '已拒绝',
                        dataIndex: 'rejected',
                        key: 'rejected',
                        render: (text: number, record: any) => <Text strong>{text}</Text>,
                        sorter: (a: any, b: any) => b.rejected - a.rejected,
                      ),
                    ]}
                    pagination={false}
                    scroll={{ y: 300 }}
                    rowKey="id"
                  />
                </Tabs.TabPane>
                
                <Tabs.TabPane tab="用户数据" key="users-data">
                  <Table
                    dataSource={usersData}
                    columns={[
                      {
                        title: '日期',
                        dataIndex: 'date',
                        key: 'date',
                        render: (text: string) => dayjs(text).format('YYYY-MM-DD'),
                        sorter: (a: any, b: any) => 
                          dayjs(a.date).valueOf() - dayjs(b.date).valueOf(),
                        ),
                      },
                      {
                        title: '新用户',
                        dataIndex: 'total',
                        key: 'total',
                        render: (text: number, record: any) => <Text strong>{text}</Text>,
                        sorter: (a: any, b: any) => b.total - a.total,
                        ),
                      {
                        title: '参与者',
                        dataIndex: 'participant',
                        key: 'participant',
                        render: (text: number, record: any) => <Text strong>{text}</Text>,
                        sorter: (a: any, b: any) => b.participant - a.participant,
                        ),
                      {
                        title: '组织者',
                        dataIndex: 'organizer',
                        key: 'organizer',
                        render: (text: number, record: any) => <Text strong>{text}</Text>,
                        sorter: (a: any, b: any) => b.organizer - a.organizer,
                        ),
                      {
                        title: '管理员',
                        dataIndex: 'admin',
                        key: 'admin',
                        render: (text: number, record: any) => <Text strong>{text}</Text>,
                        sorter: (a: any, b: any) => b.admin - a.admin,
                        ),
                      },
                    ]}
                    pagination={false}
                    scroll={{ y: 300 }}
                    rowKey="id"
                  />
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default DataAnalytics
