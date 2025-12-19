import { useState, useEffect } from 'react'
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  message,
  Modal,
  Form,
  Avatar,
  Tooltip,
} from 'antd'
import {
  SearchOutlined,
  EditOutlined,
  UserOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import { getAllUsers, changeUserRole } from '@/api/admin'
import { useAuthStore } from '@/store/useAuthStore'
import type { PageResponse } from '@/types'
import './index.less'

const { Option } = Select

interface User {
  id: number
  username: string
  realName?: string
  email?: string
  phone?: string
  role: 'participant' | 'organizer' | 'admin'
  avatar?: string
  createdAt: string
  updatedAt?: string
}

function UserManagement() {
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<User[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [size] = useState(10)
  const [keyword, setKeyword] = useState('')
  const [roleModalVisible, setRoleModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [roleForm] = Form.useForm()

  // 加载用户列表
  const loadUsers = async () => {
    setLoading(true)
    try {
      const params: any = { page, size }
      if (keyword) params.keyword = keyword

      const response: PageResponse<User> = await getAllUsers(params)
      setUsers(response.records)
      setTotal(response.total)
    } catch (error) {
      console.error('加载用户列表失败:', error)
      message.error('加载用户列表失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [page, keyword])

  // 更改用户角色
  const handleChangeRole = (user: User) => {
    setSelectedUser(user)
    roleForm.setFieldsValue({
      userId: user.id,
      role: user.role,
    })
    setRoleModalVisible(true)
  }

  // 提交角色更改
  const handleSubmitRole = async (values: any) => {
    try {
      await changeUserRole(values.userId, values.role)
      message.success('用户角色更新成功')
      setRoleModalVisible(false)
      setSelectedUser(null)
      loadUsers()
    } catch (error) {
      console.error('更改用户角色失败:', error)
      message.error('更改用户角色失败')
    }
  }

  // 获取角色标签颜色
  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      participant: 'blue',
      organizer: 'orange',
      admin: 'red',
    }
    return colors[role] || 'default'
  }

  // 获取角色文本
  const getRoleText = (role: string) => {
    const texts: Record<string, string> = {
      participant: '参与者',
      organizer: '组织者',
      admin: '管理员',
    }
    return texts[role] || role
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
      title: '用户信息',
      key: 'userInfo',
      render: (record: User) => (
        <Space>
          <Avatar icon={<UserOutlined />} src={record.avatar} />
          <div>
            <div>{record.realName || record.username}</div>
            <div style={{ fontSize: 12, color: '#999' }}>
              {record.username}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      render: (email?: string) => email || '-',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
      key: 'phone',
      render: (phone?: string) => phone || '-',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role: string) => (
        <Tag color={getRoleColor(role)} className={`admin-tag admin-tag-${getRoleColor(role)}`}>
          {getRoleText(role)}
        </Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (record: User) => (
        <Space>
          {record.id !== user?.id && (user?.role === 'admin') && (
            <Tooltip title="更改角色">
              <Button
                type="link"
                icon={<EditOutlined />}
                onClick={() => handleChangeRole(record)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div className="user-management-page">
      <Card title="用户管理" className="admin-card">
          <div className="filter-section">
            <Space>
              <Input.Search
                placeholder="搜索用户名、真实姓名、邮箱或手机号"
                allowClear
                style={{ width: 300 }}
                prefix={<SearchOutlined />}
                onSearch={setKeyword}
                enterButton
                className="admin-input"
              />
              <Button
                icon={<ReloadOutlined />}
                onClick={loadUsers}
                className="admin-btn admin-btn-primary"
              >
                刷新
              </Button>
            </Space>
          </div>

          <Table
            columns={columns}
            dataSource={users}
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
            locale={{ emptyText: '暂无用户数据' }}
            className="admin-table"
          />
        </Card>

        {/* 更改角色弹窗 */}
        <Modal
          title="更改用户角色"
          open={roleModalVisible}
          onCancel={() => {
            setRoleModalVisible(false)
            setSelectedUser(null)
            roleForm.resetFields()
          }}
          footer={null}
          width={500}
        >
          <Form
            form={roleForm}
            layout="vertical"
            onFinish={handleSubmitRole}
            className="admin-form"
          >
            <Form.Item name="userId" hidden>
              <Input />
            </Form.Item>
            
            {selectedUser && (
              <div style={{ marginBottom: 16 }}>
                <p><strong>用户：</strong> {selectedUser.realName || selectedUser.username}</p>
                <p><strong>当前角色：</strong> 
                  <Tag color={getRoleColor(selectedUser.role)} style={{ marginLeft: 8 }}>
                    {getRoleText(selectedUser.role)}
                  </Tag>
                </p>
              </div>
            )}
            
            <Form.Item
              name="role"
              label="新角色"
              rules={[{ required: true, message: '请选择用户角色' }]}
            >
              <Select>
                <Option value="participant">参与者</Option>
                <Option value="organizer">组织者</Option>
                <Option value="admin">管理员</Option>
              </Select>
            </Form.Item>
            
            <Form.Item style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => {
                  setRoleModalVisible(false)
                  setSelectedUser(null)
                  roleForm.resetFields()
                }}>
                  取消
                </Button>
                <Button type="primary" htmlType="submit" className="admin-btn admin-btn-primary">
                  确定
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Modal>
    </div>
  )
}

export default UserManagement
