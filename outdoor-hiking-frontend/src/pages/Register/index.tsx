import { Empty, Button } from 'antd'
import { useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()

  return (
    <div style={{ padding: '80px 0', textAlign: 'center' }}>
      <Empty description="注册页面待实现">
        <Button type="primary" onClick={() => navigate('/login')}>
          返回登录
        </Button>
      </Empty>
    </div>
  )
}

export default Register

