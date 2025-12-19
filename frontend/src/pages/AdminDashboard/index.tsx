import { useState, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Tag,
  Form,
  Input,
  Select,
  message,
  Modal,
  Statistic,
} from 'antd'
import {
  EditOutlined,
} from '@ant-design/icons'
import {
  getAllUsers,
  changeUserRole,
  getSystemStats,
} from '@/api/auth'
import {
  useAuthStore
} from '@/store/useAuthStore'
import type { User } from '@/types'
import dayjs from 'dayjs'
import './index.less'


function AdminDashboard() {
  const { user, hasRole } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [allUsers, setAllUsers] = useState<User[]>([]) // 保存所有用户，用于搜索
  const [stats, setStats] = useState<any>(null)
  const [roleModalVisible, setRoleModalVisible] = useState(false)
  const [roleForm] = Form.useForm()
  const [currentUser, setCurrentUser] = useState<User | null>(null)

  // 检查管理员权限
  if (!hasRole('admin')) {
    return (
      <div style={{ padding: '80px 0', textAlign: 'center' }}>
        <div>您没有权限访问此页面</div>
      </div>
    )
  }

  // 加载数据
  const loadData = async () => {
    if (!user) return

    setLoading(true)
    try {
      // 并行加载用户列表和系统统计
      const [usersData, statsData] = await Promise.all([
        getAllUsers({ page: 1, size: 10 }),
        getSystemStats(),
      ])

      setUsers(usersData?.records || [])
      setAllUsers(usersData?.records || [])
      setStats(statsData)
    } catch (error) {
      console.error('加载数据失败:', error)
      // 不显示错误消息，因为API端点不存在是已知问题
      // 设置空数组避免页面崩溃
      setUsers([])
      setAllUsers([])
      setStats(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user])

  // 修改用户角色
  const handleRoleChange = async (values: any) => {
    try {
      await changeUserRole({
        userId: currentUser?.id || 0,
        role: values.role,
      })

      message.success(`用户角色已更新为 ${values.role}`)
      setRoleModalVisible(false)

      // 更新用户列表
      const usersData = await getAllUsers({ page: 1, size: 10 })
      setUsers(usersData?.records || [])
      setAllUsers(usersData?.records || [])
      
      roleForm.resetFields()
    } catch (error) {
      console.error('更新用户角色失败:', error)
      // 不显示错误消息，因为API端点不存在是已知问题
      message.error('更新用户角色失败，请重试')
    }
  }

  // 用户表格列
  const userColumns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '真实姓名',
      dataIndex: 'realName',
      key: 'realName',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => {
        const colorMap: Record<string, string> = {
          admin: 'red',
          organizer: 'green',
          participant: 'blue',
        }
        return <Tag color={colorMap[role] || '#1890ff'}>{role}</Tag>
      },
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (text: string) => dayjs(text).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'userAction',
      render: (_: any, record: User) => (
        <Button
          type="link"
          size="small"
          icon={<EditOutlined />}
          onClick={() => {
            setCurrentUser(record)
            setRoleModalVisible(true)
            roleForm.setFieldsValue({
              role: record.role,
            })
          }}
        >
          修改角色
        </Button>
      ),
    },
  ]

  return (
    <div className="admin-dashboard">
      <div className="container">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            {/* 系统统计卡片 */}
            <Card title="系统统计" variant="outlined" className="stats-card">
              {stats ? (
                <>
                  <Row gutter={[16, 16]}>
                    <Col span={8}>
                      <Card variant="outlined">
                        <Statistic
                          title="总用户数"
                          value={stats.totalUsers || 0}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card variant="outlined">
                        <Statistic
                          title="总活动数"
                          value={stats.totalActivities || 0}
                        />
                      </Card>
                    </Col>
                    <Col span={8}>
                      <Card variant="outlined">
                        <Statistic
                          title="总签到数"
                          value={stats.totalCheckins || 0}
                        />
                      </Card>
                    </Col>
                  </Row>

                  <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
                    <Col span={6}>
                      <Card variant="outlined">
                        <Statistic
                          title="已批准活动"
                          value={stats.approvedActivities || 0}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card variant="outlined">
                        <Statistic
                          title="待审核活动"
                          value={stats.pendingActivities || 0}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card variant="outlined">
                        <Statistic
                          title="完成签到"
                          value={stats.completedCheckins || 0}
                        />
                      </Card>
                    </Col>
                    <Col span={6}>
                      <Card variant="outlined">
                        <Statistic
                          title="签到率"
                          value={stats.totalCheckins && stats.completedCheckins 
                            ? Math.round((stats.completedCheckins / stats.totalCheckins) * 100)
                            : 0}
                          suffix="%"
                        />
                      </Card>
                    </Col>
                  </Row>
                </>
              ) : (
                <div>加载统计数据中...</div>
              )}
            </Card>
          </Col>

          <Col xs={24} lg={8}>
            {/* 用户管理表格 */}
            <Card title="用户管理" variant="outlined" className="user-table">
              <Input.Search
                placeholder="搜索用户"
                style={{ marginBottom: 16 }}
                onSearch={(value) => {
                  if (value) {
                    const filteredUsers = allUsers.filter(u =>
                      u.username.includes(value) ||
                      u.realName?.includes(value) ||
                      u.email?.includes(value)
                    )
                    setUsers(filteredUsers)
                  } else {
                    setUsers(allUsers)
                  }
                }}
              />

              <Table
                dataSource={users}
                columns={userColumns}
                rowKey="id"
                loading={loading}
                pagination={false}
                scroll={{ y: 300 }}
              />
            </Card>
          </Col>
        </Row>

        {/* 角色修改弹窗 */}
        <Modal
          title="修改用户角色"
          open={roleModalVisible}
          onCancel={() => setRoleModalVisible(false)}
          footer={null}
          width={500}
        >
          <Form
            form={roleForm}
            layout="vertical"
            onFinish={handleRoleChange}
          >
            <Form.Item name="role" label="选择角色">
              <Select>
                <Select.Option value="participant">参与者</Select.Option>
                <Select.Option value="organizer">组织者</Select.Option>
                <Select.Option value="admin">管理员</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                提交
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  )
}

export default AdminDashboard