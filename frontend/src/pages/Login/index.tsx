import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login } from '@/api/auth'
import { useAuthStore } from '@/store/useAuthStore'
import './index.less'

function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form] = Form.useForm()

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      const res = await login(values)
      // 从登录响应构建用户对象
      const user = {
        id: res.userId,
        username: res.username,
        email: '', // 登录响应中没有这个字段
        phone: '', // 登录响应中没有这个字段
        role: res.role,
        createdAt: new Date().toISOString()
      }
      setAuth(res.token, user)
      message.success('登录成功')
      navigate('/')
    } catch (error) {
      message.error('登录失败，请检查用户名和密码')
    }
  }

  return (
    <div className="login-page">
      <Card variant="outlined" className="login-card">
        <div className="login-header">
          <h1>🏔️ 户外徒步</h1>
          <p>探索自然，挑战自我</p>
        </div>

        <Form form={form} onFinish={handleSubmit} size="large">
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              登录
            </Button>
          </Form.Item>

          <div className="login-footer">
            还没有账号？
            <Button type="link" onClick={() => navigate('/register')}>
              立即注册
            </Button>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login

