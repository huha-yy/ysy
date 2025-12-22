import { useNavigate } from 'react-router-dom'
import { Form, Input, Button, Card, App } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { login, getCurrentUser } from '@/api/auth'
import { useAuthStore } from '@/store/useAuthStore'
import './index.less'

function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form] = Form.useForm()
  const { message } = App.useApp()

  const handleSubmit = async (values: { username: string; password: string }) => {
    try {
      const res = await login(values)
      // 登录成功后，获取完整的用户信息
      try {
        const user = await getCurrentUser()
        setAuth(res.token, user.data)
        message.success('登录成功')
        navigate('/')
      } catch (userError) {
        console.error('获取用户信息失败:', userError)
        // 如果获取用户信息失败，至少设置基本用户信息
        const basicUser = {
          id: res.userId,
          username: res.username,
          role: res.role,
        }
        setAuth(res.token, basicUser)
        message.warning('登录成功，但获取用户详细信息失败')
        navigate('/')
      }
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

